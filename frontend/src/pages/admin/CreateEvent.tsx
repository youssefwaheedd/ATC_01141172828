/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";
import {
  uploadImageToSupabase,
  type EventFormData,
} from "@/constants/sidebar-items";
import { createEvent } from "@/services/events/eventsServices";

const CreateEvent: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (
    formData: EventFormData,
    imageFile?: File | null
  ) => {
    setIsSubmitting(true);
    let imageUrl: string | null = null;

    try {
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile);
      }

      const payload = {
        ...formData,
        image: imageUrl,
        date: new Date(formData.date).toISOString(),
      };

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await createEvent(payload, token);

      if (response.status === 201) {
        setTimeout(() => {
          navigate("/admin/events");
        }, 1000);
      } else {
        console.error("Failed to create event:", response.statusText);
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <EventForm
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create Event"
        formTitle="Create New Event"
      />
    </div>
  );
};

export default CreateEvent;
