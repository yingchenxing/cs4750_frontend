"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Search } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import {
  Message,
  Conversation,
  messageService,
} from "../../services/messages";

export default function MessagesPage() {
  const { user } = useAuth();
  const params = useParams();
  const targetUserId = params?.userId ? parseInt(params.userId as string, 10) : null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async (): Promise<Conversation[]> => {
    if (!user?.userId) {
      return []; // always return an array
    }
    try {
      const convos = await messageService.getConversations(user.userId);
      setConversations(convos);
      return convos;
    } catch {
      toast.error("Failed to load conversations");
      return [];
    }
  }, [user?.userId]);

  // Initialize chat with target user
  useEffect(() => {
    const initialize = async () => {
      if (!user?.userId) {
        setIsLoading(false);
        return;
      }
      const all = await fetchConversations();
      const partner = targetUserId ?? all[0]?.partnerId;
      if (partner) {
        try {
          const convMsgs = await messageService.getConversation(user.userId, partner);
          setMessages(convMsgs);
          setSelectedPartnerId(partner);
        } catch {
          setMessages([]);
        }
      }
      setIsLoading(false);
    };
    initialize();
  }, [user?.userId, targetUserId, fetchConversations]);

  const handleSendMessage = async () => {
    if (!selectedPartnerId || !newMessage.trim() || !user?.userId) return;
    try {
      const sent = await messageService.sendMessage({
        senderId: user.userId,
        receiverId: selectedPartnerId,
        content: newMessage.trim(),
      });
      setMessages(prev => [...prev, sent]);
      setNewMessage("");

      // Update conversations list
      await fetchConversations();
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleSelectConversation = async (partnerId: number) => {
    setSelectedPartnerId(partnerId);
    try {
      const convMsgs = await messageService.getConversation(user!.userId, partnerId);
      setMessages(convMsgs);
    } catch {
      setMessages([]);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="text-center">Please log in to view messages</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="text-center">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="grid h-[600px] gap-4 md:grid-cols-[300px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredConversations.map(conv => (
                <div
                  key={conv.partnerId}
                  className={`flex cursor-pointer items-center space-x-4 p-4 hover:bg-muted/50 ${selectedPartnerId === conv.partnerId ? "bg-muted" : ""
                    }`}
                  onClick={() => handleSelectConversation(conv.partnerId)}
                >
                  <Avatar>
                    <AvatarImage src={conv.partnerProfilePicture} alt={conv.partnerName} />
                    <AvatarFallback>{conv.partnerName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {conv.partnerName}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.lastMessage.sentAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        {selectedPartnerId ? (
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4">
              {(() => {
                const conversation = conversations.find(c => c.partnerId === selectedPartnerId);
                if (!conversation) return null;

                return (
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={conversation.partnerProfilePicture}
                        alt={conversation.partnerName}
                      />
                      <AvatarFallback>
                        {conversation.partnerName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {conversation.partnerName}
                      </CardTitle>
                    </div>
                  </div>
                );
              })()}
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet. Start a conversation!
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.messageId}
                        className={`flex ${message.sender.userId === user.userId ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${message.sender.userId === user.userId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`mt-1 text-xs ${message.sender.userId === user.userId
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                              }`}
                          >
                            {new Date(message.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
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
        ) : (
          <Card className="flex items-center justify-center">
            <CardContent>
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}