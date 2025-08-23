import { Router } from "express";
import { getNotifications, markAsRead, sendNotification } from "../controllers/notificationController";
import { authenticate } from "../middleware/authmiddleware";

const router = Router();

router.get("/", authenticate, getNotifications);
router.post("/:id/read", authenticate, markAsRead);
router.post("/send", authenticate, sendNotification);

export default router;
