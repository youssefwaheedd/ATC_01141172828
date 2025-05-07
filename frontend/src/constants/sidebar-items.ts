import { supabase } from "@/lib/supabase";

export interface EventCardProps {
  onDelete: () => void;
  id: string;
  name: string;
  description: string;
  category: string;
  date: Date;
  venue: string;
  price: number;
  image?: string;
  isBookedByCurrentUser?: boolean;
  onBookingChanged?: () => void;
}

export interface EventFormData {
  name: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  price: number;
}

export interface ApiEvent extends EventFormData {
  id: number;
  image?: string | null;
}

export interface BookingPayload {
  eventId: number | string; // Or whatever your eventId type is
}

export interface BookingResponse {
  message: string;
  booking: {
    id: number;
    userId: number;
    eventId: number;
  };
}

export const adminSidebarItems = [
  {
    name: "Events",
    path: "/admin/events",
    icon: "event",
  },
  {
    name: "Create Event",
    path: "/admin/create-event",
    icon: "add",
  },
];

export const userSidebarItems = [
  {
    name: "Events",
    path: "/",
    icon: "event",
  },
  {
    name: "My Bookings",
    path: "/my-bookings/:id",
    icon: "event",
  },
];

export const uploadImageToSupabase = async (
  file: File
): Promise<string | null> => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `events/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("images") // Your Supabase bucket name
    .upload(filePath, file);

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    throw new Error("Image upload failed: " + uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);
  return urlData.publicUrl;
};
