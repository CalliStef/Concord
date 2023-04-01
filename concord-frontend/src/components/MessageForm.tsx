import React, { useState, useEffect } from "react";
import { Message } from "../models";

interface MessageFormProps {
  handleMessageSubmit: (message?: string) => void;
  currentEditedMessage?: Message | null;
  handleUpdateMessage: (messageData: Message, message?: string) => void;
}

export default function MessageForm({
  handleMessageSubmit,
  currentEditedMessage,
  handleUpdateMessage,
}: MessageFormProps) {
  const [input, setInput] = useState<string | undefined>("");

  useEffect(() => {
    setInput(currentEditedMessage?.text);
  }, [currentEditedMessage]);

  const onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    if (currentEditedMessage) {
      handleUpdateMessage(currentEditedMessage, input);
    } else {
      handleMessageSubmit(input);
    }
    setInput("");
  };

  return (
    <form className="flex gap-4 p-4 w-full" onSubmit={onMessageSubmit}>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-accent w-full"
        // value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="hover:bg-accent hover:text-black">Send</button>
    </form>
  );
}
