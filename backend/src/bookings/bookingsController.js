import prisma from "../db/prismaClient.js";
import jwt from "jsonwebtoken";

export const createBooking = async (req, res) => {
  const { eventId } = req.body;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const existingBooking = await prisma.booking.findFirst({
      where: { userId, eventId },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this event" });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        eventId,
      },
    });
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking" });
  }
};

export const getUserBookings = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: true,
      },
    });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving bookings" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const deletedBooking = await prisma.booking.deleteMany({
      where: {
        eventId: parseInt(id),
        userId: userId,
      },
    });

    if (deletedBooking.count === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error canceling booking" });
  }
};
