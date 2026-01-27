export const MOCK_POSTS = [
  {
    id: "1",
    type: "idea",
    author: { name: "Alice Visionary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Idea Holder" },
    title: "AI-Powered Sustainable Farming",
    content: "We are developing an revolutionary automated sensor network specifically designed for small-scale urban farmers. Our system uses advanced IoT devices and machine learning algorithms to monitor soil health, predict crop diseases before they manifest, and optimize water usage by up to 60%. This solution empowers local growers to increase yields while significantly reducing their environmental footprint through data-driven precision agriculture techniques that were previously only available to large industrial operations.",
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
    content: "Our team has just reached a major milestone in the DevConnect UI library project. We've successfully integrated a comprehensive set of accessible, high-performance components that will enable non-profit organizations to manage their donor relationships more effectively. Unlike commercial CRM solutions that are often too expensive or complex, our open-source platform focuses on simplicity and core functionality, allowing organizations to devote more of their resources to their primary mission while still benefiting from professional-grade management tools and automated reporting features.",
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
    content: "Mike Money Capital is officially opening applications for our early-stage CleanTech Seed Fund. We are specifically looking for visionary founders who are working on carbon capture, renewable energy storage, and circular economy solutions. Our fund provides not just capital, but also strategic mentorship and access to a global network of industry experts. We believe that the next decade's most successful companies will be those that solve the most pressing environmental challenges of our time, and we are committed to providing the resources necessary to scale these critical innovations.",
    timestamp: "6h ago",
    stats: { likes: 210, comments: 45 },
    domains: ["FinTech", "Sustainability"],
    comments: []
  }
];
