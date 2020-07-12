import { Router } from "express";
import { sameSchool } from "./misc/same-school";
import { user } from "./misc/user";
import { updateEmail } from "./misc/update-email";
import { recentFromUserSchool } from "./posts/recent-from-user-school";
import { connectToUser } from "./misc/connect";
import { getProfile } from "./misc/profile";

const router = Router();

router.get("/same-school", sameSchool);
router.get("/user/:id", user);
router.post("/update-email", updateEmail);
router.get("/recents-from-same-school", recentFromUserSchool);
router.get("/connect/:user", connectToUser);
router.get("/profile/:id", getProfile);

export { router as MiscRouter };