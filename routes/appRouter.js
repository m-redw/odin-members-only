const { Router } = require("express");
const {
  renderHomepage,
  renderSignUp,
  postSignUp,
  postLogIn,
  getLogOut,
  postAddMessage,
  renderMemberPage,
  postMember,
  renderAdminPage,
  postAdmin,
  postMessageDelete,
} = require("../controllers/appController");

const appRouter = Router();

appRouter.get("/", renderHomepage);

appRouter.get("/sign-up", renderSignUp);

appRouter.post("/sign-up", postSignUp);

appRouter.post("/log-in", postLogIn);

appRouter.get("/log-out", getLogOut);

appRouter.post("/create-message/:username", postAddMessage);

appRouter.get("/member", renderMemberPage);

appRouter.post("/member/:userId", postMember);

appRouter.get("/admin", renderAdminPage);

appRouter.post("/admin/:userId", postAdmin);

appRouter.post("/delete/:messageId", postMessageDelete);

module.exports = appRouter;
