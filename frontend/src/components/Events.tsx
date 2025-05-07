// src/components/Events.tsx (or wherever it lives)
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EventCard from "./EventCard"; // Adjust path if needed
import { LoaderCircleIcon } from "lucide-react";
import type { EventCardProps } from "@/constants/sidebar-items"; // Make sure EventCardProps includes the booking props
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { fetchUserBookings } from "@/services/bookings/bookingServices"; // Import booking service
import { toast } from "react-hot-toast"; // For notifications

// Define type for user bookings if not already defined elsewhere
interface UserBooking {
  id: number; // Booking ID
  eventId: number;
  // Add other relevant fields if needed
}

const Events: React.FC = () => {
  const { user, token } = useAuth(); // Get user and token
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [userBookedEventIds, setUserBookedEventIds] = useState<Set<number>>(
    new Set()
  ); // Store booked IDs
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Loading state for events
  const [isLoadingBookings, setIsLoadingBookings] = useState(false); // Loading state for bookings (only if user logged in)

  // Minimum display time for initial combined loader
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const MIN_LOADER_TIME_MS = 750;

  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch all events
  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setError(null);
    try {
      const response = await axios.get<EventCardProps[]>(
        "http://localhost:3000/events"
      );
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setEvents([]); // No events found
        } else {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Failed to load events.";
          setError(msg);
          setEvents([]);
          toast.error(msg);
        }
      } else {
        setError("An unexpected error occurred loading events.");
        setEvents([]);
        toast.error("An unexpected error occurred loading events.");
      }
    } finally {
      setIsLoadingEvents(false);
    }
  }, []); // Empty dependency array - fetch events once

  // Fetch user's bookings
  const loadUserBookings = useCallback(async () => {
    // Only fetch if user is logged in (and not admin, though card handles display)
    if (user && token) {
      setIsLoadingBookings(true); // Indicate bookings are loading
      try {
        const bookings: UserBooking[] = await fetchUserBookings(token);
        const bookedIds = new Set(bookings.map((b) => b.eventId));
        setUserBookedEventIds(bookedIds);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch user bookings:", error.message);
        } else {
          console.error("Failed to fetch user bookings:", error);
        }
        // Don't necessarily show an error toast here, maybe just log
        // Or show a subtle indicator that booking status might be inaccurate
        // toast.error(error.message || "Could not load your booking status.");
        setUserBookedEventIds(new Set()); // Reset on error
      } finally {
        setIsLoadingBookings(false);
      }
    } else {
      setUserBookedEventIds(new Set()); // Clear if not logged in
    }
  }, [user, token]); // Depend on user and token

  // Combined loading state for initial display

  // Effect to run fetches on mount and when user logs in/out
  useEffect(() => {
    loadEvents();
    loadUserBookings();
  }, [loadEvents, loadUserBookings]); // Depend on the stable callback functions

  // Effect for minimum initial loader time
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    // Only manage timer if the component is actually NOT loading anymore
    if (!isLoadingEvents && !(!!user && isLoadingBookings)) {
      timerId = setTimeout(() => {
        setShowInitialLoader(false);
      }, MIN_LOADER_TIME_MS);
    } else {
      // If loading starts again, ensure the loader is shown
      setShowInitialLoader(true);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isLoadingEvents, isLoadingBookings, user]);

  // Handler to refresh data, e.g., after deletion
  const handleEventDeleted = () => {
    toast.success("Event deleted. Refreshing list...");
    loadEvents(); // Re-fetch events
    // No need to reload bookings here unless deletion affects them
  };

  // Handler to refresh booking status after book/cancel action in child card
  const handleBookingChanged = () => {
    // Re-fetch just the user's bookings to update the 'isBookedByCurrentUser' prop
    loadUserBookings();
  };

  // --- Render Logic ---

  if (isLoadingEvents || (!!user && isLoadingBookings) || showInitialLoader) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-2xl text-foreground">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
          <span>Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-2xl text-destructive">
          <span>Error: {error}</span>
          <button
            onClick={loadEvents} // Allow retry fetching events
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="fixed inset-0 flex h-screen w-screen items-center justify-center">
        <div className="flex items-center gap-2 text-2xl text-foreground">
          <span>No Events Found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full ">
      <div className="p-2 sm:p-12 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div className="w-full" key={event.id}>
            <EventCard
              // Pass event data
              id={event.id}
              image={event.image || "/placeholder.jpeg"}
              name={event.name}
              description={event.description}
              category={event.category}
              date={event.date}
              venue={event.venue}
              price={event.price}
              // Pass booking status and handlers
              isBookedByCurrentUser={userBookedEventIds.has(Number(event.id))} // Ensure event ID is a number
              onBookingChanged={handleBookingChanged} // Callback to refresh booking status
              // Pass delete handler (for admin cards)
              onDelete={handleEventDeleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
