import React from "react";
import { User } from "../models";

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="flex flex-col gap-4 overflow-y-scroll">
        <h1 className="text-base">Members</h1>
      {users.map((user, index) => (
        <React.Fragment key={index}>
          <div  className="flex gap-2 items-center">
            <div  className="chat-image avatar">  
            <div className="w-8 rounded-full">
              <img src={user.photo} alt={user.username}/>
            </div>
            </div>
            <div className="text-base">{user.username}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
