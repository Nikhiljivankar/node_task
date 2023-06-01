const mongoose = require("mongoose");

const UserModel = require("../model/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const passwordUtil = require("../utils/password");
const catchAsync = require("../utils/catchAsync");
const ErrorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const regex = new RegExp(
  /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
);

const sendMessage = async (email, subject, text, html) => {
  const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
  try {
      const msg = {
          to: email, // Change to your recipient
          from: "harshitkyals@gmail.com", // Change to your verified sender
          subject: subject,
          text: text,
          html: html
      };
      sgMail
          .send(msg)
          .then((data) => {
              console.log("Email sent");
              return
          })
          .catch((error) => {
              console.error(error);
          });
  } catch (err) {
      console.log("sorry for delay");
  }
};

exports.getMe = catchAsync(async (req, res, next) => {
  const { _id: id } = req.body;

  const user = await UserModel.findById(id);
  if (!user) return next(new ErrorResponse("User not found", 404));

  if(!user.isActive){
    return next(new ErrorResponse("User is In-Active", 402));
  }

  res.status(200).json(successResponse(user, 1, "Success"));
});

exports.signup = catchAsync(async (req, res, next) => {
  if (!regex.test(req.body.email)) {
    return next(new ErrorResponse("please enter valid Email", 400));
  }
  const isUserExist = await UserModel.findOne({ email: req.body.email });

  if (isUserExist) {
    return next(new ErrorResponse("Email already registered", 400));
  }
  if (!req.body.age) {
    return next(new ErrorResponse("Age is required", 400));
  }
let modelData={
  _id: new mongoose.Types.ObjectId(),
  age: parseInt(req.body.age),
  gender: req.body.gender,
  email: req.body.email,
  country: req.body.country,
  frequency: req.body.frequency,
  race_and_ethnicity: req.body.race_and_ethnicity,
  education: req.body.education,
  diagnosis_of_mental_conditions: req.body.diagnosis_of_mental_conditions,
  diagnosis_of_physical_conditions: req.body.diagnosis_of_physical_conditions,
  password: req.body.password,
}

  if (modelData.age<18) {
    modelData.parentalConsent=req.body.parentalConsent;
  }
  else
  if (modelData.age>18) {
    modelData.userConsent=req.body.userConsent;
  }

  let userData = new UserModel(modelData);
  let createdUser = await userData.save();
  delete createdUser.password;

  const token = passwordUtil.genJwtToken(
    createdUser._id,
    createdUser.userName
  );

  res
    .status(201)
    .json(
      successResponse(
        { token, user: createdUser },
        1,
        "User signed up successfully"
      )
    );
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Email and Password are required", 400));
  }

  const user = await UserModel.findOne({ email: email }).select(
    "+password"
  );

  if (!user) {
    return next(new ErrorResponse("User not found", 401));
  }

  if(!user.isActive){
    return next(new ErrorResponse("User is In-Active", 402));
  }

  const resData = {};

  if (user && user.password && (await user.comparePassword(password))) {
    resData.token = passwordUtil.genJwtToken(user._id);
    resData.user = user;
  } else {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
delete resData.user.password;
  return res.status(200).json(successResponse(resData, 1));
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  });

  if (!user) return next(new ErrorResponse("User not found", 404));

  return res.status(200).json(successResponse(user, 1));
});

exports.updateFrequency = catchAsync(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  });

  if (!user) return next(new ErrorResponse("User not found", 404));

  return res.status(200).json(successResponse(user, 1));
});

exports.forgotPassword = async (req, res) => {
  try {
      let userId = req.body.email;
      let obtainUser = await UserModel.findOne({ email: userId })
      if (obtainUser) {
          let token = jwt.sign(
              {
                  id: obtainUser._id,
                  userId: obtainUser.email,
                  expiresIn: "20m",
              },
              process.env.JWT_SECRET
          );
          const forgetPasswordUrl = `${process.env.forgetPasswordUrl}?action=forgotPassword&email=${obtainUser.email}&token=${token}`;
          let templateName = 'ForgotPassword.html';

          let template_path = path.join(__dirname, '../utils/');//need to make changes in this template
          let html = fs.readFileSync(template_path + templateName, 'utf8');
          const template = handlebars.compile(html);
          const replacements = {
              user: obtainUser.userName,
              resetLink: forgetPasswordUrl,
              date: new Date().toISOString().slice(0, 10),
          };
          const htmlToSend = template(replacements);
          await sendMessage(obtainUser.email, "Reset link for Password Change", ' ', htmlToSend);
          return res.status(200).json(successResponse(null,0,"Reset link for Password Change"));
      } else {
          return res.status(404).json({ status: true, msg: "User not found" });
      }
  } catch (err) {
      res.status(500).send({ Error: err.message });
  }
};
exports.resetPasswordKnownPass = async (req, res) => {
  try {
      let obtainUser = await UserModel.findOne({ email: req.body.email })
      if (obtainUser) {
          if (
              obtainUser &&
              obtainUser.password &&
              (await obtainUser.comparePassword(req.body.password))
          ) {
              obtainUser.password = req.body.newPassword;
              obtainUser = await obtainUser.save();
              let apiResponse = response.generate(
                  constants.SUCCESS,
                  `your password is successfully reset`,
                  constants.HTTP_SUCCESS,
                  obtainUser
              );
              return res.status(200).send(apiResponse);
          } else {
              let apiResponse = response.generate(
                  constants.ERROR,
                  messages.USER.DOESNOTMATCH,
                  constants.HTTP_UNAUTHORIZED
              );
              res.status(200).send(apiResponse);
              return;
          }
      } else {
          return res.status(404).send({ status: true, msg: "User not found" });
      }
  } catch (err) {
      res.status(500).send({ Error: err.message });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
      let newPassword = req.body.newPassword;

      const bearerHeader = req.headers["authorization"];
      if (!bearerHeader) {
          let apiResponse = response.generate(
              constants.SUCCESS,
              `Not Authorized`,
              constants.HTTP_UNAUTHORIZED,
              null
          );
          return res.status(401).send(apiResponse);
      }
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      let userData = jwt.verify(req.token, process.env.JWT_SECRET);
      console.log(userData);
      let obtainUser;
      obtainUser = await UserModel.findOne({ _id: userData.id })
      if (!obtainUser) {
          let apiResponse = response.generate(
              constants.SUCCESS,
              `user not found for this user ${userData.userId}`,
              constants.HTTP_NOT_FOUND,
              null
          );
          return res.status(404).send(apiResponse);
      }
      obtainUser.password = newPassword;
      obtainUser = await obtainUser.save();
      let apiResponse = response.generate(
          constants.SUCCESS,
          `your password is successfully reset`,
          constants.HTTP_SUCCESS,
          obtainUser
      );
      return res.status(200).send(apiResponse);
  } catch (err) {
      res.status(500).send({ Error: err.message });
  }
};