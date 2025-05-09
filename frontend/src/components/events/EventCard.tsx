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
import { Button } from "../ui/button";
import { Calendar, CoinsIcon, LoaderCircleIcon, Pin, Tags } from "lucide-react";
import { Badge } from "../ui/badge";
import AlertDialogComponent from "@/components/AlertDialogComponent";
import type { EventCardProps } from "@/constants/interfaces";
import { useNavigate } from "react-router-dom";
import { deleteEvent } from "@/services/events/eventsServices";
import {
  createBooking,
  deleteUserBooking,
} from "@/services/bookings/bookingServices";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
  isBookedByCurrentUser,
  onBookingChanged,
}: EventCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookEvent = async () => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    try {
      const payload = { eventId: id };
      await createBooking(payload);
      if (onBookingChanged) onBookingChanged();
      navigate("/booked-successfully");
    } catch (error: any) {
      toast.error("Error booking event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteUserBooking(id);
      if (onBookingChanged) onBookingChanged();
    } catch (error: any) {
      toast.error("Error canceling booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (!user) {
        return;
      }
      await deleteEvent(id);
      if (onDelete) onDelete();
    } catch (error: any) {
      toast.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = () => {
    navigate(`/admin/edit-event/${id}`);
  };

  const displayisLoading = isLoading;

  return (
    <Card className="flex flex-col h-full">
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
      {user && user?.isAdmin && (
        <CardFooter className="flex gap-3 pt-4 border-t ">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            onClick={handleEditEvent}
          >
            Edit
          </Button>
          <AlertDialogComponent onConfirm={handleDeleteEvent} />
        </CardFooter>
      )}
      {user && user && !user.isAdmin && (
        <CardFooter className="pt-4 border-t">
          {isBookedByCurrentUser ? (
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              onClick={handleCancelBooking}
              disabled={displayisLoading}
            >
              {displayisLoading ? (
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
              className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              onClick={handleBookEvent}
              disabled={displayisLoading}
            >
              {displayisLoading ? (
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
