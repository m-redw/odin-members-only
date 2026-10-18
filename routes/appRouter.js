const { Router } = require("express");
const appRouter = Router();

appRouter.get("/", (req, res) => res.send("ea sports"));

appRouter.get("/sign-up", (req, res) => res.send("sign up"));

appRouter.get("/member", (req, res) => res.send("member sign up"));

appRouter.get("/admin", (req, res) => res.send("admin sign up"));

module.exports = appRouter;
