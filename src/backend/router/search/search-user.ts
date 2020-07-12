import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { User } from "../../entity/user";
import { Like } from "typeorm";

export async function searchUser(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const userRepository = request.dbConn.getRepository(User);
  if (request.query.sameSchool === "true") {
    const users = await userRepository.find({
      name: Like(`%${request.params.search}%`),
      school: (await userRepository.find({ id: user.id }))[0].school
    });
    response.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        connections: user.connections,
        school: user.school,
        name: user.name,
        username: user.username,
        email: user.email
      }))
    });
  } else {
    const users = await userRepository.find({
      name: Like(`%${request.params.search.toLowerCase()}%`)
    });
    response.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        connections: user.connections,
        school: user.school,
        name: user.name,
        username: user.username,
        email: user.email
      }))
    });
  }
}