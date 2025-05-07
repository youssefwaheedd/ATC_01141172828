import prisma from "../db/prismaClient.js";

// Create an event
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
    console.error("Event creation error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  const eventId = parseInt(id); // Convert param to integer

  // Validate if eventId is a number
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
    console.error("Get event by ID error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get all events (for users)
export const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    res.status(200).json(events);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update an event (only for admins)
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
    console.error("Event update error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete an event (only for admins)
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Event delete error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
