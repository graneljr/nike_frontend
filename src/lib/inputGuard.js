const emojiPattern = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|[#*0-9]\uFE0F?\u20E3)/u;
const emojiSequencePattern = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|[#*0-9]\uFE0F?\u20E3)/gu;

export function containsEmoji(value) {
  return emojiPattern.test(value);
}

export function stripEmoji(value) {
  return (value || "")
    .replace(emojiSequencePattern, "")
    .replace(/[\uFE0E\uFE0F\u200D]/g, "");
}

export function stripDigits(value) {
  return (value || "").replace(/\d/g, "");
}

function isTextEntry(target) {
  if (target?.isContentEditable || target?.tagName === "TEXTAREA") return true;
  if (target?.tagName !== "INPUT") return false;
  return ["", "text", "search", "email", "tel", "url", "password"].includes(
    target.type,
  );
}

export function blockEmojiInput(event) {
  if (!isTextEntry(event.target)) return;
  const insertedText = event.data ?? "";
  if (insertedText && containsEmoji(insertedText)) event.preventDefault();
  if (event.target.name === "fullName" && /\d/.test(insertedText)) {
    event.preventDefault();
  }
}

export function blockEmojiPaste(event) {
  if (!isTextEntry(event.target)) return;
  const pastedText = event.clipboardData?.getData("text") || "";
  if (containsEmoji(pastedText)) event.preventDefault();
  if (event.target.name === "fullName" && /\d/.test(pastedText)) {
    event.preventDefault();
  }
}

export function blockEmojiDrop(event) {
  if (!isTextEntry(event.target)) return;
  const droppedText = event.dataTransfer?.getData("text") || "";
  if (containsEmoji(droppedText)) event.preventDefault();
  if (event.target.name === "fullName" && /\d/.test(droppedText)) {
    event.preventDefault();
  }
}
