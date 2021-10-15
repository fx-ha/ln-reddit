import { ObjectType, Field } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Post } from './Post'
import { User } from './User'

// many to many
// user <-> posts
// user -> join table <- posts
// user -> upvote <- posts

@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Field()
  @Column({ type: 'int' })
  value: number

  @Field()
  @PrimaryColumn()
  userId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes)
  user: User

  @Field()
  @PrimaryColumn()
  postId: number

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.upvotes, {
    onDelete: 'CASCADE',
  })
  post: Post
}
