import { Request, Response } from "express";
import { User } from "../../entity/user";
import { hash } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { usernameCheck } from "./username-check";

export async function register(request: Request, response: Response): Promise<void> {
  const dbConn = request.dbConn;
  if ((await usernameCheck(request.body.username, dbConn))) {
    // Username already exists
    response.json({
      failed: true,
      reason: "Username already exists"
    });
    return;
  }

  const userRepository = dbConn.getRepository(User);
  const newUser = new User();
  newUser.name = request.body.name;
  newUser.school = request.body.school;
  newUser.grade = request.body.grade;
  newUser.conversations = "";
  newUser.connections = "";
  newUser.password = await hash(request.body.password, 8);
  newUser.username = request.body.username;

  const savedUser = await userRepository.save(newUser);

  response.json({
    success: true,
    jwt: jwt.sign({ username: request.body.username, id: savedUser.id }, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672")
  });
}