// hooks/useSearchUsers.ts
import { useQuery } from '@tanstack/react-query';
import { axiosRequest } from '../../../functions/axiosRequest';
import { SearchedUser } from '../../../interfaces/Interfaces';

export const useSearchUsers = (keyword: string, enabled: boolean) => {
  const query = useQuery({
    queryKey: ['searchUsers', keyword],
    queryFn: async () => {
      const response = await axiosRequest<{ users: SearchedUser[] }>(
        `/users?user_id=${keyword}`,
        "GET",
        null
      );
      return response?.data.users || [];
    },
    enabled,
  });

  return query; // ✅ data, isLoading, refetch 등 외부에서 사용 가능
};