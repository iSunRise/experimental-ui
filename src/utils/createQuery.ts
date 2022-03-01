import { useMutation, useQuery, UseQueryResult, UseMutationResult } from "react-query";
import queryClient from "../queryClient";

class APIError extends Error {};

type CreateQueryParams<FetchParams, ApiResult, QueryHook> = {
  apiCall: (p: FetchParams) => Promise<ApiResult>;
  buildKey: (p: FetchParams) => string;
  useRemapResult?: (result: UseQueryResult<ApiResult, APIError>) => QueryHook;
}

const createQuery = <FetchParams, ApiResult, QueryHook>(queryParams: CreateQueryParams<FetchParams, ApiResult, QueryHook>) => {
  const useQueryHook = (fetchParams: FetchParams) => {
    const queryId = queryParams.buildKey(fetchParams);
    const qResult = useQuery<ApiResult, APIError>(queryId, () => queryParams.apiCall(fetchParams), { enabled: !!fetchParams });
    return queryParams.useRemapResult ? queryParams.useRemapResult(qResult) : qResult;
  };

  const invalidate = (p: FetchParams) => { queryClient.invalidateQueries(queryParams.buildKey(p)) };
  const remove = (p: FetchParams) => queryClient.removeQueries(queryParams.buildKey(p));
  const getLatestData = (p: FetchParams) => queryClient.getQueryData(queryParams.buildKey(p)) as ApiResult;
  const setData = (p: FetchParams, data: ApiResult) => queryClient.setQueryData(queryParams.buildKey(p), data);

  return { useQueryHook, invalidate, remove, setData, getLatestData };
};


type CreateMutationParams<PostParams, ApiResult, MutateHook> = {
  apiCall: (p: PostParams) => Promise<ApiResult>;
  useMutationResult: (r: UseMutationResult<ApiResult, APIError, PostParams>) => MutateHook;
  onMutated: (r: ApiResult) => void;
};

const createMutation = <PostParams, ApiResult, MutateHook>(mutationParams: CreateMutationParams<PostParams, ApiResult, MutateHook>) => {
  const useMutationHook = () => {
    const mutationResult = useMutation<ApiResult, APIError, PostParams>(mutationParams.apiCall);
    return mutationParams.useMutationResult(mutationResult);
  }

  return { useMutationHook };
}

export { createQuery, createMutation };
