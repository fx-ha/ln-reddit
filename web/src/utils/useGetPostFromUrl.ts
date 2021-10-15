import { QueryResult } from '@apollo/client'
import { Exact, PostQuery, usePostQuery } from '../generated/graphql'
import { useGetIntId } from './useGetIntId'

export const useGetPostFromUrl = (): QueryResult<PostQuery, Exact<{ id: number }>> => {
  const intId = useGetIntId()
  return usePostQuery({
    skip: intId === -1,
    variables: { id: intId },
  })
}
