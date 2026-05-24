import { AuthProvider } from "./context/AuthContext";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuditProvider } from "./context/AuditContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <AuditProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
  </AuditProvider>
);