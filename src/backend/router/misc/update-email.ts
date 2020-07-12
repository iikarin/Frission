import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../entity/user";

export async function updateEmail(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const userRepository = request.dbConn.getRepository(User);
  userRepository.update({
    id: user.id
  }, {
    email: request.body.email
  });
  response.json({
    success: true
  });
}