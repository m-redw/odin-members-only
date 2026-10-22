const {
  addUser,
  updateUserMember,
  updateUserAdmin,
} = require("../db/userQueries");
const {
  addMessage,
  getAllMessages,
  removeMessage,
} = require("../db/messageQueries");

const { loadEnvFile } = require("node:process");
if (process.env.NODE_ENV !== "production") {
  loadEnvFile();
}

const renderHomepage = async (req, res) => {
  const messages = await getAllMessages();
  res.render("homepage", { user: req.user, messages: messages });
};

const renderSignUp = (req, res) => {
  res.render("sign-up", { user: req.user });
};

const postSignUp = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await addUser(req.body.username, hashedPassword);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const postLogIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
  failureMessage: true,
});

const getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const postAddMessage = async (req, res) => {
  await addMessage(req.body.message, req.params.username, new Date());
  res.redirect("/");
};

const renderMemberPage = (req, res) => {
  res.render("member-pass", { user: req.user });
};

const postMember = async (req, res) => {
  if (req.body.password === process.env.MEMBER_PASS) {
    await updateUserMember(req.params.userId);
    res.redirect("/");
  }
};

const renderAdminPage = (req, res) => {
  res.render("admin-pass", { user: req.user });
};

const postAdmin = async (req, res) => {
  if (req.body.password === process.env.ADMIN_PASS) {
    await updateUserAdmin(req.params.userId);
    res.redirect("/");
  }
};

const postMessageDelete = async (req, res) => {
  await removeMessage(req.params.messageId);
  res.redirect("/");
};

module.exports = {
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
};
