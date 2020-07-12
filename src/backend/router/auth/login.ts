import { Request, Response } from "express";
import { User } from "../../entity/user";
import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";

export async function login(request: Request, response: Response): Promise<void> {
  const { username, password } = request.body;

  const users = request.dbConn.getRepository(User);
  const result = await users.findOne({
    username
  });
  if (!result) {
    response.json({
      failed: true,
      reason: "User not found"
    });
    return;
  }
  if (!(await compare(password, result.password))) {
    response.json({
      failed: true,
      reason: "Username and password do not match."
    });
    return;
  }

  response.json({
    success: true,
    jwt: jwt.sign({ username: result.username, id: result.id }, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672")
  });
}