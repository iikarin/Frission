import { Router } from "express";
import { createPost } from "./posts/create";
import { getPosts } from "./posts/get";

const router = Router();

router.post("/create", createPost);
router.get("/get/:scope", getPosts);

export { router as PostsRouter };