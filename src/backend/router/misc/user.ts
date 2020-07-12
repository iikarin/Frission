import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../entity/user";

export async function user(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const users = request.dbConn.getRepository(User);
  const specifiedUser = await users.findOne({
    id: request.params.id === "me" ? Number(user.id) : Number(request.params.id)
  });
  if (!specifiedUser) {
    response.json({
      failed: true,
      reason: "User not found"
    });
    return;
  }
  response.json({
    success: true,
    ...specifiedUser
  });
}