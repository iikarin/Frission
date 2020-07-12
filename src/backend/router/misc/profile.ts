import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../entity/user";
import { Post } from "../../entity/post";

export async function getProfile(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const userRepository = request.dbConn.getRepository(User);
  const profileUser = await userRepository.findOne({
    id: Number(request.params.id)
  });
  if (!profileUser) {
    response.json({
      failed: true,
      reason: "User not found"
    });
    return;
  }
  const postRepository = request.dbConn.getRepository(Post);
  const profilePosts = await postRepository.find({
    author: Number(request.params.id),
    type: "all"
  });

  response.json({
    success: true,
    user: {
      id: profileUser.id,
      connections: profileUser.connections,
      school: profileUser.school,
      name: profileUser.name,
      username: profileUser.username,
      email: profileUser.email
    },
    posts: profilePosts
  });
}