import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { InputField } from '../components/InputField'
import { useCreatePostMutation } from '../generated/graphql'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useIsAuth } from '../utils/useIsAuth'
import { withApollo } from '../utils/withApollo'

const CreatePost = (): JSX.Element => {
  const router = useRouter()
  useIsAuth()
  const [createPost] = useCreatePostMutation()
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { errors } = await createPost({
            variables: { input: { title: values.title, text: values.text } },
            update: (cache) => {
              cache.evict({ fieldName: 'posts:{}' })
            },
          })
          if (!errors) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="title" />
            <Box mt={4}>
              <InputField textarea name="text" label="Body" placeholder="text..." />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo({ ssr: false })(CreatePost)
