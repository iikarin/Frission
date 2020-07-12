import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Post } from "../../entity/post";

export async function createPost(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const { content, scope, date } = request.body;

  const newPost = new Post();
  newPost.content = content;
  newPost.hearts = `${user.id}`;
  newPost.type = scope;
  newPost.author = user.id;
  newPost.createdOn = date;

  const posts = request.dbConn.getRepository(Post);
  const savedPost = await posts.save(newPost);
  response.json({
    savedPost
  });
}