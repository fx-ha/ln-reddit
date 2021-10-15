import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import { InputField } from '../components/InputField'
import Layout from '../components/Layout'
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { withApollo } from '../utils/withApollo'

const Register = (): JSX.Element => {
  const [register] = useRegisterMutation()
  const router = useRouter()

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { username: values.username, password: values.password },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.register.user,
                },
              })
            },
          })
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" label="username" placeholder="Username" />
            <Box mt={4}>
              <InputField name="password" label="password" placeholder="Password" type="password" />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withApollo({ ssr: false })(Register)
