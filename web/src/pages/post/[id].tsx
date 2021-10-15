import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import Layout from '../../components/Layout'
import { useDeletePostMutation, useMeQuery } from '../../generated/graphql'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'
import { withApollo } from '../../utils/withApollo'

// TODO refactor EditDeleteButtons group

const Post = (): JSX.Element => {
  const { data, error, loading } = useGetPostFromUrl()
  const { data: meData } = useMeQuery()
  const [deletePost] = useDeletePostMutation()

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    )
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>could not find post</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      {meData?.me?.id === data.post.creator.id && (
        <Box ml="auto">
          <NextLink href={`/post/edit/${data.post.id}`}>
            <IconButton as={Link} mr={4} aria-label="edit post" icon={<EditIcon />} />
          </NextLink>
          <IconButton
            aria-label="delete post"
            icon={<DeleteIcon />}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              deletePost({ variables: { id: data.post!.id } })
            }}
          />
        </Box>
      )}
    </Layout>
  )
}

export default withApollo({ ssr: true })(Post)
