import { useApolloClient } from '@apollo/client'
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

const NavBar = (): JSX.Element => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation()
  const apolloClient = useApolloClient()
  const { data, loading } = useMeQuery({ skip: isServer() }) // skip query on server (ssr)

  let body = null

  // data is loading
  if (loading) {
    console.log('fetching')
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout()
            await apolloClient.resetStore()
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxWidth={800}>
        <NextLink href="/">
          <Link>
            <Heading>Lightning Reddit</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  )
}

export default NavBar
