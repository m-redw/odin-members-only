const { body } = require("express-validator");

const validateUser = [
  body("username")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces allowed in username.")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 chararacters long.")
    .escape(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least 1 lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least 1 uppercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least 1 number.")
    .matches(/[@$!%*?%]/)
    .withMessage(
      "Password must contain at least 1 special character ($,!,%,*,?,%).",
    )
    .escape(),
];

const validateMessage = [
  body("message")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Message must be between 1-100 characters long.")
    .escape(),
];

module.exports = {
  validateUser,
  validateMessage,
};
