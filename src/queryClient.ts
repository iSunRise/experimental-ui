import {QueryClient} from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000 // we assume that 10 sec data is always accurate,
    }
  }
});

export default queryClient;
