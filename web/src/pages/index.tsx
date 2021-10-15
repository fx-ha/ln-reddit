import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import Layout from '../components/Layout'
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql'
import NextLink from 'next/link'
import UpvoteSection from '../components/UpvoteSection'
import { withApollo } from '../utils/withApollo'

const Index = (): JSX.Element => {
  const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: { limit: 10, cursor: null },
    notifyOnNetworkStatusChange: true,
  })
  const { data: meData } = useMeQuery()
  const [deletePost] = useDeletePostMutation()

  if (!loading && !data) {
    return (
      <>
        <div>query failed</div>
        <div>{error?.message}</div>
      </>
    )
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>loading</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpvoteSection post={post} />
                <Box flex={1}>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {post.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {post.textSnippet}
                    </Text>
                    {/* TODO refactor as EditDeletePostButtons group */}
                    {meData?.me?.id === post.creator.id && (
                      <Box ml="auto">
                        <NextLink href={`/post/edit/${post.id}`}>
                          <IconButton as={Link} mr={4} aria-label="edit post" icon={<EditIcon />} />
                        </NextLink>
                        <IconButton
                          aria-label="delete post"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            deletePost({
                              variables: { id: post.id },
                              update: (cache) => {
                                cache.evict({ id: 'Post:' + post.id })
                              },
                            })
                          }}
                        />
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            isLoading={loading}
            m="auto"
            my={8}
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withApollo({ ssr: true })(Index)
