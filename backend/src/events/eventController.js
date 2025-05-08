import prisma from "../db/prismaClient.js";

export const createEvent = async (req, res) => {
  const { name, description, category, date, venue, price, image } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        name,
        description,
        category,
        date,
        venue,
        price,
        image,
      },
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  const eventId = parseInt(id);

  if (isNaN(eventId)) {
    return res
      .status(400)
      .json({ message: "Invalid event ID format. ID must be a number." });
  }

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const eventId = parseInt(id);

  if (isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  const { name, description, category, date, venue, price, image } = req.body;

  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        category,
        date: new Date(date),
        venue,
        price,
        image,
      },
    });

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const eventId = parseInt(id);

  if (isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event ID format." });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({
        where: { eventId: eventId },
      });

      const deletedEvent = await tx.event.delete({
        where: { id: eventId },
      });

      return deletedEvent;
    });

    res
      .status(200)
      .json({ message: "Event and associated bookings deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Event not found to delete." });
    }
    res
      .status(500)
      .json({ message: "Something went wrong while deleting the event" });
  }
};
