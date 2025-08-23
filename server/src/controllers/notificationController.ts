import { Request, Response } from "express";
import Notification from "../models/notification";
import User from "../models/user";

export const getNotifications = async (req: any, res: Response) => {
  try {
    const userId = req.user && req.user._id ? req.user._id.toString() : null;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(100);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user._id ? req.user._id.toString() : null;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const notif = await Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    res.json(notif);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification" });
  }
};

// POST /api/notifications/send
export const sendNotification = async (req: any, res: Response) => {
  try {
    const sender = req.user;
    if (!sender) return res.status(401).json({ error: "Unauthorized" });

    const { toUserId, toEmail, title, message } = req.body;

    // If sender is instructor, they can send to students by id or email
    if (sender.role === "instructor") {
      let targets: any[] = [];
      if (toUserId) {
        targets = Array.isArray(toUserId) ? toUserId : [toUserId];
      } else if (toEmail) {
        const user = await User.findOne({ email: toEmail.toLowerCase().trim() }) as { _id: any } | null;
        if (user) targets = [user._id.toString()];
      }

      if (targets.length === 0) return res.status(400).json({ error: "No valid target students found" });

      const created = [] as any[];
      for (const t of targets) {
        const n = await Notification.create({ userId: t, title, message, read: false });
        created.push(n);
      }

      return res.json({ success: true, created });
    }

    // If sender is student, allow sending a message to instructor via email or instructorId
    if (sender.role === "student") {
      let instructorId = toUserId;
      if (!instructorId && toEmail) {
        const user = await User.findOne({ email: toEmail.toLowerCase().trim() }) as { _id: any; role: string } | null;
        if (user && user.role === "instructor") instructorId = user._id.toString();
      }

      if (!instructorId) return res.status(400).json({ error: "No instructor found to receive message" });

      const n = await Notification.create({ userId: instructorId, title, message, read: false });

      // Optionally: send email to instructor — not implemented here. Return created notification.
      return res.json({ success: true, created: n });
    }

    return res.status(403).json({ error: "Role not allowed to send notifications" });
  } catch (error) {
    console.error("sendNotification error:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};
