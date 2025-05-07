// src/admin/adminController.js
import prisma from "../db/prismaClient.js"; // Import the Prisma client

// Create a new admin user (only super admins or existing admins can create new ones)
export const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newAdmin = await prisma.user.create({
      data: {
        email,
        password, // Should be hashed before saving in a real case
        isAdmin: true, // Marking as admin
      },
    });

    res.status(201).json({ message: "Admin created", admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
    });

    res.status(200).json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update an admin
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password, isAdmin } = req.body;

  try {
    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: {
        email,
        password, // Hash the password before saving
        isAdmin,
      },
    });

    res.status(200).json({ message: "Admin updated", admin: updatedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAdmin = await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "Admin deleted", admin: deletedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
