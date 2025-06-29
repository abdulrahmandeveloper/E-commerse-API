import { User } from "@/models/users.js";
import { generateToken } from "@/config/jwt.js";
import { errorResponses } from "@/utils/errors.js";

export class AuthService {
  //create new user
  async registerUser(userData: any) {
    const { name, email, password, role } = userData;

    // Business Rule: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new errorResponses("User already exists with this email", 400);
    }

    // Business Rule: Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    // Business Rule: Generate authentication token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return formatted user data (no password)
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  //login the user
  async loginUser(credentials: any) {
    const { email, password } = credentials;

    // Business Rule: Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new errorResponses("Invalid email or password", 400);
    }

    // Business Rule: Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new errorResponses("Invalid email or password", 400);
    }

    // Business Rule: Generate authentication token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data without password
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  //GET profile
  async getUserProfile(userId: any) {
    const user = await User.findById(userId);

    if (!user) {
      throw new errorResponses("User not found", 404);
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    };
  }

  /////////////////////////////////////////////////////////////

  // admin only - get all users

  async getAllUsers() {
    const users = await User.find({}).select("-password");

    return {
      users,
      count: users.length,
    };
  }

  // get all customers
  async getAllCustomers() {
    const customers = await User.find({ role: "customer" }).select("-password");

    return {
      customers,
      count: customers.length,
    };
  }

  //any user - updating profile
  async updateUserProfile(userId: any, updateData: any) {
    const { name, email, role, address } = updateData;

    // Business Rule: Check if email is being changed and already exists
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new errorResponses("Email already exists", 400);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new errorResponses("User not found", 404);
    }

    return updatedUser;
  }

  //any user - delete any selected user
  async deleteUserAccount(userId: any) {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new errorResponses("User not found", 404);
    }

    return { message: "User account deleted successfully" };
  }
}
