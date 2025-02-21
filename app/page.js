import ContactForm from "../components/ContactForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Info from "../components/Info";


export default function Home() {
  return (
    <div className="flex-grow flex flex-col md:flex-row h-full">
      <div className="w-full md:w-2/3 flex flex-col p-6">
        <Info />
      </div>
      <div className="w-full md:w-1/3 px-6 py-6 md:pr-0 md:pb-3 md:m-3 md:ml-0 bg-white rounded-xl shadow-lg md:fixed md:top-20 md:bottom-0 md:right-0 md:z-10">
        <ContactForm />
      </div>
      <ToastContainer />
    </div>
  );
}
