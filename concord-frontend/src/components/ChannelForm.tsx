import React, { useEffect, useState } from "react";
import { Channel } from "../models";

interface ChannelFormProps {
  handleChannelSubmit: (channelName?: string) => void;
  currentEditedChannel?: Channel | null;
  handleUpdateChannel: (channelData: Channel, channelName?: string) => void;
}

export default function ChannelForm({
  handleChannelSubmit,
  currentEditedChannel,
  handleUpdateChannel,
}: ChannelFormProps) {
  const [input, setInput] = useState<string | undefined>(currentEditedChannel?.name || "");

  useEffect(() => {
    setInput(currentEditedChannel?.name);
  }, [currentEditedChannel]);

  const onChannelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    if (currentEditedChannel) {
      handleUpdateChannel(currentEditedChannel, input);
    } else {
      handleChannelSubmit(input);
    }
    setInput("");

  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onChannelSubmit}>
      {currentEditedChannel ? (
        <label>Update Channel Name:</label>
      ) : (
        <label>New Channel Name:</label>
      )}

      <input
        type="text"
        // value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      {currentEditedChannel ? (
        <button className="btn btn-outline btn-accent" type="submit">
          Update Channel
        </button>
      ) : (
        <button className="btn btn-outline btn-accent" type="submit">
          Create Channel
        </button>
      )}
    </form>
  );
}
