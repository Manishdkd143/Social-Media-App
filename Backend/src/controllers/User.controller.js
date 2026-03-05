const { options, set } = require("../app");
const ApiError = require("../helpers/ApiError");
const ApiResponse = require("../helpers/ApiResponse");
const uploadFileOnCloudinary = require("../helpers/Cloudinary");
const { transporter } = require("../helpers/SendMail");
const User = require("../Models/user.model");
const bcrypt = require("bcrypt");

const generatedAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select(-password);
    if (!user) throw new ApiError(401, "Unauthorized user!");
    const accessToken = await user.generatedAccessToken();
    const refreshToken = await user.generatedRefreshToken();
    if (!accessToken || !refreshToken)
      throw new ApiError(400, "Token generated failed!");
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(400, error?.message || "Token generated failed!");
  }
};
const UserRegister = async (req, res) => {
  const { username, email, password, mobileNumber, fullName, bio, avatarUrl } =
    req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(401, "User already exists!");
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      username,
      email,
      password: hashPassword,
      mobileNumber,
      fullName,
      bio,
      avatarUrl,
    }).select("-password");
    if (!createdUser) {
      throw new ApiError(400, "User creation failed!");
    }
    res
      .status(201)
      .json(
        new ApiResponse(201, { data: createdUser }, "User created successfully")
      );
    console.log(createdUser);
  } catch (error) {
    throw new ApiError(400, error?.message || "User registration failed!");
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new ApiError(400, "Email is required!");
    if (!password) throw new ApiError(400, "password is required!");
    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      throw new ApiError(404, "User not found");
    }
    const isPassValid = loginUser.isPasswordCorrect(password);
    if (!isPassValid) {
      throw new ApiError(401, "invalid password");
    }
    const { accessToken, refreshToken } =
      await generatedAccessTokenAndRefreshToken(loginUser);
    if (!accessToken || !refreshToken)
      throw new ApiError(400, "Token generated failed!");
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cokkie("accessToken", accessToken, options)
      .cokkie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loginUser,
            accessToken,
            refreshToken,
          },
          "User login successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "User login failed!");
  }
};

const logOut = async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new ApiError(500, "User Not LoggedIn!");
    await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCokkie("accessToken", options)
      .clearCokkie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logout successfully"));
  } catch (error) {
    throw new ApiError(400, "User logout failed!");
  }
};

const updateUserProfile = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "UnAuthorized User ! Please Login First");
  }
  const { fullName, username, bio } = req.body;
  if (!fullName || !username || !bio) {
    throw new ApiError(400, "Field is empty");
  }
  try {
    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          fullName,
          username,
          bio,
        },
      },
      { new: true, runValidators: true }
    ).select("-password -refreshtoken");
    if (!updated) {
      throw new ApiError(500, "Update Failed ! Try again");
    }
  } catch (error) {
    throw new ApiError("something happened from our side ! Try again");
  }
  res
    .status(200)
    .json(ApiResponse(200, { data: { updated } }, "User Details is updated"));
};
const updateUserPassword = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized user!please login");
    }

    const { currentPass, newPass, confirmPass } = req.body;
    if (!currentPass || !newPass || !confirmPass) {
      throw new ApiError(401, "All fields are required!");
    }
    if (newPass.toLowercase() !== confirmPass.toLowercase()) {
      throw new ApiError(401, "Password do not match!");
    }
    const currentUser = await User.findById(user._id);
    const oldPassword = await currentPass.isPasswordCorrect(currentPass);
    if (!oldPassword) throw new ApiError(401, "Invalid current password!");
    currentUser.password = newPass;
    await currentUser.save({ validateBeforeSave: true });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { currentUser }, "Password changed successfully!")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Password updated failed!try again"
    );
  }
};
const updateUserAvatar = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized user!please login");
    }
    if (!req.file) {
      throw new ApiError(500, "file is required!");
    }
    const uploadCloud = await uploadFileOnCloudinary(req?.file);
    if (!uploadCloud)
      throw new ApiError(500, "upload failed while upload file on Cludinery");
    const currentUser = await User.findById(user._id).select(
      "-passsword -refreshToken"
    );
    if (!currentUser) throw new ApiError(404, "User not found!");
    const res = await User.findByIdAndUpdate(
      currentUser._id,
      {
        $set: {
          avatarUrl: uploadCloud?.url,
        },
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Profile avatar updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Profile avatar updated failed!");
  }
};
const updateUserEmail = async (req, res) => {
  const user = req.user;
  try {
    if (!user) throw new ApiError(401, "User Not LoggedIn!");
    const { newEmail, password } = req.body;
    const existingEmail = await User.findOne({ email: newEmail }).select(
      "-password -refreshToken"
    );
    if (existingEmail) throw new ApiError(401, "Email already exists!");
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      throw new ApiError(401, "user password is wrong ");
    }
    const updatedEmail = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          newEmail,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedEmail) {
      throw new ApiError(401, "somthing happend while update user email");
    }
    res
      .status(200)
      .json(
        ApiResponse(200, { updatedEmail }, "User email update successfully")
      );
  } catch (error) {
    throw new ApiError(500, "somthing happend from our side");
  }
};

const updateUserNumber = async (req, res) => {
  const { newMobileNumber, password } = req.body;
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "User is UnAuthorized");
    }
    const existingNumber = await User.findOne({
      mobileNumber: newMobileNumber,
    }).select("-passsword -refreshToken");
    if (existingNumber)
      throw new ApiError(
        400,
        "Mobile number already exists!try another number"
      );
    const checkPassword = await User.isPasswordCorrect(password);
    if (!checkPassword) {
      throw new ApiError(401, "User password is wrong");
    }
    const updateMobileNumber = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { newMobileNumber },
      },
      { new: true, runValidators: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updateMobileNumber },
          "Mobile number updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "somethig happend while change your mobile number");
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required!");
  const otp = Math.floor(100000 * Math.random() * 900000);
  await transporter.sendMail(
    {
      from: process.env.SITE_GMAIL,
      to: email,
      subject: "OTP Verification",
      html: `<h3>Your OTP: ${otp}</h3>`,
    },
    (err) => new ApiError(500, err?.message || "OTP send failed!")
  );
  res.status(200).json(new ApiResponse(200, {}, "OTP sent email"));
};
module.exports = {
  UserRegister,
  userLogin,
  logOut,
  updateUserProfile,
  updateUserPassword,
  forgotPassword,
  updateUserAvatar,
  updateUserNumber,
  updateUserEmail,
};
