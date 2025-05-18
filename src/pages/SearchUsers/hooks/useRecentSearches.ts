// hooks/useRecentSearches.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosRequest } from '../../../functions/axiosRequest';
import { RecentSearchedUser } from '../../../interfaces/Interfaces';

export const useRecentSearches = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['recentSearches'],
    queryFn: async () => {
      const response = await axiosRequest<{ users: RecentSearchedUser[] }>(
        "/users/histories",
        "GET",
        null
      );
      return response?.data.users || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosRequest(`/users/histories/${id}`, "DELETE", null),

    // ✅ Optimistic UI 업데이트
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['recentSearches'] });

      const previousData = queryClient.getQueryData<RecentSearchedUser[]>(['recentSearches']);

      queryClient.setQueryData<RecentSearchedUser[]>(['recentSearches'], (old = []) =>
        old.filter(user => user.userId !== deletedId)
      );

      return { previousData };
    },

    // ❌ 실패 시 롤백
    onError: (_err, _deletedId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['recentSearches'], context.previousData);
      }
    },

    // ✅ 완료 후 정합성 재검증
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSearches'] });
    },
  });

  return {
    data,
    isLoading,
    refetch,
    remove: deleteMutation.mutate,
  };
};