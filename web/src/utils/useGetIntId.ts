import { useRouter } from 'next/router'

// TODO make more generic for any query parameter

export const useGetIntId = (): number => {
  const router = useRouter()
  return typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
}
