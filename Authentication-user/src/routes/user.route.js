import { Router } from "express"
import { login, logout, registerUser } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { refreshAccesToken } from "../controllers/users.controller.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJwt, logout)
router.route("/refresh-token").post(refreshAccesToken)




export default router