import express from "express";
import {
  getProfile,
  loginUser,
  registerUser,
  getAllCustomers,
  getAllUsers,
  updateUserProfile,
  deleteUserAccount,
} from "@/controllers/user.Controller.js";
import { authenticate, authorize } from "@/middlewares/auth.js";

const router = express.Router();

// general user methods
//post for register
router.post("/register", registerUser);

//post for login
router.post("/login", loginUser);

// put for update
router.put("/update", authenticate, updateUserProfile);

// delete the user
router.delete("/delete", authenticate, deleteUserAccount);

////////////////////////////////////////////////
//admin specific routes

//get profiles
router.get("/admin/profile", authenticate, authorize("admin"), getProfile);

//getting all customers
router.get(
  "/admin/show-customers",
  authenticate,
  authorize("admin"),
  getAllCustomers
);

//showing all users who use the system
router.get("/admin/show-all", authenticate, authorize("admin"), getAllUsers);

export default router;
