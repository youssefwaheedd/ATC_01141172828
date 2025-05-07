import prisma from "../db/prismaClient.js";

export const getProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isAdmin: true,
        provider: true,
        bookings: {
          select: {
            id: true,
            createdAt: true,
            event: {
              select: {
                id: true,
                name: true,
                date: true,
                venue: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
