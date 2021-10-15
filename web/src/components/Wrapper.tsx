import { Box } from '@chakra-ui/layout'

export type WrapperVariant = 'small' | 'regular'

interface WrapperProps {
  variant?: WrapperVariant
}

export const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box mt="8" mx="auto" maxWidth={variant === 'regular' ? '800px' : '400px'} w="100%">
      {children}
    </Box>
  )
}
