export const MOCK_POSTS = [
  {
    id: "1",
    type: "idea",
    author: { name: "Alice Visionary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Idea Holder" },
    title: "AI-Powered Sustainable Farming",
    content: "We are developing an revolutionary automated sensor network specifically designed for small-scale urban farmers...",
    timestamp: "2h ago",
    stats: { likes: 124, comments: 2 },
    domains: ["AI/ML", "Agriculture"],
    comments: [
      {
        id: "c1",
        author: { name: "Bob Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", role: "Developer" },
        content: "This sounds amazing! What kind of sensors are you planning to use for soil moisture?",
        timestamp: "1h ago",
        likes: 5,
        replies: []
      }
    ]
  },
  {
    id: "2",
    type: "project",
    author: { name: "Bob Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", role: "Developer" },
    title: "Open Source CRM for Non-Profits",
    content: "Our team has just reached a major milestone in the DevConnect UI library project...",
    timestamp: "4h ago",
    stats: { likes: 85, comments: 0 },
    domains: ["Web3", "Open Source"],
    comments: []
  },
  {
    id: "3",
    type: "fund",
    author: { name: "Charlie Capital", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", role: "Investor" },
    title: "Seed Fund for GreenTech",
    content: "Mike Money Capital is officially opening applications for our early-stage CleanTech Seed Fund...",
    timestamp: "6h ago",
    stats: { likes: 210, comments: 45 },
    domains: ["FinTech", "Sustainability"],
    comments: []
  }
];
