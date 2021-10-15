import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMeQuery } from '../generated/graphql'

// redirect to login page if user is not logged in (after loading finishes)
export const useIsAuth = (): void => {
  const { data, loading } = useMeQuery()
  const router = useRouter()
  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace(`/login?next=${router.pathname}`) // e.g. /login?next=create-post
    }
  }, [data, loading, router])
}
