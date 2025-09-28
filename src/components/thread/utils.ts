import type { Message } from "@langchain/langgraph-sdk";

/**
 * Extracts a string summary from a message's content, supporting multimodal (text, image, file, etc.).
 * - If text is present, returns the joined text.
 * - If not, returns a label for the first non-text modality (e.g., 'Image', 'Other').
 * - If unknown, returns 'Multimodal message'.
 */
export function getContentString(content: Message["content"]): string {
  // Handle null, undefined, or empty content
  if (!content) return "Empty message";

  if (typeof content === "string") return content;

  // Handle array content - ensure it's actually an array
  if (!Array.isArray(content)) return "Invalid message format";

  // Filter and extract text content safely
  const texts = content
    .filter(
      (c): c is { type: "text"; text: string } =>
        c &&
        typeof c === "object" &&
        c.type === "text" &&
        typeof c.text === "string",
    )
    .map((c) => c.text);

  // If no text found, check for other content types
  if (texts.length === 0) {
    const firstNonText = content.find(
      (c) => c && typeof c === "object" && c.type !== "text",
    );
    if (firstNonText?.type) {
      return `[${firstNonText.type.charAt(0).toUpperCase() + firstNonText.type.slice(1)} content]`;
    }
    return "Multimodal message";
  }

  return texts.join(" ");
}
