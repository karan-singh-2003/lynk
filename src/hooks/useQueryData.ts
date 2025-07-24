// hooks/useQueryData.ts
import {
  useQuery,
  type QueryKey,
  type QueryFunction,
} from '@tanstack/react-query'

export const useQueryData = <TData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  enabled = true
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery<TData>({
    queryKey,
    queryFn,
    enabled,
  })

  return { data, isPending, isFetched, refetch, isFetching }
}
