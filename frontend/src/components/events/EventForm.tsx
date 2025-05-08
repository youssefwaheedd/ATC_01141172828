import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EventFormData, EventFormProps } from "@/constants/interfaces";
import { LoaderCircleIcon } from "lucide-react";

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  originalImageURL,
  onSubmit,
  isSubmitting,
  submitButtonText = "Submit",
  formTitle = "Event Details",
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDisplayingProcessingLoader, setIsDisplayingProcessingLoader] =
    useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitting) {
      setIsDisplayingProcessingLoader(true);
    } else if (isDisplayingProcessingLoader && !isSubmitting) {
      timer = setTimeout(() => {
        setIsDisplayingProcessingLoader(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isSubmitting, isDisplayingProcessingLoader]);

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setCategory(initialData?.category || "");
    setVenue(initialData?.venue || "");
    setDate(
      initialData?.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : ""
    );
    setPrice(initialData?.price || 0);
    setImageFile(null);
    setImagePreviewUrl(originalImageURL || null);
  }, [initialData, originalImageURL]);

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(originalImageURL || null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formDataToSubmit: EventFormData = {
      name,
      description,
      category,
      venue,
      date,
      price,
    };
    onSubmit(formDataToSubmit, imageFile);
  };

  return (
    <div className="lg:w-[60%] md:w-[70%] w-[90%] mx-auto dark:bg-black bg-white p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold">{formTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Event Name</Label>{" "}
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter event name..."
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Enter venue..."
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            className="dark:bg-white dark:text-black"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price (EGP)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter price..."
            required
            min="0"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category..."
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20 resize-none overflow-y-auto overflow-x-hidden break-all"
            placeholder="Enter event description..."
            rows={2}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="imageFile">Event Image (JPG)</Label>
          {imagePreviewUrl && (
            <div className="my-2">
              <img
                src={imagePreviewUrl}
                alt="Event preview"
                className="max-w-xs h-auto rounded object-cover"
              />
            </div>
          )}
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
          {imageFile && (
            <p className="text-xs text-gray-500 mt-1">
              New image selected: {imageFile.name}
            </p>
          )}
          {!imageFile && imagePreviewUrl && (
            <p className="text-xs text-gray-500 mt-1">
              To replace the image, choose a new file.
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isDisplayingProcessingLoader ? (
            <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-2xl text-foreground">
                <LoaderCircleIcon className="h-8 w-8 animate-spin" />
                <span>Processing...</span>
              </div>
            </div>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </div>
  );
};

export default EventForm;
