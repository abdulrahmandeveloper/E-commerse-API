// i have to add Function Overloading

import { Request, Response } from "express";
import { AuthService } from "@/services/users.service.js";
import { sendResponse, sendError } from "@/utils/response.js";

const authService = new AuthService();

// Register a new user

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);

    sendResponse(res, 201, {
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

//user login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    sendResponse(res, 200, {
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// GET users profiles
export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await authService.getUserProfile(req.user?.id);

    sendResponse(res, 200, {
      message: "Profile retrieved successfully",
      data: { user: profile },
    });
  } catch (error) {
    sendError(res, error);
  }
};

// admin / get all profiles
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await authService.getAllUsers();

    sendResponse(res, 200, {
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

//get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const result = await authService.getAllCustomers();

    sendResponse(res, 200, {
      message: "Customers retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// update oen profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const updatedUser = await authService.updateUserProfile(
      req.user?.id,
      req.body
    );

    sendResponse(res, 200, {
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    sendError(res, error);
  }
};

//DELETE own profile
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const result = await authService.deleteUserAccount(req.user?.id);

    sendResponse(res, 200, {
      message: result.message,
    });
  } catch (error) {
    sendError(res, error);
  }
};
