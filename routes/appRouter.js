const bcrypt = require("bcryptjs");
const passport = require("passport");
const { Router } = require("express");
const { addUser } = require("../db/userQueries");
const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.render("homepage", { user: req.user });
});

appRouter.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

appRouter.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await addUser(req.body.username, hashedPassword);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

appRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  }),
);

appRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

appRouter.get("/member", (req, res) => {
  res.render("member-pass", { user: req.user });
});

appRouter.get("/admin", (req, res) => {
  res.render("admin-pass", { user: req.user });
});

module.exports = appRouter;
