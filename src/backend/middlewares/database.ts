import { Connection } from "typeorm";
import { Request, Response } from "express";

export function database(dbConn: Connection): (req: Request, res: Response, next: Function) => void {
  return (request: Request, response: Response, next: Function) => {
    request.dbConn = dbConn;
    next();
  }
}