import express from "express";
const router = express.Router();

import { signin, register } from "../controllers/users.js";

router.post("/signin", signin);
router.post("/register", register);

export default router;