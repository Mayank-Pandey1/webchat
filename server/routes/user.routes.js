import { Router } from "express"
import { registerUser, loginUser, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/signup", registerUser)
router.post("/login", loginUser)
router.put("/update-profile", verifyJWT, upload.single("profilePic"), updateProfile)

export default router;