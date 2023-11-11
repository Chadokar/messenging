import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (textAreaRef, value) => {
  useEffect(() => {
    if (textAreaRef && value) {
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      textAreaRef.style.height = scrollHeight - 20 + "px";
    }
    if (!value && textAreaRef && textAreaRef.style) {
      textAreaRef.style.height = "24px";
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
