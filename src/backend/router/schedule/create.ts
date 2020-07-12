import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Schedule } from "../../entity/schedule";

export async function create(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const schedules = request.dbConn.getRepository(Schedule);
  const newSchedule = new Schedule();
  newSchedule.title = request.body.title;
  newSchedule.description = request.body.description;
  newSchedule.user = user.id;
  newSchedule.date = new Date(request.body.date);
  const savedSchedule = await schedules.save(newSchedule);

  response.json({
    savedSchedule
  });
}