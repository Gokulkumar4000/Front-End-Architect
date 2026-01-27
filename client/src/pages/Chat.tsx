import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { 
  Search, 
  Send, 
  Info, 
  X, 
  MessageSquare,
  Check,
  CheckCheck,
  Phone,
  Video,
  Plus,
  ArrowLeft,
  Filter,
  ExternalLink,
  Target,
  Zap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
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
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  const selectedChat = useMemo(() => 
    MOCK_CHATS.find(c => c.id === selectedChatId), 
    [selectedChatId]
  );

  const messages = useMemo(() => 
    selectedChatId ? (allMessages[selectedChatId] || []) : [],
    [selectedChatId, allMessages]
  );

  const filteredChats = useMemo(() => 
    MOCK_CHATS.map(chat => {
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
    [searchQuery, allMessages]
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setAllMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    setMessageInput("");

    // Mock auto-reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChatId,
        text: "Thanks for your message! I'll get back to you soon.",
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
        "flex flex-col border-r border-white/5 bg-background/40 backdrop-blur-xl transition-all duration-300",
        selectedChatId ? "hidden md:flex md:w-[350px]" : "w-full md:w-[350px]"
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

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "w-full p-3 flex gap-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  selectedChatId === chat.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-white/5 border border-transparent active-elevate-2"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarImage src={chat.user.avatar} />
                    <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.user.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={cn(
                      "font-bold text-sm truncate transition-colors",
                      chat.unreadCount > 0 ? "text-primary" : "text-white"
                    )}>
                      {chat.user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">{chat.time}</span>
                  </div>
                  {chat.context && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/20 bg-primary/5 text-primary">
                        {chat.context.type === 'idea' && <Zap className="w-2.5 h-2.5 mr-1" />}
                        {chat.context.title}
                      </Badge>
                    </div>
                  )}
                  <p className={cn(
                    "text-xs truncate transition-colors",
                    chat.unreadCount > 0 ? "text-white font-medium" : "text-muted-foreground group-hover:text-white/70"
                  )}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse" />
                  </div>
                )}
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
                      "flex w-full mb-4",
                      msg.senderId === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex gap-3 max-w-[85%] md:max-w-[70%]",
                      msg.senderId === "me" ? "flex-row-reverse" : "flex-row"
                    )}>
                      {msg.senderId !== "me" && (
                        <Avatar className="h-8 w-8 mt-auto shrink-0 border border-white/10">
                          <AvatarImage src={selectedChat.user.avatar} />
                          <AvatarFallback>{selectedChat.user.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="space-y-1">
                        <div className={cn(
                          "p-3.5 rounded-2xl relative group",
                          msg.senderId === "me" 
                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                            : "bg-white/5 text-white/90 rounded-tl-none border border-white/5"
                        )}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <div className={cn(
                            "flex items-center gap-1 mt-1.5",
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
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-background/60 backdrop-blur-md sticky bottom-0 z-20">
              <div className="max-w-4xl mx-auto flex items-end gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white shrink-0 mb-1">
                  <Plus className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative group">
                  <Input 
                    placeholder="Type a message..." 
                    className="bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-2xl min-h-12 py-3 px-4 resize-none pr-12"
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
                      "absolute right-2 bottom-1.5 h-9 w-9 rounded-xl transition-all duration-300",
                      messageInput.trim() ? "bg-primary scale-100 shadow-lg shadow-primary/20" : "bg-white/10 scale-90 pointer-events-none"
                    )}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
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

                {/* Context Info */}
                {selectedChat.context && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shared Context</p>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                          {selectedChat.context.type === 'idea' && <Zap className="w-4 h-4 text-primary" />}
                          {selectedChat.context.type === 'project' && <MessageSquare className="w-4 h-4 text-primary" />}
                          {selectedChat.context.type === 'funding' && <Target className="w-4 h-4 text-primary" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">{selectedChat.context.title}</p>
                          <p className="text-[9px] text-muted-foreground mt-1 capitalize">{selectedChat.context.type}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full text-[10px] h-8 font-bold border-white/10 hover:bg-primary/10 transition-colors">
                        View Details <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

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
