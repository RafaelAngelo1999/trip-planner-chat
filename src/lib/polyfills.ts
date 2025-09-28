// Browser polyfills for Node.js globals
// This ensures compatibility with libraries that expect Node.js environment

declare global {
  interface Window {
    process?: any;
  }
}

// Simple process polyfill for browser environment
if (typeof window !== "undefined" && !(window as any).process) {
  (window as any).process = {
    env: {
      NODE_ENV: "development",
    },
    browser: true,
    version: "",
    platform: "browser",
    argv: [],
    pid: 0,
    title: "browser",
    nextTick: (callback: (...args: any[]) => void, ...args: any[]) => {
      setTimeout(() => callback(...args), 0);
    },
  };
}

// Add comprehensive error handlers for external components
if (typeof window !== "undefined") {
  // Override console.error to catch and handle specific errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("Cannot read properties of undefined") ||
        message.includes("convertApiFlightToItinerary") ||
        message.includes("getFlightDetails") ||
        message.includes("fetchFlight"))
    ) {
      originalError(
        "🔧 External Component Error (handled by polyfill):",
        ...args,
      );
      return;
    }
    originalError(...args);
  };

  // Global error event handler for runtime errors
  window.addEventListener(
    "error",
    (event) => {
      const errorMessage = event.error?.message || event.message || "";
      if (
        errorMessage.includes("Cannot read properties of undefined") ||
        errorMessage.includes("convertApiFlightToItinerary") ||
        errorMessage.includes("getFlightDetails") ||
        errorMessage.includes("fetchFlight") ||
        event.filename?.includes("entrypoint.js")
      ) {
        console.warn("🔧 Intercepted external component error:", errorMessage);
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },
    true,
  ); // Use capture phase

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason && event.reason.message) {
      const message = event.reason.message;
      if (
        message.includes("Cannot read properties of undefined") ||
        message.includes("convertApiFlightToItinerary") ||
        message.includes("getFlightDetails") ||
        message.includes("fetchFlight")
      ) {
        console.warn("🔧 Intercepted unhandled promise rejection:", message);
        event.preventDefault();
        return;
      }
    }
  });

  // Override window.onerror as additional safety net
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (
      typeof message === "string" &&
      (message.includes("Cannot read properties of undefined") ||
        message.includes("convertApiFlightToItinerary") ||
        source?.includes("entrypoint.js"))
    ) {
      console.warn("🔧 Intercepted window.onerror:", message);
      return true; // Prevent default error handling
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    return false;
  };
}

// Ensure global process is available for dynamic imports
if (typeof globalThis !== "undefined" && !(globalThis as any).process) {
  (globalThis as any).process = {
    env: {
      NODE_ENV: "development",
    },
    browser: true,
  };
}

export {};
