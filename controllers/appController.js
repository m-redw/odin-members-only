const bcrypt = require("bcryptjs");
const passport = require("passport");
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
const { validationResult } = require("express-validator");
const { validateUser, validateMessage } = require("./validations");

const { loadEnvFile } = require("node:process");
const { error } = require("node:console");
if (process.env.NODE_ENV !== "production") {
  loadEnvFile();
}

const renderHomepage = async (req, res) => {
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};

  // delete makes these disappear on page refresh
  delete req.session.errors;
  delete req.session.oldInput;

  const messages = await getAllMessages();
  res.render("homepage", {
    user: req.user,
    messages: messages,
    errors: errors,
    oldInput: oldInput,
  });
};

const renderSignUp = (req, res) => {
  const errors = req.session.errors || [];
  const oldInput = req.session.oldInput || {};

  delete req.session.errors;
  delete req.session.oldInput;

  res.render("sign-up", { user: req.user, errors: errors, oldInput: oldInput });
};

const postSignUp = [
  validateUser,
  async (req, res, next) => {
    // check if valid sign up
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // save into req object's session
      // so get request can see
      req.session.errors = errors.array();
      req.session.oldInput = req.body;
      // redirect instead of render
      // render here would still be post request, which is no no
      return res.redirect("/sign-up");
    }

    // if valid, do password cryption and user creation
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await addUser(req.body.username, hashedPassword);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

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

const postAddMessage = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      req.session.oldInput = req.body;
      return res.redirect("/");
    }

    await addMessage(req.body.message, req.params.username, new Date());
    res.redirect("/");
  },
];

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
