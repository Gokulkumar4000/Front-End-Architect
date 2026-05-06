import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Send,
  Info,
  MessageSquare,
  Check,
  CheckCheck,
  ArrowLeft,
  Filter,
  Image as ImageIcon,
  FileText,
  Reply,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFirebaseAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/hooks/use-profile";
import {
  subscribeToUserChats,
  subscribeToMessages,
  sendMessage,
  getOrCreateChat,
  markChatAsRead,
  grantChatAccess,
  type ChatRoom,
  type ChatMessage,
} from "@/lib/firestoreService";

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useFirebaseAuth();
  const { profile } = useUserProfile();

  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = useMemo(() => chats.find((c) => c.id === selectedChatId), [chats, selectedChatId]);

  const otherUid = useMemo(() => {
    if (!selectedChat || !user) return null;
    return selectedChat.participants.find((p) => p !== user.uid) || null;
  }, [selectedChat, user]);

  const otherName = otherUid && selectedChat ? (selectedChat.participantNames?.[otherUid] || "Unknown") : "";
  const otherAvatar = otherUid && selectedChat ? (selectedChat.participantAvatars?.[otherUid] || "") : "";
  const otherRole = otherUid && selectedChat ? (selectedChat.participantRoles?.[otherUid] || "") : "";

  // Subscribe to user's chats
  useEffect(() => {
    // Auth still initialising — wait
    if (authLoading) return;
    // Auth done but no user logged in
    if (!user) {
      setLoadingChats(false);
      return;
    }
    const unsub = subscribeToUserChats(user.uid, (rooms) => {
      setChats(rooms);
      setLoadingChats(false);
    });
    return unsub;
  }, [user, authLoading]);

  // Subscribe to messages for selected chat
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(selectedChatId, (msgs) => {
      setMessages(msgs);
    });
    return unsub;
  }, [selectedChatId]);

  // Mark as read when chat is opened
  useEffect(() => {
    if (selectedChatId && user) {
      markChatAsRead(selectedChatId, user.uid).catch(() => {});
    }
  }, [selectedChatId, user]);

  // Handle pending connect / access request from Feed
  useEffect(() => {
    const pendingRequest = localStorage.getItem("pendingConnectRequest");
    if (!pendingRequest || !user || !profile) return;
    const data = JSON.parse(pendingRequest);
    localStorage.removeItem("pendingConnectRequest");

    const myName = data.myName || profile.fullName || user.displayName || "User";
    const myAvatar = data.myAvatar || profile.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myName)}`;
    const myRole = data.myRole || profile.role || "idea-holder";

    if (!data.targetUid) return;

    const isAccessRequest = data.messageType === "access-request";

    const msgText = isAccessRequest
      ? `Hi ${data.userName}! I'd like to request access to the restricted sections of your ${data.postType || "post"}: "${data.postTitle}".\n\nI'm interested in learning more and believe I can add value as a collaborator.`
      : `Hi ${data.userName}! I'm interested in connecting regarding your ${data.postType || "post"}: "${data.postTitle}".\n\nI'd love to discuss potential collaboration opportunities.`;

    getOrCreateChat(
      user.uid, myName, myAvatar, myRole,
      data.targetUid,
      data.userName,
      data.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.userName || "user")}`,
      data.userRole || "member",
      data.postType ? { type: data.postType, title: data.postTitle } : undefined
    ).then((chatId) => {
      setSelectedChatId(chatId);
      if (data.autoSend) {
        return sendMessage(chatId, user.uid, msgText, {
          messageType: data.messageType || "connect-request",
          senderName: myName,
          senderAvatar: myAvatar,
          ...(isAccessRequest ? { postId: data.postId, postAuthorUid: data.postAuthorUid } : {}),
        });
      }
      setMessageInput(msgText);
    }).catch(() => {});
  }, [user, profile]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredChats = useMemo(() =>
    chats.filter((c) => {
      if (!searchQuery) return true;
      const otherUid = c.participants.find((p) => p !== user?.uid);
      const name = otherUid ? (c.participantNames?.[otherUid] || "") : "";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.context?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }),
    [chats, searchQuery, user]
  );

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedChatId || !user || sending) return;
    setSending(true);
    const myName = profile?.fullName || user.displayName || "User";
    const myAvatar = profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myName)}`;
    try {
      await sendMessage(
        selectedChatId,
        user.uid,
        messageInput.trim(),
        {
          senderName: myName,
          senderAvatar: myAvatar,
          replyTo: replyToMessage ? { id: replyToMessage.id, senderId: replyToMessage.senderId, text: replyToMessage.text } : undefined,
        }
      );
      setMessageInput("");
      setReplyToMessage(null);
    } catch {
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }, [messageInput, selectedChatId, user, profile, sending, replyToMessage, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Side - Chat List */}
      <div className={cn(
        "flex flex-col border-r border-white/5 bg-background/40 backdrop-blur-xl transition-all duration-300 shrink-0",
        selectedChatId ? "hidden md:flex md:w-[400px]" : "w-full md:w-[400px]"
      )}>
        <div className="sticky top-0 z-10 p-4 space-y-4 bg-background/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-white"
              onClick={() => setLocation("/feed")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-white flex-1">Chats</h1>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search messages..."
              className="pl-9 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 w-full overflow-hidden">
          <div className="w-full flex flex-col items-stretch overflow-hidden">
            {loadingChats ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">Loading chats...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-muted-foreground">
                <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs mt-1 opacity-60">Connect with people from the Feed to start chatting</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const uid = chat.participants.find((p) => p !== user?.uid);
                const name = uid ? (chat.participantNames?.[uid] || "Unknown") : "Unknown";
                const avatar = uid ? (chat.participantAvatars?.[uid] || "") : "";
                const unread = uid ? (chat.unreadCounts?.[user?.uid || ""] || 0) : 0;
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      "w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 group relative text-left border-b border-white/5",
                      selectedChatId === chat.id ? "bg-white/10" : "hover:bg-white/5 active:bg-white/10"
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-center overflow-hidden">
                      <div className="flex items-center justify-between mb-1 gap-2 w-full flex-nowrap">
                        <span className={cn("font-semibold text-base truncate min-w-0 flex-1", unread > 0 ? "text-primary" : "text-white")}>
                          {name}
                        </span>
                        <span className={cn("text-[11px] font-medium shrink-0 whitespace-nowrap ml-2", unread > 0 ? "text-primary" : "text-muted-foreground")}>
                          {formatTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 w-full flex-nowrap">
                        <p className={cn("text-[13px] truncate flex-1 min-w-0", unread > 0 ? "text-white font-medium" : "text-muted-foreground")}>
                          {chat.lastMessage || "No messages yet"}
                        </p>
                        {unread > 0 && (
                          <div className="shrink-0 flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-primary rounded-full ml-2">
                            <span className="text-[10px] font-bold text-white leading-none">{unread}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col relative",
        !selectedChatId && "hidden md:flex items-center justify-center bg-background/20"
      )}>
        {selectedChatId && selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-white/5 bg-background/60 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSelectedChatId(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarImage src={otherAvatar} />
                  <AvatarFallback>{otherName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-sm font-bold text-white leading-none">{otherName}</h2>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{otherRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {selectedChat.context && (
                  <Badge variant="outline" className="text-[10px] border-primary/30 bg-primary/5 text-primary hidden sm:flex">
                    {selectedChat.context.type?.toUpperCase()} · {selectedChat.context.title}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("text-muted-foreground hover:text-primary transition-colors", showProfileSidebar && "text-primary bg-primary/10")}
                  onClick={() => setShowProfileSidebar(!showProfileSidebar)}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Message Area */}
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center">
                    <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1 opacity-60">Send a message to start the conversation</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.uid;
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex w-full group/message", isMe ? "justify-end" : "justify-start")}
                    >
                      <div className={cn("flex gap-3 max-w-[85%] md:max-w-[70%] items-end", isMe ? "flex-row-reverse" : "flex-row")}>
                        {!isMe && (
                          <Avatar className="h-8 w-8 mt-auto shrink-0 border border-white/10">
                            <AvatarImage src={otherAvatar} />
                            <AvatarFallback>{otherName[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="space-y-1 flex-1">
                          {msg.replyTo && (
                            <div className={cn("px-3 py-2 rounded-lg mb-1 border-l-2", isMe ? "bg-white/10 border-white/30" : "bg-white/5 border-primary/50")}>
                              <p className="text-[10px] font-medium text-primary/80 mb-0.5">
                                {msg.replyTo.senderId === user?.uid ? "You" : otherName}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{msg.replyTo.text}</p>
                            </div>
                          )}
                          <div className={cn(
                            "p-4 rounded-2xl relative",
                            isMe ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" : "bg-white/5 text-white/90 rounded-tl-none border border-white/5"
                          )}>
                            {(msg.messageType === "connect-request" || msg.text?.toLowerCase().includes("interested in connecting")) && (
                              <div className="mb-3 pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Connection Request</span>
                                </div>
                              </div>
                            )}
                            {msg.messageType === "access-request" && (
                              <div className="mb-3 pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Access Request</span>
                                </div>
                              </div>
                            )}
                            {msg.text && (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            )}
                            {msg.messageType === "access-request" && !isMe && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                {msg.accessGranted ? (
                                  <div className="flex items-center gap-2 text-emerald-400">
                                    <CheckCheck className="w-4 h-4" />
                                    <span className="text-xs font-bold">Access Granted</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      await grantChatAccess(msg.id);
                                      toast({ title: "Access Granted", description: "The user now has access to your post details." });
                                    }}
                                    className="w-full py-2 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                                  >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Grant Access
                                  </button>
                                )}
                              </div>
                            )}
                            <div className={cn("flex items-center gap-1 mt-2", isMe ? "justify-end" : "justify-start")}>
                              <span className="text-[9px] opacity-60 font-medium">{formatTime(msg.timestamp)}</span>
                              {isMe && (
                                <span className="opacity-60">
                                  {msg.status === "read" ? (
                                    <CheckCheck className="w-3 h-3 text-white" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setReplyToMessage(msg)}
                          className="opacity-0 group-hover/message:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-full shrink-0 mt-auto"
                        >
                          <Reply className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Reply Preview */}
            {replyToMessage && (
              <div className="px-4 py-2 border-t border-white/5 bg-background/60 backdrop-blur-md flex items-center gap-3">
                <div className="flex-1 min-w-0 p-2 rounded-lg bg-white/5 border-l-2 border-primary/50">
                  <p className="text-[10px] font-medium text-primary mb-0.5">
                    {replyToMessage.senderId === user?.uid ? "You" : otherName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{replyToMessage.text}</p>
                </div>
                <button onClick={() => setReplyToMessage(null)} className="p-1 hover:bg-white/10 rounded-full shrink-0">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-background/60 backdrop-blur-md">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-white/5 border-white/10 rounded-2xl pr-12 focus:border-primary/30 transition-all"
                    data-testid="input-message"
                  />
                </div>
                <Button
                  size="icon"
                  className="rounded-2xl shrink-0 shadow-lg shadow-primary/20 h-11 w-11"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sending}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <MessageSquare className="w-16 h-16 opacity-20" />
            <div className="text-center">
              <p className="font-medium text-white/60">Select a conversation</p>
              <p className="text-sm opacity-50 mt-1">or connect with people from the Feed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
