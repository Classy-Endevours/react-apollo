const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const SECRET = "somesupersecretkey";
module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async (args) => {
    const { email, password } = args.userInput;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
      expiresIn: "1h",
    });
    return {
      userId: user.id,
      token: token,
      email: user.email,
      tokenExpiration: 1,
    };
  },
  refreshToken: async (args) => {
    const { token } = args;
    if (!token) {
      throw new Error("Unauthenticated!");
    }
    let decodedToken, newToken;
    try {
      decodedToken = jwt.verify(token, SECRET);
      newToken = jwt.sign(
        { userId: decodedToken.id, email: decodedToken.email },
        SECRET,
        {
          expiresIn: "1h",
        }
      );
      return { token: newToken, tokenExpiration: "1h" };
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
        newToken = jwt.sign(
          { userId: payload.userId, email: payload.email },
          SECRET,
          {
            expiresIn: "1h",
          }
        );
        return { token: newToken, tokenExpiration: "1h" };
      } else {
        throw new Error("Unauthenticated!");
      }
    }
  },
};
