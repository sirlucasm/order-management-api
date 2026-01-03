import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "running",
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  });
});

export default router;
