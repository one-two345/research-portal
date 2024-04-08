import express from "express";
import ProjectModel from "../models/projects";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const newsData = await ProjectModel.find({}); // Fetch news from the MongoDB collection sorted by createdAt in ascending order
    res.json(newsData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;