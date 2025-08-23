import { Router } from "express";
import { signup, getAllUsers, login, forgotPassword, resetPassword, getProfile } from "../controllers/authController";
import { authenticate } from "../middleware/authmiddleware";

const router = Router();

router.post("/signup", signup);
router.get("/users", getAllUsers);
router.post("/login", login);
router.post("/request-reset-token", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticate, getProfile);

export default router;