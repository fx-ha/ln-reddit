import { UsernamePasswordInput } from './UsernamePasswordInput'

export const validateRegister = (
  options: UsernamePasswordInput
): null | { field: string; message: string }[] => {
  if (options.username.length <= 2) {
    return [{ field: 'username', message: 'length must be greater than 2' }]
  }

  if (options.password.length <= 2) {
    return [{ field: 'password', message: 'length must be greater than 2' }]
  }

  return null
}
