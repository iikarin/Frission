import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../entity/user";

export async function sameSchool(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const users = request.dbConn.getRepository(User);
  const currentUser = await users.findOne({
    id: user.id
  });
  const sameSchools = await users.find({
    school: currentUser?.school.trim()
  });

  response.json(sameSchools.map(user_ => ({
    id: user_.id,
    name: user_.name,
    email: user_.email,
    grade: user_.grade,
    school: user_.school
  })));
}