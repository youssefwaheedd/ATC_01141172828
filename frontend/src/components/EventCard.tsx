/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Calendar, CoinsIcon, LoaderCircleIcon, Pin, Tags } from "lucide-react";
import { Badge } from "./ui/badge";
import AlertDialogComponent from "@/pages/admin/AlertDialogComponent";
import type { EventCardProps } from "@/constants/sidebar-items"; // Assuming this type is updated
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "@/services/events/eventsServices";
import {
  createBooking,
  deleteUserBooking,
} from "@/services/bookings/bookingServices";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const MIN_BUTTON_LOADING_TIME_MS = 1000; // Min time for loader on button

const EventCard = ({
  onDelete,
  id,
  name,
  description,
  category,
  date,
  venue,
  price,
  image,
  isBookedByCurrentUser, // New prop
  onBookingChanged, // New prop
}: EventCardProps) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [actionInProgress, setActionInProgress] = useState(false); // Handles booking/cancelling loading
  const [showButtonLoaderMinTime, setShowButtonLoaderMinTime] = useState(false);

  // Effect to ensure loader shows for a minimum time on the button
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (actionInProgress) {
      setShowButtonLoaderMinTime(true);
    } else if (showButtonLoaderMinTime && !actionInProgress) {
      timerId = setTimeout(() => {
        setShowButtonLoaderMinTime(false);
      }, MIN_BUTTON_LOADING_TIME_MS);
    }
    return () => clearTimeout(timerId);
  }, [actionInProgress, showButtonLoaderMinTime]);

  const handleBookEvent = async () => {
    if (!token || !user) {
      toast.error("Please log in to book.");
      return;
    }
    setActionInProgress(true);
    try {
      const payload = { eventId: id };
      await createBooking(payload, token);
      if (onBookingChanged) onBookingChanged();
      navigate("/booked-successfully"); // Redirect to bookings page after booking
    } catch (error: any) {
      toast.error(error.message || "Could not book event.");
      console.error("Booking error:", error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!token || !user) {
      toast.error("Please log in to cancel.");
      return;
    }
    setActionInProgress(true);
    try {
      // Assumes backend route DELETE /bookings/event/:eventId exists
      await deleteUserBooking(id, token);
      toast.success("Booking canceled successfully!");
      if (onBookingChanged) onBookingChanged();
    } catch (error: any) {
      toast.error(error.message || "Could not cancel booking.");
      console.error("Cancel booking error:", error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteEvent = async () => {
    // ... (existing admin delete logic using toast for feedback) ...
    try {
      if (!token) {
        toast.error("Authentication error.");
        return;
      }
      await deleteEvent(id, token); // Assuming this service handles status/errors
      toast.success("Event deleted successfully");
      if (onDelete) onDelete();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = () => {
    navigate(`/admin/edit-event/${id}`);
  };

  const displayActionInProgress = actionInProgress || showButtonLoaderMinTime;

  return (
    <Card className="flex flex-col h-full">
      {" "}
      {/* Ensure consistent card height */}
      <CardHeader>
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover mb-4"
          />
        )}
        <CardTitle className="text-xl capitalize line-clamp-2">
          {name}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-3 h-[3.75rem] overflow-hidden">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Tags size={16} />
            <Badge variant="outline">Category</Badge> {category}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <Badge variant="outline">Date</Badge>{" "}
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Pin size={16} />
            <Badge variant="outline">Venue</Badge> {venue}
          </div>
          <div className="flex items-center gap-2">
            <CoinsIcon size={16} />
            <Badge variant="outline">Price</Badge> {price} EGP
          </div>
        </div>
      </CardContent>
      {token && user?.isAdmin && (
        <CardFooter className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleEditEvent}
          >
            Edit
          </Button>
          <AlertDialogComponent onConfirm={handleDeleteEvent} />
        </CardFooter>
      )}
      {token && user && !user.isAdmin && (
        <CardFooter className="pt-4 border-t">
          {isBookedByCurrentUser ? (
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleCancelBooking}
              disabled={displayActionInProgress}
            >
              {displayActionInProgress ? (
                <div className="flex items-center justify-center">
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  <span>Canceling...</span>
                </div>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          ) : (
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleBookEvent}
              disabled={displayActionInProgress}
            >
              {displayActionInProgress ? (
                <div className="flex items-center justify-center">
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  <span>Booking...</span>
                </div>
              ) : (
                "Book Now"
              )}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
