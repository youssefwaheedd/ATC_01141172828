import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BookedSuccessfully = () => {
  return (
    <div className="min-h-screen justify-center flex flex-col items-center bg-background">
      <div className=" p-4 rounded-md text-center ju">
        <h2 className="text-success text-3xl font-bold mb-5">
          You have successfully booked a ticket for the event 🎉🎟️!
          <br /> We can't wait to see you there! 😊
        </h2>
        <p className="text-lg ">We are so excited for you to join us!</p>
      </div>
      <Link to={"/"}>
        <Button className="p-5 bg-blue-600 mt-5 cursor-pointer">
          Explore more events !
        </Button>
      </Link>
    </div>
  );
};

export default BookedSuccessfully;
