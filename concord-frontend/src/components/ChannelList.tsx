import React, { useState } from "react";
import { Channel, User } from "../models";

interface ChannelListProps {
  channels: Channel[];
  currentUser?: User;
  handleChannelChange: (channel: Channel) => void;
  handleUserJoin: (channel: Channel, user?: User) => void;
  handleUserLeave: (user: User) => void;
  currentChannel?: Channel;
  handleChannelDelete: (channelId: number) => void;
  handleChannelEdit: (channelData: Channel) => void;
}

export default function ChannelList({
  channels,
  currentUser,
  handleUserJoin,
  handleChannelChange,
  currentChannel,
  handleUserLeave,
  handleChannelDelete,
  handleChannelEdit,
}: ChannelListProps) {
  const [currentEditChannelId, setCurrentEditChannelId] = useState<
    number | null
  >();

  return (
    <div className="menu bg-neutral-800 w-56">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`flex flex-col items-start gap-x-2 py-3 p-4 dark:text-white ${
            currentChannel?.id === channel.id ? "bg-accent" : ""
          }`}
          onMouseEnter={(e) => setCurrentEditChannelId(channel.id)}
          onMouseLeave={(e) => setCurrentEditChannelId(null)}
          onClick={(e) => handleUserJoin(channel, currentUser)}
        >
          <h2
            className={`text-medium font-medium  ${
              currentChannel?.id === channel.id ? "text-black" : "text-white"
            }`}
          >
            {channel.name}
          </h2>
          <p
            className={`text-sm ${
              currentChannel?.id === channel.id
                ? "text-black"
                : "text-slate-400"
            }`}
          >
            {new Date(channel.created).toISOString().substring(0, 10)}
          </p>
          {currentEditChannelId === channel.id && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {/* {
                currentUser?.channels.find((c) => c.id === channel.id) ? ( // if the user is already in the channel...
                <button className="btn btn-sm" onClick={(e) => handleUserLeave(currentUser)}>Leave</button> // ...show the leave button
              ) : (
                // ...otherwise show the join button
                <button
                  className="btn btn-sm"
                  onClick={(e) => {
                    handleUserJoin(channel, currentUser)
                  }}
                > 
                  Join 
                </button> 
              )} */}

              <button
                className={`btn btn-sm`}
                onClick={(e) => handleChannelEdit(channel)}
              >
                Edit
              </button>
              <button
                className={`btn btn-sm `}
                onClick={(e) => handleChannelDelete(channel.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
