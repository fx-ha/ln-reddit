import { ApolloCache, gql } from '@apollo/client'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, IconButton } from '@chakra-ui/react'
import { useState } from 'react'
import { PostSnippetFragment, useVoteMutation, VoteMutation } from '../generated/graphql'

interface UpvoteSectionProps {
  post: PostSnippetFragment
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>): void => {
  const data = cache.readFragment<{
    id: number
    points: number
    voteStatus: number | null
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  })
  if (data) {
    if (data.voteStatus === value) {
      return
    }
    const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value
    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { id: postId, points: newPoints, voteStatus: value },
    })
  }
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading')
  const [vote] = useVoteMutation()

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        aria-label="upvote"
        icon={<ChevronUpIcon />}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return
          }
          setLoadingState('upvote-loading')
          await vote({
            variables: { postId: post.id, value: 1 },
            update: (cache) => updateAfterVote(1, post.id, cache),
          })
          setLoadingState('not-loading')
        }}
        isLoading={loadingState === 'upvote-loading'}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
      />
      {post.points}
      <IconButton
        aria-label="downvote"
        icon={<ChevronDownIcon />}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return
          }
          setLoadingState('downvote-loading')
          await vote({
            variables: { postId: post.id, value: -1 },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          })
          setLoadingState('not-loading')
        }}
        isLoading={loadingState === 'downvote-loading'}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
      />
    </Flex>
  )
}

export default UpvoteSection
