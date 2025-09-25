import { useQuery } from "@tanstack/react-query";
import { getOfficialClothItems } from "../../api/marketApi";

export const useOfficialClothItems = () => {
  return useQuery({
    queryKey: ["official", "cloth"],
    queryFn: getOfficialClothItems,
  });
};
