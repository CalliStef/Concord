export interface Message {
    id: number;
    text: string;
    user: User;
    created: Date;
    channelId: number;
  };
  
export interface Channel{
  id: number;
  name: string;
  created: Date;
  messages: Message[];
  totalUsers: number;
  users: User[];
};

export interface User{
  id: number;
  username: string;
  photo?: string;
  created: Date;
  updated: Date;
  channels: Channel[];
}