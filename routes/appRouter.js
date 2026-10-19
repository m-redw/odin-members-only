const { Router } = require("express");
const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("homepage");
});

appRouter.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

appRouter.get("/member", (req, res) => {
  res.render("member-pass");
});

appRouter.get("/admin", (req, res) => {
  res.render("admin-pass");
});

module.exports = appRouter;
