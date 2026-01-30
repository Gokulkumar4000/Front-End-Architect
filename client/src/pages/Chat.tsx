import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { 
  Search, 
  Send, 
  Info, 
  X, 
  MessageSquare,
  Check,
  CheckCheck,
  Plus,
  ArrowLeft,
  Filter,
  ExternalLink,
  Target,
  Zap,
  Image as ImageIcon,
  FileText,
  Reply
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

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  image?: string;
  replyTo?: {
    id: string;
    senderId: string;
    text: string;
  };
}

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
    status: 'online' | 'offline';
    bio: string;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
  context?: {
    type: 'idea' | 'project' | 'funding';
    title: string;
  };
}

const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    user: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      role: "CTO / Engineering",
      status: "online",
      bio: "Ex-Google engineer, distributed systems expert."
    },
    lastMessage: "I've reviewed the smart farming proposal. Looks promising!",
    time: "10:42 AM",
    unreadCount: 2,
    context: { type: "idea", title: "Smart Farming Idea" }
  },
  {
    id: "2",
    user: {
      name: "Marcus Miller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      role: "Head of Operations",
      status: "offline",
      bio: "Specialist in supply chain transparency & logistics."
    },
    lastMessage: "Let's sync up later today.",
    time: "Yesterday",
    unreadCount: 0,
    context: { type: "project", title: "Logistics Hub" }
  },
  {
    id: "3",
    user: {
      name: "Elena Vision",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      role: "Investor",
      status: "online",
      bio: "Tech visionary focusing on climate-tech seed rounds."
    },
    lastMessage: "The funding roadmap is clear. Send over the docs.",
    time: "Monday",
    unreadCount: 0,
    context: { type: "funding", title: "Eco-Tech Seed Round" }
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "1", senderId: "1", text: "Hey! Just saw your smart farming proposal.", timestamp: "10:30 AM", status: "read" },
    { id: "2", senderId: "me", text: "Hi Sarah! Glad you're interested. What did you think?", timestamp: "10:35 AM", status: "read" },
    { id: "3", senderId: "1", text: "I've reviewed the smart farming proposal. Looks promising!", timestamp: "10:42 AM", status: "delivered" }
  ]
};

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<{file: File, preview: string, type: 'image' | 'file'}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChat = useMemo(() => 
    chats.find(c => c.id === selectedChatId), 
    [selectedChatId, chats]
  );

  const filteredChats = useMemo(() => 
    chats.map(chat => {
      const chatMessages = allMessages[chat.id] || [];
      const lastMsg = chatMessages[chatMessages.length - 1];
      return {
        ...chat,
        lastMessage: lastMsg ? lastMsg.text : chat.lastMessage,
        time: lastMsg ? lastMsg.timestamp : chat.time
      };
    }).filter(c => 
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.context?.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery, allMessages, chats]
  );

  const messages = useMemo(() => 
    selectedChatId ? (allMessages[selectedChatId] || []) : [],
    [selectedChatId, allMessages]
  );

  useEffect(() => {
    const pendingRequest = localStorage.getItem('pendingConnectRequest');
    if (pendingRequest) {
      const data = JSON.parse(pendingRequest);
      localStorage.removeItem('pendingConnectRequest');
      
      const newChatId = `connect-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        user: {
          name: data.userName,
          avatar: data.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.userName}`,
          role: data.userRole || "Member",
          status: "online",
          bio: ""
        },
        lastMessage: "",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 0,
        context: data.postType ? { 
          type: data.postType as 'idea' | 'project' | 'funding', 
          title: data.postTitle 
        } : undefined
      };
      
      setChats(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      
      const connectMessage = `Hi ${data.userName}! I'm interested in connecting with you regarding your ${data.postType || 'post'}: "${data.postTitle}".\n\nI'd love to discuss potential collaboration opportunities. Looking forward to hearing from you!`;
      setMessageInput(connectMessage);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setPendingAttachments(prev => [...prev, {
          file,
          preview,
          type: isImage ? 'image' : 'file'
        }]);
      };
      
      if (isImage) {
        reader.readAsDataURL(file);
      } else {
        // For non-images, we just use the name as preview
        setPendingAttachments(prev => [...prev, {
          file,
          preview: file.name,
          type: 'file'
        }]);
      }
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if ((!messageInput.trim() && pendingAttachments.length === 0) || !selectedChatId) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // If we have attachments, send them as separate messages or combined
    // In this mock, we'll send them as individual messages for better UI
    const newMessages: Message[] = [];

    // Add attachments as messages
    pendingAttachments.forEach((attachment, idx) => {
      newMessages.push({
        id: `attach-${Date.now()}-${idx}`,
        senderId: "me",
        text: attachment.type === 'image' ? "" : `Attached file: ${attachment.file.name}`,
        image: attachment.type === 'image' ? attachment.preview : undefined,
        timestamp,
        status: 'sent',
        replyTo: idx === 0 && replyToMessage ? {
          id: replyToMessage.id,
          senderId: replyToMessage.senderId,
          text: replyToMessage.text
        } : undefined
      });
    });

    // Add text message if it exists and wasn't the only thing
    if (messageInput.trim()) {
      newMessages.push({
        id: `text-${Date.now()}`,
        senderId: "me",
        text: messageInput.trim(),
        timestamp,
        status: 'sent',
        replyTo: pendingAttachments.length === 0 && replyToMessage ? {
          id: replyToMessage.id,
          senderId: replyToMessage.senderId,
          text: replyToMessage.text
        } : undefined
      });
    }

    setAllMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), ...newMessages]
    }));
    
    setMessageInput("");
    setPendingAttachments([]);
    setReplyToMessage(null);

    // Mock auto-reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: `reply-${Date.now()}`,
        senderId: selectedChatId,
        text: "Thanks for the files! I'll take a look right away.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };
      setAllMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), replyMessage]
      }));
    }, 1500);
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
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <Filter className="w-4 h-4" />
            </Button>
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

        <ScrollArea className="flex-1 w-full overflow-hidden no-default-table">
          <div className="w-full flex flex-col items-stretch overflow-hidden">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 group relative text-left border-b border-white/5",
                  "flex-row flex-nowrap", // Force flex row
                  selectedChatId === chat.id 
                    ? "bg-white/10" 
                    : "hover:bg-white/5 active:bg-white/10"
                )}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Avatar className="h-12 w-12 border border-white/10 shrink-0">
                    <AvatarImage src={chat.user.avatar} />
                    <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.user.status === "online" && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background z-10" />
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1 flex flex-col justify-center overflow-hidden">
                  <div className="flex items-center justify-between mb-1 gap-2 w-full overflow-hidden flex-nowrap">
                    <span className={cn(
                      "font-semibold text-base truncate transition-colors min-w-0 flex-1",
                      chat.unreadCount > 0 ? "text-primary" : "text-white"
                    )}>
                      {chat.user.name}
                    </span>
                    <span className={cn(
                      "text-[11px] font-medium shrink-0 whitespace-nowrap ml-2",
                      chat.unreadCount > 0 ? "text-primary" : "text-muted-foreground"
                    )}>{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full overflow-hidden flex-nowrap">
                    <p className={cn(
                      "text-[13px] truncate transition-colors flex-1 min-w-0",
                      chat.unreadCount > 0 ? "text-white font-medium" : "text-muted-foreground"
                    )}>
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <div className="shrink-0 flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-primary rounded-full ml-2">
                        <span className="text-[10px] font-bold text-white leading-none">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2" 
                  onClick={() => setSelectedChatId(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative cursor-pointer" onClick={() => setShowProfileSidebar(true)}>
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={selectedChat.user.avatar} />
                    <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {selectedChat.user.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="cursor-pointer" onClick={() => setShowProfileSidebar(true)}>
                  <h2 className="text-sm font-bold text-white leading-none">{selectedChat.user.name}</h2>
                  <p className="text-[10px] text-muted-foreground mt-1 capitalize font-medium">{selectedChat.user.status}</p>
                </div>
              </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "text-muted-foreground hover:text-primary transition-colors",
                      showProfileSidebar && "text-primary bg-primary/10"
                    )}
                    onClick={() => setShowProfileSidebar(!showProfileSidebar)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
            </div>

            {/* Message Area */}
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Date Separator */}
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Today</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "flex w-full mb-4 group/message",
                      msg.senderId === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex gap-3 max-w-[85%] md:max-w-[70%] items-end",
                      msg.senderId === "me" ? "flex-row-reverse" : "flex-row"
                    )}>
                      {msg.senderId !== "me" && (
                        <Avatar className="h-8 w-8 mt-auto shrink-0 border border-white/10">
                          <AvatarImage src={selectedChat.user.avatar} />
                          <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="space-y-1 flex-1">
                        {msg.replyTo && (
                          <div className={cn(
                            "px-3 py-2 rounded-lg mb-1 border-l-2",
                            msg.senderId === "me" 
                              ? "bg-white/10 border-white/30" 
                              : "bg-white/5 border-primary/50"
                          )}>
                            <p className="text-[10px] font-medium text-primary/80 mb-0.5">
                              {msg.replyTo.senderId === "me" ? "You" : selectedChat.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{msg.replyTo.text}</p>
                          </div>
                        )}
                        <div className={cn(
                          "p-0 rounded-2xl relative group overflow-hidden transition-all duration-500",
                          msg.senderId === "me" 
                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                            : "bg-white/5 text-white/90 rounded-tl-none border border-white/5",
                          msg.text?.toLowerCase().includes("interested in connecting") && "border-none shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                        )}>
                          {msg.text?.toLowerCase().includes("interested in connecting") && (
                            <div className="absolute inset-[-500%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] z-0" />
                          )}
                          <div className={cn(
                            "relative z-20 h-full w-full p-4",
                            msg.text?.toLowerCase().includes("interested in connecting") && "bg-[#020617]/95 backdrop-blur-3xl m-[1.5px] rounded-[calc(1rem-1.5px)] w-[calc(100%-3px)]"
                          )}>
                            {msg.text?.toLowerCase().includes("interested in connecting") && (
                              <div className="mb-4 space-y-2 border-b border-white/10 pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Connection Request</span>
                                  </div>
                                  <Badge variant="outline" className="text-[9px] h-4 border-primary/40 bg-primary/5 text-primary font-bold">
                                    {selectedChat.context?.type?.toUpperCase() || "PROJECT"}
                                  </Badge>
                                </div>
                                <h4 className="text-base font-black text-white leading-tight tracking-tight">
                                  {msg.text.match(/"([^"]+)"/)?.[1] || selectedChat.context?.title || "Platform Collaboration"}
                                </h4>
                              </div>
                            )}
                            
                            {msg.image && (
                              <div className="mb-2 rounded-lg overflow-hidden border border-white/10 relative z-20 -mx-4 -mt-4">
                                <img src={msg.image} alt="Sent" className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity" />
                              </div>
                            )}
                            
                            {msg.text && (
                              <div className={cn(
                                "relative z-20",
                                msg.text.toLowerCase().includes("interested in connecting") && "bg-white/[0.03] p-3 rounded-xl border border-white/5"
                              )}>
                                <p className={cn(
                                  "text-sm leading-relaxed whitespace-pre-wrap",
                                  msg.text.toLowerCase().includes("interested in connecting") && "text-white/70 font-medium italic italic-shadow"
                                )}>
                                  {msg.text}
                                </p>
                              </div>
                            )}
                            
                            <div className={cn(
                              "flex items-center gap-1 mt-3 relative z-20",
                              msg.senderId === "me" ? "justify-end" : "justify-start"
                            )}>
                              <span className="text-[9px] opacity-60 font-medium">{msg.timestamp}</span>
                              {msg.senderId === "me" && (
                                <span className="opacity-60">
                                  {msg.status === 'read' ? (
                                    <CheckCheck className="w-3 h-3 text-white" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setReplyToMessage(msg)}
                        className={cn(
                          "p-1.5 rounded-full opacity-0 group-hover/message:opacity-100 transition-opacity hover:bg-white/10",
                          msg.senderId === "me" ? "order-first" : "order-last"
                        )}
                        data-testid={`button-reply-${msg.id}`}
                      >
                        <Reply className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-white/5 bg-background/60 backdrop-blur-md sticky bottom-0 z-20">
              {pendingAttachments.length > 0 && (
                <div className="absolute inset-x-0 bottom-full bg-[#020617] border-t border-white/10 p-6 animate-in fade-in slide-in-from-bottom-5 duration-500 z-50 h-[calc(100vh-140px)] flex flex-col items-center justify-center">
                  <div className="max-w-4xl w-full flex flex-col items-center gap-6">
                    {/* Primary Preview Section - LARGE */}
                    <div className="w-full flex-1 flex items-center justify-center relative min-h-[300px] max-h-[60vh]">
                      {pendingAttachments[0].type === 'image' ? (
                        <div className="relative group/main">
                          <img 
                            src={pendingAttachments[0].preview} 
                            className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
                            alt="Main Preview" 
                          />
                          <button 
                            onClick={() => removeAttachment(0)}
                            className="absolute -top-3 -right-3 w-10 h-10 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all shadow-xl border border-white/10"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full max-w-sm bg-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center border border-white/10 shadow-2xl">
                          <FileText className="w-16 h-16 text-blue-400 mb-4" />
                          <span className="text-base font-bold text-white truncate w-full mb-1">{pendingAttachments[0].file.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Document</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Mini Previews Carousel - WhatsApp Style (Small & Centered) */}
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto max-w-full no-scrollbar scroll-smooth">
                        {pendingAttachments.map((attachment, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (idx !== 0) {
                                const newAttachments = [...pendingAttachments];
                                const item = newAttachments.splice(idx, 1)[0];
                                newAttachments.unshift(item);
                                setPendingAttachments(newAttachments);
                              }
                            }}
                            className={cn(
                              "relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 active:scale-95",
                              idx === 0 ? "border-primary shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "border-transparent opacity-50 hover:opacity-100"
                            )}
                          >
                            {attachment.type === 'image' ? (
                              <img src={attachment.preview} className="w-full h-full object-cover" alt="Thumb" />
                            ) : (
                              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-400" />
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-white/20 items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all group/add"
                        >
                          <Plus className="w-5 h-5 text-muted-foreground group-hover/add:text-primary transition-colors" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between w-full px-4 max-w-2xl">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-white font-black uppercase tracking-[0.2em] text-[10px] h-8 px-5 rounded-full hover:bg-white/5"
                          onClick={() => setPendingAttachments([])}
                        >
                          Cancel
                        </Button>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
                          {pendingAttachments.length} staged
                        </span>
                        <div className="w-20" /> {/* Balance */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {replyToMessage && (
                <div className="px-4 pt-3 pb-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-t-xl px-3 py-2">
                      <Reply className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0 border-l-2 border-primary pl-2">
                        <p className="text-xs font-medium text-primary">
                          Replying to {replyToMessage.senderId === "me" ? "yourself" : selectedChat?.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{replyToMessage.text}</p>
                      </div>
                      <button 
                        onClick={() => setReplyToMessage(null)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                        data-testid="button-cancel-reply"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className={cn("px-4 pb-4", replyToMessage ? "pt-0" : "pt-4")}>
                <div className="max-w-4xl mx-auto">
                  <div className={cn(
                    "flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1.5 focus-within:border-primary/50 transition-all",
                    replyToMessage ? "rounded-b-2xl rounded-t-none border-t-0" : "rounded-2xl"
                  )}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-white shrink-0"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="top" className="w-48 bg-background/95 backdrop-blur-xl border-white/10 mb-2">
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer focus:bg-white/5"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.accept = "image/*";
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">Photos & Videos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer focus:bg-white/5"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.accept = ".pdf,.doc,.docx,.txt";
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium">Document</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-2 px-1 h-auto"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />

                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    className={cn(
                      "h-9 w-9 rounded-xl transition-all duration-300",
                      (messageInput.trim() || pendingAttachments.length > 0) ? "bg-primary scale-100 shadow-lg shadow-primary/20" : "bg-white/10 scale-90 pointer-events-none opacity-50"
                    )}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold text-white">Select a conversation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose a chat from the left side to start messaging with visionaries, builders, or investors.
              </p>
            </div>
          </div>
        )}

        {/* Profile Sidebar */}
        {selectedChatId && selectedChat && (
          <div className={cn(
            "absolute inset-y-0 right-0 w-full md:w-80 bg-background/40 backdrop-blur-2xl border-l border-white/5 z-40 transition-transform duration-300 ease-in-out shadow-2xl flex flex-col",
            showProfileSidebar ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/60 shrink-0">
              <h3 className="font-bold text-white text-sm">Contact Info</h3>
              <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => setShowProfileSidebar(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Avatar & Basic Info */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32 border-2 border-primary/20 shadow-2xl shadow-primary/10">
                    <AvatarImage src={selectedChat.user.avatar} />
                    <AvatarFallback className="text-4xl">{selectedChat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white">{selectedChat.user.name}</h4>
                    <p className="text-sm text-primary font-medium">{selectedChat.user.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic px-4">
                    "{selectedChat.user.bio}"
                  </p>
                </div>

                {/* Shared Activity */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shared Activity</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-lg font-bold text-white">12</p>
                      <p className="text-[9px] text-muted-foreground uppercase">Connections</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-lg font-bold text-white">3</p>
                      <p className="text-[9px] text-muted-foreground uppercase">Shared Groups</p>
                    </div>
                  </div>
                </div>

                {/* Private Notes */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Private Notes</p>
                  <div className="relative">
                    <textarea 
                      className="w-full h-24 bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Add a private note about this contact..."
                    />
                    <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 opacity-50 hover:opacity-100">
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full text-xs font-bold border-white/10">Mute Notifications</Button>
                  <Button variant="outline" className="w-full text-xs font-bold border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-500">Block Contact</Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
