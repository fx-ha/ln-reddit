import { Resolver, Query } from 'type-graphql'

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(): string {
    return 'hello world'
  }
}
