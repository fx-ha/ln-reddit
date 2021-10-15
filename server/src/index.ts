import 'reflect-metadata'
import 'dotenv-safe/config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { COOKIE_NAME, __prod__ } from './constants'
import { MyContext } from './types'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { Upvote } from './entities/Upvote'
import path from 'path'
import { createUserLoader } from './utils/createUserLoader'
import { createUpvoteLoader } from './utils/createUpvoteLoader'

const main = async (): Promise<void> => {
  // db
  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    logging: process.env.DB_LOGGING === 'true' ? true : false,
    synchronize: process.env.DB_SYNC === 'true' ? true : false,
    entities: [Post, Upvote, User],
    migrations: [path.join(__dirname, './migrations/*')],
  })
  await conn.runMigrations()

  // express
  const app = express()

  // cors
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))

  // redis
  const RedisStore = connectRedis(session)
  const redis = new Redis(process.env.REDIS_URL)
  app.set('trust proxy', 1)
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // true -> cookie only works in https
        domain: __prod__ ? '.fxha.dev' : undefined,
      },
      saveUninitialized: false, // don't store empty sessions
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  )

  // apollo
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      upvoteLoader: createUpvoteLoader(),
    }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  // listen on port ...
  app.listen(parseInt(process.env.PORT), () => {
    console.log('server started on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err)
})
