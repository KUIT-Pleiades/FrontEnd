import { useQuery } from "@tanstack/react-query";
import { getOfficialFaceItems } from "../../api/marketApi";

export const useOfficialFaceItems = () => {
  return useQuery({
    queryKey: ["official", "face"],
    queryFn: getOfficialFaceItems,
  });
};
