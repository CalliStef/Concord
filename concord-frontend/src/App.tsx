import React, { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import useSignalR from "./useSignalR";
import ChannelForm from "./components/ChannelForm";
import ChannelList from "./components/ChannelList";
import MessagesList from "./components/MessagesList";
import MessageForm from "./components/MessageForm";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import { Channel, Message, User } from "./models";
import axios from "axios";

export default function App() {
  const { connection } = useSignalR("/r/chat");
  const [userForm, setUserForm] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [currentEditedMessage, setCurrentEditedMessage] =
    useState<Message | null>();
  const [currentEditedChannel, setCurrentEditedChannel] =
    useState<Channel | null>();
  const messageListRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    (async (): Promise<void> => {
      const { data } = await axios.get<Channel[]>("api/channels/");
      setChannels(data);
    })();
  }, []);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveMessage", (newMessage: Message) => {
        // console.log("new message", newMessage)
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      connection.on("MessageDeleted", (messageId: number) => {
        setMessages((prevMessages) =>
          prevMessages.filter((m) => m.id !== messageId)
        );
      });

      connection.on("MessageUpdated", (message: Message) => {
        setMessages((prevMessages) =>
          prevMessages.map((m) => {
            if (m.id === message.id) {
              return message;
            }
            return m;
          })
        );
      });

      connection.on("ReceiveChannel", (newChannel: Channel) => {
        setChannels((prevChannels) => [...prevChannels, newChannel]);
      });

      connection.on("ChannelDeleted", (channelId: number) => {
        setChannels((prevChannels) =>
          prevChannels.filter((m) => m.id !== channelId)
        );
      });

      connection.on("ChannelUpdated", (channel: Channel) => {
        setChannels((prevChannels) =>
          prevChannels.map((c) => {
            if (c.id === channel.id) {
              return channel;
            }
            return c;
          })
        );
      });

      connection.on("UserUpdated", (user: User) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) => {
            if (u.id === user.id) {
              return user;
            }
            return u;
          })
        );
        setMessages((prevMessages) =>
          prevMessages.map((m) => {
            if (m.user.id === user.id) {
              m.user = user;
            }
            return m;
          })
        )
      });

      connection.on("UserJoined", (user: User) => {
        // console.log("user joined", user)
        setUsers((prevUsers) => [...prevUsers, user]);
      });

      connection.on("UserLeft", (userId: number) => {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      });
    }

    return () => {
      connection?.off("ReceiveMessage");
      connection?.off("MessageDeleted");
      connection?.off("MessageUpdated");
      connection?.off("ReceiveChannel");
      connection?.off("ChannelDeleted");
      connection?.off("ChannelUpdated");
      connection?.off("UserUpdated");
      connection?.off("UserJoined");
      connection?.off("UserLeft");
    };
  }, [connection]);

  useEffect(() => {
    if (!connection) {
      return;
    }

    (async (): Promise<void> => {

      const { data } = await axios.get<Channel>(
        `api/channels/${currentChannel?.id}`
      );
      
      // console.log("messages", data.messages)

      // console.log("current channel", data);
      setMessages(data.messages);
      setUsers(data.users);
    })();

    return () => {
      connection.off("AddToGroup");
    };
  }, [currentChannel]);

  const handleChannelSubmit = async (channelName?: string) => {
    if (!channelName || !channelName.trim().length) {
      return;
    }

    const { data } = await axios.post<Channel>("api/channels/", {
      name: channelName,
    });
  };

  const handleChannelChange = async (channel: Channel) => {
    // if(currentChannel){
    // await connection?.invoke('RemoveFromGroup', currentChannel)
    // }
    setCurrentChannel(channel);
  };

  const handleMessageSubmit = async (message?: string) => {
    if (!message || !message.trim().length) {
      return;
    }

    connection?.invoke("SendMessage", message);

    const messageData = {
      text: message,
      userId: currentUser?.id,
    };

    const { data } = await axios.post<Message>(
      `api/channels/${currentChannel?.id}/messages`,
      messageData
    );
  };

  const handleDeleteMessage = async (id: number) => {
    axios
      .delete<Message>(`api/messages/${id}`)
      .then(() => console.log("message deleted!"))
      .catch((err) => console.error(err));
  };

  const handleEditMessage = async (messageData: Message) => {
    setCurrentEditedMessage(messageData);
  };

  const handleUpdateMessage = async (
    messageData: Message,
    message?: string
  ) => {
    if (!message || !message.trim().length) {
      return;
    }

    messageData.text = message;

    axios
      .put<Message>(`api/messages/${messageData.id}`, messageData)
      .then(() => console.log("message updated!"))
      .catch((err) => console.error(err));

    setCurrentEditedMessage(null);
  };

  const handleChannelDelete = async (id: number) => {
    axios
      .delete<Channel>(`api/channels/${id}`)
      .then(() => console.log("channel deleted!"))
      .catch((err) => console.error(err));
  };

  const handleChannelEdit = async (channelData: Channel) => {
    setCurrentEditedChannel(channelData);
  };

  const handleUpdateChannel = async (
    channelData: Channel,
    channelName?: string
  ) => {
    if (!channelName || !channelName.trim().length) {
      return;
    }

    channelData.name = channelName;

    axios
      .put<Channel>(`api/channels/${channelData.id}`, channelData)
      .then(() => console.log("channel updated!"))
      .catch((err) => console.error(err));

    setCurrentEditedChannel(null);
  };

  const handleUserJoin = async (channel: Channel, user?: User ) => {

    // check if there's an existing channel in the user's channels
    // user?.channels.some(c => c.id === channel.id)
    // console.log("user", user)
    if(user?.channels.find(c => c.id === channel.id)){ // if user finds the channel
      // console.log("dont add user, just change channel")

      handleChannelChange(channel)
    } else {
      await connection?.invoke("AddToGroup", channel.id);
      // console.log("user join in channel")
      user?.channels.splice(0)
      const { data } = await axios.post<User>(
        `api/channels/${channel?.id}/users`,
        user
      );
      setCurrentUser(data)
      // console.log('user data', data)
      handleChannelChange(channel)
    }

  };

  const handleUserLeave = async (user?: User) => {
    const { data } = await axios.delete<User>(
      `api/channels/${currentChannel?.id}/users/${user}`
    );
  };

  const handleUserSubmit = async (inputData: {
    name?: string;
    photo?: string;
  }) => {
    const { name, photo } = inputData;
    if (!name || !name.trim().length) {
      return;
    }

    const { data } = await axios.post<User>("api/users", {
      username: name,
      photo: photo || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg",
      channels: [],
    });

    // console.log('currentUser', data)

    setCurrentUser(data);
    setUserForm(false);
  };

  const handleUpdateUser = async (
    currentUser: User,
    inputData: { name?: string; photo?: string }
  ) => {
    const { name, photo } = inputData;
    if (!name || !name.trim().length ) {
      return;
    }

    currentUser.username = name;
    currentUser.photo = photo || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";

    axios
      .put<User>(`api/users/${currentUser.id}`, currentUser)
      .then(() => console.log("user updated!"))
      .catch((err) => console.error(err));

    setCurrentUser(currentUser);
  };

  return (
    <div className="App flex bg-neutral-800">
      {userForm ? (
        <div className="flex w-screen h-screen justify-center items-center flex-col text-center">
          <h1 className="mb-4">Welcome to Concord</h1>
          <UserForm
            handleUserSubmit={handleUserSubmit}
            currentUser={currentUser}
            handleUpdateUser={handleUpdateUser}
          />
        </div>
      ) : (
        <div className="flex w-screen h-screen">
          <div className="flex flex-col h-screen w-1/4 text-center p-8 gap-4 rounded-full bg-neutral-800">
            <UserForm
              handleUserSubmit={handleUserSubmit}
              currentUser={currentUser}
              handleUpdateUser={handleUpdateUser}
            />
            <ChannelForm
              handleChannelSubmit={handleChannelSubmit}
              currentEditedChannel={currentEditedChannel}
              handleUpdateChannel={handleUpdateChannel}
            />
            <ChannelList
              channels={channels}
              currentUser={currentUser}
              handleUserJoin={handleUserJoin}
              handleChannelChange={handleChannelChange}
              handleUserLeave={handleUserLeave}
              currentChannel={currentChannel}
              handleChannelDelete={handleChannelDelete}
              handleChannelEdit={handleChannelEdit}
            />
          </div>

          <div className="flex flex-col w-full bg-neutral-900 h-screen">
            {currentChannel ? (
              <div className="grid grid-flow-col">
              <div className="col-span-3">
                <div className="flex flex-col h-full w-full">
                  <div
                    ref={messageListRef}
                    className="w-full h-full overflow-y-auto"
                  >
                    <MessagesList
                      messages={messages}
                      currentUser={currentUser}
                      handleDeleteMessage={handleDeleteMessage}
                      handleEditMessage={handleEditMessage}
                    />
                  </div>
                  <MessageForm
                    handleMessageSubmit={handleMessageSubmit}
                    currentEditedMessage={currentEditedMessage}
                    handleUpdateMessage={handleUpdateMessage}
                  />
                </div>
                
              </div>
              <div className="flex flex-col w-full p-8 gap-4 h-screen bg-neutral-800">
                <UserList users={users} />
              </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <h1 className="text-center text-lg">
                  Welcome {currentUser?.username}
                </h1>
                <h2 className="text-center text-base">
                  Join a channel to start messaging!
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
