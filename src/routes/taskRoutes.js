import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }
    const task = await Task.create({
      title,
      description,
      owner: req.user._id
    });
    return res.status(201).json(task);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    return res.status(200).json(tasks);
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Not found" });
    }
    if (String(task.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await task.deleteOne();
    return res.status(200).json({ message: "Deleted" });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
