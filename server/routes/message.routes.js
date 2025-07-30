import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllMessages, getUsersForSidebar, seeMessage, sendMessageToSelectedUser } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/users").get(verifyJWT, getUsersForSidebar)
router.route("/:id").get(verifyJWT, getAllMessages)
router.route("/mark/:id").put(verifyJWT, seeMessage)
router.route("/send/:id").post(verifyJWT, upload.single("image"), sendMessageToSelectedUser)

export default router