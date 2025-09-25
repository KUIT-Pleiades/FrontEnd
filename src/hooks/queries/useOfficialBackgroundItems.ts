import { useQuery } from "@tanstack/react-query";
import { getOfficialBackgroundItems } from "../../api/marketApi";

export const useOfficialBackgroundItems = () => {
  return useQuery({
    queryKey: ["official", "background"],
    queryFn: getOfficialBackgroundItems,
  });
};
