import fs from "fs";
import path from "path";
import express from "express";

const router = express.Router();

const routesGroup = ["auth"];

for (const group of routesGroup) {
  const routeModule = await import(
    path.join(process.cwd(), "src", "modules", group, "routes.ts")
  );

  router.use(`/${group}`, routeModule.default);
}

export default router;
