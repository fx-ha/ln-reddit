import { PaginatedPosts } from '../generated/graphql'
import { withApollo as createWithApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { NextPageContext } from 'next'

const createClient = (ctx: NextPageContext): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    credentials: 'include',
    headers: {
      cookie: (typeof window === 'undefined' ? ctx.req?.headers.cookie : undefined) || '',
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  __typename: 'PaginatedPosts',
                  hasMore: incoming.hasMore,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                }
              },
            },
          },
        },
      },
    }),
  })

export const withApollo = createWithApollo(createClient)
