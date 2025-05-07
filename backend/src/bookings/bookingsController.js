// src/bookings/bookingsController.js
import prisma from "../db/prismaClient.js"; // Import Prisma client

// Create Booking (for logged-in users)
export const createBooking = async (req, res) => {
  const { eventId } = req.body; // Get event ID from the request body
  const userId = req.user.id; // Get user ID from JWT

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
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
};

// Get all bookings of a user
export const getUserBookings = async (req, res) => {
  const userId = req.user.id; // Get user ID from JWT

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: true, // Include event details in the result
      },
    });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving bookings" });
  }
};

// Delete a user's booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params; // Get booking ID from URL parameters
  const userId = req.user.id; // Get user ID from JWT

  try {
    const deletedBooking = await prisma.booking.deleteMany({
      where: {
        eventId: parseInt(id),
        userId: userId, // Ensure only the user who created the booking can delete it
      },
    });

    if (deletedBooking.count === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error canceling booking" });
  }
};
