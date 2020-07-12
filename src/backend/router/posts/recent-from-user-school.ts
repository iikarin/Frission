import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { User } from "../../entity/user";
import { Post } from "../../entity/post";

export async function recentFromUserSchool(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const userRepository = request.dbConn.getRepository(User);
  const currentUser = await userRepository.findOne({
    id: user.id
  });
  if (!currentUser) return;
  const sameSchool = await userRepository.find({
    school: currentUser.school
  });

  const sameSchoolUserIDs = sameSchool.map(user => user.id);
  const postRepository = request.dbConn.getRepository(Post);

  const posts: Array<Post> = [];
  await Promise.all(sameSchoolUserIDs.map(async (id) => {
    const result = await postRepository.find({
      author: id,
    });
    posts.push(...result);
  }));

  response.json({
    posts: posts.slice(0, request.query.max ? Number(request.query.max) : posts.length)
  });
}