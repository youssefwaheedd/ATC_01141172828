/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/events/EventForm";
import { type EventFormData } from "@/constants/interfaces";
import { createEvent } from "@/services/events/eventsServices";
import { uploadImageToSupabase } from "@/constants/functions";
import toast from "react-hot-toast";

const CreateEvent: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
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

      if (!user) {
        throw new Error("Authentication token is missing.");
      }

      const response = await createEvent(payload);

      if (response.status === 201) {
        setTimeout(() => {
          navigate("/admin/events");
        }, 1000);
      } else {
        toast.error("Error creating event: " + response.statusText);
      }
    } catch (err: any) {
      toast.error(
        "Error creating event: " + (err.response?.data?.message || err.message)
      );
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
