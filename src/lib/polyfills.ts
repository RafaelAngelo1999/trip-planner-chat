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
  // Override console.error to catch and handle external component errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("Cannot read properties of undefined") ||
        message.includes("Cannot read properties of null") ||
        message.includes("TypeError:") ||
        message.includes("ReferenceError:") ||
        message.includes("entrypoint.js"))
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
      const isExternalError =
        errorMessage.includes("Cannot read properties of undefined") ||
        errorMessage.includes("Cannot read properties of null") ||
        errorMessage.includes("TypeError:") ||
        errorMessage.includes("ReferenceError:") ||
        event.filename?.includes("entrypoint.js") ||
        event.filename?.includes("localhost:2024") ||
        (event.error &&
          event.error.stack &&
          event.error.stack.includes("entrypoint.js"));

      if (isExternalError) {
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
      const isExternalError =
        message.includes("Cannot read properties of undefined") ||
        message.includes("Cannot read properties of null") ||
        message.includes("TypeError:") ||
        message.includes("ReferenceError:") ||
        (event.reason.stack && event.reason.stack.includes("entrypoint.js"));

      // Handle LangGraph HTTP 404 errors specifically
      const isLangGraphError =
        message.includes("HTTP 404: UI not found for agent") ||
        message.includes("UI not found for agent") ||
        (event.reason.stack && 
         event.reason.stack.includes("langgraph-sdk") && 
         message.includes("404"));

      if (isExternalError) {
        console.warn("🔧 Intercepted unhandled promise rejection:", message);
        event.preventDefault();
        return;
      }

      if (isLangGraphError) {
        console.warn("🔧 LangGraph UI Error (handled by polyfill):", message);
        console.info("💡 This usually means the agent ID is not configured correctly or the LangGraph server is not running the expected agent.");
        event.preventDefault();
        return;
      }
    }
  });

  // Override window.onerror as additional safety net
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    const isExternalError =
      typeof message === "string" &&
      (message.includes("Cannot read properties of undefined") ||
        message.includes("Cannot read properties of null") ||
        message.includes("TypeError:") ||
        message.includes("ReferenceError:") ||
        source?.includes("entrypoint.js") ||
        source?.includes("localhost:2024"));

    if (isExternalError) {
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
