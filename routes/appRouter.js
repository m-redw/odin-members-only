const bcrypt = require("bcryptjs");
const passport = require("passport");
const { Router } = require("express");
const {
  addUser,
  updateUserMember,
  updateUserAdmin,
} = require("../db/userQueries");
const { addMessage, getAllMessages } = require("../db/messageQueries");
const appRouter = Router();

const { loadEnvFile } = require("node:process");
if (process.env.NODE_ENV !== "production") {
  loadEnvFile();
}

appRouter.get("/", async (req, res) => {
  const messages = await getAllMessages();
  res.render("homepage", { user: req.user, messages: messages });
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

appRouter.post("/create-message/:username", async (req, res) => {
  await addMessage(req.body.message, req.params.username, new Date());
  res.redirect("/");
});

appRouter.get("/member", (req, res) => {
  res.render("member-pass", { user: req.user });
});

appRouter.post("/member/:userId", async (req, res) => {
  if (req.body.password === process.env.MEMBER_PASS) {
    await updateUserMember(req.params.userId);
    res.redirect("/");
  }
});

appRouter.get("/admin", (req, res) => {
  res.render("admin-pass", { user: req.user });
});

appRouter.post("/admin/:userId", async (req, res) => {
  if (req.body.password === process.env.ADMIN_PASS) {
    await updateUserAdmin(req.params.userId);
    res.redirect("/");
  }
});

module.exports = appRouter;
