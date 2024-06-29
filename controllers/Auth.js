const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    if (!fullName || !userName || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: `all fields are required`,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: `Password do not match`,
      });
    }

    let checkUserExist = await User.findOne({ userName });

    if (checkUserExist) {
      return res.status(400).json({
        success: false,
        message: `user already exist`,
      });
    }

    // hash password....
    let hashedPassword;
    while (!hashedPassword) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // image.

    const splittedName = fullName.split(" ");
    const firstName = splittedName[0];
    const lastName = splittedName[1];

    const boyImage = `https://avatar.iran.liara.run/public/boy?username=${firstName}`;
    const girlImage = `https://avatar.iran.liara.run/public/girl?username=${firstName}`;

    const newUser = await User.create({
      fullName,
      userName,
      gender,
      password: hashedPassword,
      image: gender === "male" ? boyImage : girlImage,
    });

    return res.status(200).json({
      success: true,
      message: `new user created successfully`,
      newUser: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `error while sign up = ${err.message}`,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // fetch details
    const { userName, password } = req.body;
    //validation
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: `please enter all details to login`,
      });
    }
    // check username
    let checkUserPresent = await User.findOne({ userName });
    if (!checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: `user is not registered with us`,
      });
    }
    // match password
    if (await bcrypt.compare(password, checkUserPresent.password)) {
      // create token
      const payload = {
        user_id: checkUserPresent._id,
        userName: checkUserPresent.userName,
        image: checkUserPresent.image, 
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });

      checkUserPresent.password = undefined;
      checkUserPresent.token = token;

      // create cookie

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      // send res
      res.status(200).cookie("token", token, options).json({
        success: true,
        message: `user logged in successfully`,
        image: checkUserPresent.image,
        id: checkUserPresent._id, 
        fullName: checkUserPresent.fullName, 
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Password do not match`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `error while login = ${err.message}`,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // const id = req.user.user_id;

    const token = req.cookies.token;

    const options = { expires: new Date(Date.now()), httpOnly: true };
    res.status(200).cookie("token", "", options).json({
      success: true, 
      message: `Logged Out Successfully`, 
    });
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error while logging out = ${err.message}`,
    });
  }
};

exports.sidebarUser = async (req, res) => {
  try {
    const userId = req.user.user_id;

    console.log("whats error ? ");

    const allUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    res.status(200).json({
      success: true,
      allUsers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error while getting sidebar users = ${err.message}`,
    });
  }
};
