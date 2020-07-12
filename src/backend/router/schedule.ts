import { Router } from "express";
import { getSchedule } from "./schedule/get";
import { create } from "./schedule/create";

const router = Router();

router.get("/get", getSchedule);
router.post("/create", create);

export { router as ScheduleRouter };