import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { InputField } from '../../../components/InputField'
import Layout from '../../../components/Layout'
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql'
import { useGetIntId } from '../../../utils/useGetIntId'
import { withApollo } from '../../../utils/withApollo'

const EditPost = (): JSX.Element => {
  const router = useRouter()
  const intId = useGetIntId()
  const { data, loading } = usePostQuery({ skip: intId === -1, variables: { id: intId } })
  const [updatePost] = useUpdatePostMutation()

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
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
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          const { errors } = await updatePost({
            variables: { id: intId, title: values.title, text: values.text },
          })
          if (!errors) {
            router.back()
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
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo({ ssr: false })(EditPost)
