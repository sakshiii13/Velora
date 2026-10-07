import React, { createContext, useContext, useState } from "react";
import SnackBar from "../component/ui/SnackBar";
const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    title: "",
    severity: "success",
    position: "top-right",
    autoHideDuration: 3000,
    triggerId: 0,
  });

  const showSnackbar = (message, severity = "success", options = {}) => {
    setSnackbar((prev) => ({
      open: true,
      message,
      title: options.title || "",
      severity,
      position: options.position || "top-right",
      autoHideDuration: options.autoHideDuration || 3000,
      triggerId: (prev.triggerId || 0) + 1,
    }));
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* 🔔 Global Snackbar */}
      <SnackBar
        open={snackbar.open}
        message={snackbar.message}
        title={snackbar.title}
        severity={snackbar.severity}
        position={snackbar.position}
        autoHideDuration={snackbar.autoHideDuration}
        triggerId={snackbar.triggerId}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

// 🔥 Custom Hook
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  }
  return context;
};
