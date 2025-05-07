import prisma from "../db/prismaClient";

export const createAdminService = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newAdmin = await prisma.user.create({
      data: {
        email,
        password,
        isAdmin: true,
      },
    });
    return newAdmin;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
