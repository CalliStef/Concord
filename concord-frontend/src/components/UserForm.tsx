import React, { useEffect, useState } from "react";
import { User } from "../models";

interface UserFormProps {
  handleUserSubmit: (inputData: {name?: string, photo?: string }) => void;
  currentUser?: User | null;
  handleUpdateUser: (currentUser: User, inputData: {name?: string, photo?: string }) => void;
}

interface UserFormInputProps{
  name?: string;
  photo?: string;
}

export default function UserForm({
  handleUserSubmit,
  currentUser,
  handleUpdateUser,
}: UserFormProps) {
  // const [input, setInput] = useState<string | undefined>(
  //   currentUser?.username || ""
  // );

  const [inputData, setInputData] = useState<UserFormInputProps>({
    name: currentUser?.username || "",
    photo: currentUser?.photo || "",
  })

  const [imageAlert, setImageAlert] = useState<boolean>(false);

  // useEffect(() => {
  //   setInput(currentUser?.username);
  // }, [currentUser]);

  const isImageUrl = (url: string): any => {
    // check if image address is valid
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
   
  }

  const onUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(inputData.photo){
      if(!isImageUrl(inputData.photo)){
        
        setImageAlert(true);
        return;
      }
    }

    setImageAlert(false)

    if (currentUser) {
      handleUpdateUser(currentUser, inputData);
    } else {
      handleUserSubmit(inputData);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   
    const { name, value } = e.target;
    setInputData((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onUserSubmit}>
      {
        imageAlert && <p>Please enter a valid image URL</p>
      }

      <label className="text-sm">{currentUser ? "Update User Name" : "New User Name"}</label>

      <input
        type="text"
        value={inputData.name}
        name="name"
        onChange={onChange}
        className="input input-bordered w-full max-w-xs"
      />

      <label className="text-sm">{currentUser ? "Update profile image address" : "Add profile image address (optional)"}</label>

      <input
        type="text"
        value={inputData.photo}
        name="photo"
        onChange={onChange}
        className="input input-bordered w-full max-w-xs"
      />

      <button className="btn btn-outline btn-accent" type="submit">
        {currentUser ? "Update User" : "Create User"}
      </button>
    </form>
  );
}
