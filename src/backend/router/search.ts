import { Router } from "express";
import { searchUser } from "./search/search-user";

const router = Router();

router.get("/:search", searchUser);

export { router as SearchRouter };