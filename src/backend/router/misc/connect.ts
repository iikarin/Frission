import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../entity/user";

export async function connectToUser(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const toConnectUserId = Number(request.params.user);
  const userRepository = request.dbConn.getRepository(User);
  const currentUser = await userRepository.findOne({
    id: user.id
  });
  if (!currentUser) return;
  const connections = currentUser.connections.split(",").map(id => Number(id));
  if (connections.includes(toConnectUserId)) {
    response.json({
      alreadyConnected: true
    });
    return;
  }
  connections.push(toConnectUserId);
  await userRepository.update({
    id: user.id
  }, {
    connections: connections.map(v => String(v)).join(",")
  });
  response.json({
    success: true
  });
}