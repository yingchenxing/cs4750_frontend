"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Search } from "lucide-react";

// Mock data for chat list
const mockChats = [
  {
    id: 1,
    username: "john_doe",
    lastMessage: "Thanks for the info!",
    timestamp: "10:30 AM",
    unread: 2,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    username: "sarah_smith",
    lastMessage: "Is the apartment still available?",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: 3,
    username: "mike_wilson",
    lastMessage: "I'll send you the details soon",
    timestamp: "2 days ago",
    unread: 0,
    avatar: "https://github.com/shadcn.png",
  },
];

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    sender: "john_doe",
    content: "Hi, I'm interested in your apartment listing",
    timestamp: "10:00 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "me",
    content: "Hello! Yes, it's still available. Would you like to schedule a viewing?",
    timestamp: "10:05 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "john_doe",
    content: "That would be great! When are you available?",
    timestamp: "10:10 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "me",
    content: "I'm free this weekend. How about Saturday at 2 PM?",
    timestamp: "10:15 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "john_doe",
    content: "Thanks for the info!",
    timestamp: "10:30 AM",
    isOwn: false,
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const filteredChats = mockChats.filter((chat) =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="grid h-[600px] gap-4 md:grid-cols-[300px_1fr]">
        {/* Chat List */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex cursor-pointer items-center space-x-4 p-4 hover:bg-muted/50 ${selectedChat.id === chat.id ? "bg-muted" : ""
                    }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <Avatar>
                    <AvatarImage src={chat.avatar} alt={chat.username} />
                    <AvatarFallback>{chat.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{chat.username}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                    {chat.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar>
              <AvatarImage src={selectedChat.avatar} alt={selectedChat.username} />
              <AvatarFallback>{selectedChat.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{selectedChat.username}</CardTitle>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${message.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                        }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${message.isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                          }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 