const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  generateOTP,
  sendEmailForVarification,
} = require("../utils/otpGenerator");

// Register Controller
exports.register = async (req, res) => {
  try {
    const { username, name, email, password, phone, country } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Username already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP (you can use a more secure OTP generation method)
    const otp = generateOTP();

    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      phone,
      country,
      otp,
    });

    await newUser.save();
    sendEmailForVarification(email, otp);

    res.json({
      status: "Success",
      message: "User registered successfully and verification otp email sent",
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ status: "Fail", message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({ status: "Success", message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

// Update User Details Controller
exports.updateUserDetails = async (req, res) => {
  try {
    const { username, password, email, country, name, phone } = req.body;
    const user = await User.findOne({ username });
    const updates = {};
    if (password)
      updates.password = (await bcrypt.hash(password, 10)) || user.password;
    if (email) updates.email = email || user.email;
    if (country) updates.country = country || user.country;
    if (name) updates.name = name || user.name;
    if (phone) updates.phone = phone || user.phone;

    await User.updateOne({ username }, updates);

    res.json({
      status: "Success",
      message: "User details updated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

// Validate Email by OTP Controller
exports.validateEmail = async (req, res) => {
  try {
    const { username, otp } = req.body;

    const user = await User.findOne({ username, otp });

    if (!user) {
      return res
        .status(401)
        .json({ status: "Fail", message: "Invalid OTP or username" });
    }

    // Remove the used OTP from the user document
    user.otp = null;
    await user.save();

    res.json({ status: "Success", message: "Email validated successfully" });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};
