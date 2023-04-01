import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import { Message, User } from "../models";

interface MessagesListProps {
  messages: Message[];
  currentUser?: User;
  handleDeleteMessage: (id: number) => void;
  handleEditMessage: (messageData: Message) => void;
}

export default function MessagesList({
  messages,
  currentUser,
  handleDeleteMessage,
  handleEditMessage,
}: MessagesListProps) {
  const divRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [currentEditMessage, setCurrentEditMessage] = useState<number | null>();

  useEffect(() => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={divRef}
      className="flex flex-col w-full h-full px-8 pt-8 overflow-y-auto"
    >
      {messages.map((message) => (
        <div  
          className={`flex chat items-center  transition-all duration-1000 ease-in-out ${
            currentUser?.id === message.user.id
              ? "self-end"
              : "self-start"
          }`}
          key={message.id}
          onMouseEnter={(e) => setCurrentEditMessage(message.id)}
          onMouseLeave={(e) => setCurrentEditMessage(null)}
        >
          <div
            className={`chat transition-all duration-1000 ease-in-out ${
              currentUser?.id === message.user.id
                ? "chat-end"
                : "chat-start"
            }`}
          
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={message.user.photo} />
              </div>
            </div>
            <div className="chat-header">
              {message.user.username}
              <time className="text-xs opacity-50">
                {new Date(message.created).toISOString().substring(0, 10)}
              </time>
            </div>
            <div
              className={`chat-bubble ${
                currentUser?.id === message.user.id
                  ? "chat-bubble-accent"
                  : ""
              }`}
            >
              {message.text}
            </div>
          </div>
          {currentUser?.id === message.user.id &&
            currentEditMessage === message.id && (
              <div className="flex gap-2 items-center">
                <button
                  className="btn btn-circle btn-error btn-sm"
                  onClick={(e) => handleDeleteMessage(message.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button
                  className="btn btn-circle btn-info btn-sm"
                  onClick={(e) => handleEditMessage(message)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white h-3 w-3 bi bi-pencil"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path
                      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                      fill="white"
                    ></path>{" "}
                  </svg>
                </button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
