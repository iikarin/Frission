import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Post } from "../../entity/post";
import { User } from "../../entity/user";

export async function getPosts(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;
  const postRepository = request.dbConn.getRepository(Post);
  const userRepository = request.dbConn.getRepository(User);

  const scope: "all" | "connections" = request.params.scope as "all" | "connections";
  if (scope === "all") {
    const posts = await postRepository.find({
      type: "all"
    });
    response.json({
      success: true,
      posts
    });
  } else {
    const currentUser = await userRepository.findOne({
      id: user.id
    });
    if (!currentUser) return;
    const posts = await postRepository.find({
      type: "connected"
    });
    posts.filter(post => {
      const postAuthor = post.author;
      if (postAuthor === user.id) return true;
      return currentUser.connections.includes(String(postAuthor));
    });
    response.json({
      success: true,
      posts 
    })
  }
}