import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { Schedule } from "../../entity/schedule";
import { MoreThan } from "typeorm";

export async function getSchedule(request: Request, response: Response): Promise<void> {
  const authToken = request.headers.authorization;
  if (!authToken) {
    response.json({ failed: true, reason: "Not authorized" });
    return;
  }

  const user = jwt.verify(authToken, "0a8d5fec-f42d-4a00-aa01-cd1a5aded672") as { username: string; id: number; };
  if (!user) return;

  const schedules = request.dbConn.getRepository(Schedule);
  if (!request.query.currentDate) {
    const [allSchedule, count] = await schedules.findAndCount({
      user: user.id
    });
    response.json({
      schedule: allSchedule,
      count
    });
    return;
  }
  const [schedule, nSchedule] = await schedules.findAndCount({
    where: {
      user: user.id,
      date: MoreThan(new Date(request.query.currentDate as string))
    }
  });

  response.json({
    schedule,
    count: nSchedule
  });
}