import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "./lib/api-client";

setBaseUrl("https://verdorra-backend.onrender.com");

const root = document.getElementById("root");
createRoot(root).render(<App />);
