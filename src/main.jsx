import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Make toast available globally for api.js
if (typeof window !== 'undefined') {
  window.toast = toast;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    {/* Toast global */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
    />
  </StrictMode>
);
