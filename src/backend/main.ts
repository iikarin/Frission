import 'reflect-metadata';

import { config } from 'dotenv';
import * as express from 'express';
import { join, resolve } from 'path';
import { createConnection } from 'typeorm';

import { Conversation } from './entity/conversation';
import { Post } from './entity/post';
import { Schedule } from './entity/schedule';
import { User } from './entity/user';
import { database } from './middlewares/database';
import { AuthRouter } from './router/auth';
import { MiscRouter } from './router/misc';
import { ScheduleRouter } from './router/schedule';
import { PostsRouter } from './router/posts';
import { SearchRouter } from './router/search';

const app = express();
async function run() {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "skool",
    synchronize: true,
    logging: process.env.APP_MODE === "development",
    entities: [
      User,
      Conversation,
      Post,
      Schedule
    ]
  })
  app.use(database(connection));
  app.use(express.json());
  app.use(express.static(resolve(join(__dirname, "..", "..", "frontend-dist"))));

  app.use("/api/auth", AuthRouter);
  app.use("/api/misc", MiscRouter);
  app.use("/api/schedule", ScheduleRouter);
  app.use("/api/posts", PostsRouter);
  app.use("/api/search", SearchRouter);

  app.get("*", (_, response: express.Response) => {
    response.sendFile(resolve(join(__dirname, "..", "..", "frontend-dist", "index.html")));
  });

  app.listen(process.env.HTTP_PORT, () => console.log(`Started web server on port ${process.env.HTTP_PORT}`));
}

config();
run();