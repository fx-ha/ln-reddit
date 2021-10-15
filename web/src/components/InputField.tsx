import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  // TextareaProps,
  // ComponentWithAs,
  // InputProps,
} from '@chakra-ui/react'
import { useField } from 'formik'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  textarea?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const InputField: React.FC<InputFieldProps> = ({ label, textarea, size, ...props }) => {
  // TODO strict type for InputOrTextArea
  // let InputOrTextarea:
  //   | ComponentWithAs<'input', InputProps>
  //   | ComponentWithAs<'textarea', TextareaProps> = Input
  let InputOrTextarea: any = Input
  if (textarea) {
    InputOrTextarea = Textarea
  }
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} placeholder={props.placeholder} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}
