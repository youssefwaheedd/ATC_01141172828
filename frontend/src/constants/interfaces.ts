import type { LucideIcon } from "lucide-react";

export interface DecodedUser {
  id: number;
  email?: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}
export interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

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

export interface UseFetchEventsReturn {
  events: EventCardProps[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface EventFormProps {
  initialData?: Partial<EventFormData>;
  originalImageURL?: string | null;
  onSubmit: (formData: EventFormData, imageFile?: File | null) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
  formTitle?: string;
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
  eventId: number | string;
}

export interface BookingResponse {
  message: string;
  booking: {
    id: number;
    userId: number;
    eventId: number;
  };
}

export interface UserBooking {
  id: number;
  eventId: number;
  event?: EventCardProps;
}

export interface EventsComponentProps {
  showOnlyBooked?: boolean;
}
