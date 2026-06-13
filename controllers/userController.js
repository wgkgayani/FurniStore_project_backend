import User from "../models/user.js"; //use to import User model
import bcrypt from "bcrypt"; //bcrypt use karanne password hash karanna
import crypto from "crypto";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
  /*if (req.body.role == "admin") {
    //when user create account, first check user is admin or not
    if (req.user != null) {
      if (req.User.role != "admin") {
        res.status(403).json({
          massege: "Your are not authorized to create an admin account",
        });
        return; //stop below codes
      }
    } else {
      res.status(403).json({
        massege:
          "You are not authorized to create an admin accounts. Please login first",
      });
      return; //stop below codes
    }
  }*/

  const hashedPassword = bcrypt.hashSync(req.body.password, 10); //hash karanna password eka 10 times

  const user = new User({
    // methana User thamai model eke anthimt export karpu User
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword, //req.body.password    replace
    email: req.body.email,
    role: req.body.role || "customer", // Default to customer
  });

  user // use to save or not user data to database
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Error saving user data",
      });
    });
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    // console.log(user);

    if (user == null) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        // generate token and sed it to user
        const token = jwt.sign(
          {
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            img: user.img,
          },
          process.env.JWT_SECRET,
        );

        res.json({
          message: "login successful",
          //user: user,               show user details in db
          token: token,
        });
      } else {
        res.status(401).json({
          message: "Invalid password",
        });
      }
    }
  });
}

export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != "admin") {
    return false;
  }
  return true;
}

export async function forgotPassword(req, res) {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    // Don't reveal whether the email exists
    return res.json({ message: "If an account exists, a reset link was sent" });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1 hour
  await user.save();

  const resetUrl = `http://localhost:3003/reset-password/${token}`;

  // In a real app you would send an email with the resetUrl. For now return it for development.
  return res.json({ message: "Reset link generated", resetUrl });
}

export async function resetPassword(req, res) {
  const token = req.params.token;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = bcrypt.hashSync(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.json({ message: "Password has been reset" });
}

export async function updateProfile(req, res) {
  try {
    const { email, firstName, lastName, phone, address, img } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (img !== undefined) user.img = img; // accept data URL or URL

    await user.save();

    return res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
}

export async function getCart(req, res) {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ cart: user.cart || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch cart" });
  }
}

export async function updateCart(req, res) {
  try {
    const email = req.user.email;
    const { cart } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = cart;
    await user.save();
    return res.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update cart" });
  }
}

export async function clearCart(req, res) {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();
    return res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
}
