/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";
import { LoaderCircleIcon } from "lucide-react";
import {
  uploadImageToSupabase,
  type EventFormData,
} from "@/constants/sidebar-items";
import { editEvents, getEventbyId } from "@/services/events/eventsServices";

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [initialEventData, setInitialEventData] = useState<
    Partial<EventFormData> | undefined
  >(undefined);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/admin/events");
      return;
    }

    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        if (!token) {
          throw new Error("token is missing.");
        }
        const response = await getEventbyId(id, token);
        const event = response.data;
        setInitialEventData({
          name: event.name,
          description: event.description,
          category: event.category,
          venue: event.venue,
          date: event.date,
          price: event.price,
        });
        setOriginalImageURL(event.image || null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          navigate("/admin/events");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate, token]);

  const handleFormSubmit = async (
    formData: EventFormData,
    imageFile?: File | null
  ) => {
    setIsSubmitting(true);
    let newImageUrl: string | null | undefined = originalImageURL;
    try {
      if (imageFile) {
        newImageUrl = await uploadImageToSupabase(imageFile);
      }
      const payload = {
        ...formData,
        image: newImageUrl,
        date: new Date(formData.date).toISOString(),
      };
      if (!token || !id) {
        throw new Error("Event ID or token is missing.");
      }

      const response = await editEvents(payload, token, id);

      if (response.status === 200) {
        setTimeout(() => {
          navigate("/admin/events");
        }, 1000);
      }
    } catch (err: any) {
      console.error("Error updating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-2xl text-foreground">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
          <span>Loading Event...</span>
        </div>
      </div>
    );
  }

  if (!initialEventData) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load event data.
      </div>
    );
  }

  return (
    <div className="w-full">
      <EventForm
        initialData={initialEventData}
        originalImageURL={originalImageURL}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Update Event"
        formTitle="Edit Event"
      />
    </div>
  );
};

export default EditEvent;
