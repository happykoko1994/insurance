import ContactForm from "../components/ContactForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100  p-10">
      <div className="w-1/2 p-6 bg-white rounded-xl shadow-lg">
        <ContactForm />
      </div>
      <ToastContainer />
    </div>
  );
}
