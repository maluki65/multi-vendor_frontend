import { useQuery } from "@tanstack/react-query";
import { FetchPendingVendors } from "../utils";

const usePendingVendors = () => {
  return useQuery({
    queryKey: ['pendingVendors'],
    queryFn: FetchPendingVendors,
  });
};

export default usePendingVendors