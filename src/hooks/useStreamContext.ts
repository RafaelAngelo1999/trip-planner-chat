import { useContext } from "react";
import StreamContext from "../providers/Stream";

export const useStreamContext = () => {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStreamContext must be used within a StreamProvider");
  }
  return context;
};