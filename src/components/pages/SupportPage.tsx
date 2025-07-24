import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  Paperclip,
  User,
  Calendar,
  Filter
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  availability: string;
  responseTime: string;
  action: string;
}

const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'contact'>('faq');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as SupportTicket['priority']
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // Mock FAQ data
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I request time off?',
      answer: 'To request time off, navigate to the Time Off page and click "New Request". Fill in the required details including dates, type of leave, and reason. Your request will be sent to your manager for approval.',
      category: 'Time Off',
      helpful: 45,
      views: 120
    },
    {
      id: '2',
      question: 'How can I update my profile information?',
      answer: 'Go to your Profile page by clicking on your avatar in the sidebar. Click the "Edit Profile" button to update your personal information, contact details, and social links.',
      category: 'Profile',
      helpful: 38,
      views: 95
    },
    {
      id: '3',
      question: 'Where can I find my pay stubs?',
      answer: 'Pay stubs are available in the Documents section under the "Payroll" category. You can view and download your current and historical pay statements there.',
      category: 'Payroll',
      helpful: 52,
      views: 180
    },
    {
      id: '4',
      question: 'How do I schedule a meeting?',
      answer: 'Use the Calendar page to schedule meetings. Click "New Meeting" and fill in the details including participants, time, and platform. The meeting will be added to everyone\'s calendar.',
      category: 'Calendar',
      helpful: 29,
      views: 75
    },
    {
      id: '5',
      question: 'What benefits am I eligible for?',
      answer: 'Visit the Benefits page to see your complete benefits package including health insurance, retirement plans, and other perks. Each benefit shows your eligibility status and enrollment information.',
      category: 'Benefits',
      helpful: 67,
      views: 200
    },
    {
      id: '6',
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Security and click "Change Password". You\'ll need to enter your current password and then set a new one. For forgotten passwords, contact IT support.',
      category: 'Account',
      helpful: 41,
      views: 110
    }
  ];

  // Mock support tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'ticket-1',
      title: 'Unable to access benefits portal',
      description: 'I\'m getting an error when trying to view my health insurance details.',
      status: 'in-progress',
      priority: 'medium',
      category: 'Benefits',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      assignedTo: 'HR Team'
    },
    {
      id: 'ticket-2',
      title: 'Time off request not showing',
      description: 'I submitted a vacation request last week but it\'s not appearing in my dashboard.',
      status: 'resolved',
      priority: 'low',
      category: 'Time Off',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      assignedTo: 'IT Support'
    }
  ]);

  // Contact methods
  const contactMethods: ContactMethod[] = [
    {
      id: '1',
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageSquare,
      availability: 'Mon-Fri, 9 AM - 6 PM',
      responseTime: 'Usually within 5 minutes',
      action: 'Start Chat'
    },
    {
      id: '2',
      title: 'Phone Support',
      description: 'Speak directly with a support specialist',
      icon: Phone,
      availability: 'Mon-Fri, 8 AM - 8 PM',
      responseTime: 'Immediate',
      action: 'Call Now'
    },
    {
      id: '3',
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      availability: '24/7',
      responseTime: 'Within 24 hours',
      action: 'Send Email'
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Time Off': return 'bg-blue-500';
      case 'Profile': return 'bg-purple-500';
      case 'Payroll': return 'bg-green-500';
      case 'Calendar': return 'bg-amber-500';
      case 'Benefits': return 'bg-pink-500';
      case 'Account': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
  };

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleNewTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      return;
    }

    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'open',
      priority: newTicket.priority,
      category: newTicket.category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ title: '', description: '', category: '', priority: 'medium' });
    setShowNewTicketForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Support Center
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">Get help and find answers to your questions</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{faqs.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">FAQ Articles</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Open Tickets</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{tickets.filter(t => t.status === 'resolved').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Resolved</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">&lt; 5min</div>
                  <div className="text-xs sm:text-sm text-gray-400">Avg Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6 lg:mb-8">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, or common issues..."
              className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-12 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base lg:text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 lg:mb-8 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            {[
              { id: 'faq', label: 'FAQ', icon: FileText },
              { id: 'tickets', label: 'My Tickets', icon: MessageSquare },
              { id: 'contact', label: 'Contact Support', icon: Phone }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{id === 'faq' ? 'FAQ' : id === 'tickets' ? 'Tickets' : 'Contact'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                  selectedCategory === '' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                    selectedCategory === category 
                      ? `${getCategoryColor(category)} text-white shadow-lg` 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/10">
                <h2 className="text-lg sm:text-xl font-bold text-white">Frequently Asked Questions</h2>
              </div>
              
              <div className="divide-y divide-white/10">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                      <HelpCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto opacity-50" />
                    </div>
                    <p className="font-medium mb-2 text-sm sm:text-base">No FAQ articles found</p>
                    <p className="text-xs sm:text-sm">Try adjusting your search or category filter</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="transition-all duration-300">
                      <button
                        onClick={() => handleFAQToggle(faq.id)}
                        className="w-full p-4 sm:p-6 text-left hover:bg-white/5 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2 break-words">
                              {faq.question}
                            </h3>
                            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                              <span className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-white font-semibold shadow-lg ${getCategoryColor(faq.category)}`}>
                                {faq.category}
                              </span>
                              <span className="flex items-center space-x-1 hidden sm:flex">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{faq.helpful} helpful</span>
                              </span>
                              <span className="hidden sm:inline">{faq.views} views</span>
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            {expandedFAQ === faq.id ? (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                            ) : (
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-white/10 bg-white/5">
                          <div className="pt-4">
                            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base break-words">{faq.answer}</p>
                            <div className="flex items-center space-x-4">
                              <span className="text-xs sm:text-sm text-gray-400">Was this helpful?</span>
                              <button className="text-green-400 hover:text-green-300 text-xs sm:text-sm font-medium">
                                Yes
                              </button>
                              <button className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium">
                                No
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6 lg:space-y-8">
            {/* New Ticket Button */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Support Tickets</h2>
              <button
                onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 text-sm sm:text-base"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New Ticket</span>
              </button>
            </div>

            {/* New Ticket Form */}
            {showNewTicketForm && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Create New Support Ticket</h3>
                <form onSubmit={handleNewTicketSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of your issue..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                        <option value="Technical">Technical</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Priority</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Please provide detailed information about your issue..."
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Submit Ticket</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTicketForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tickets List */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/10">
                <h3 className="text-lg sm:text-xl font-bold text-white">Your Support Tickets</h3>
              </div>
              
              <div className="divide-y divide-white/10">
                {tickets.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-gray-400">
                    <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 mx-auto opacity-50" />
                    </div>
                    <p className="font-medium mb-2 text-sm sm:text-base">No support tickets yet</p>
                    <p className="text-xs sm:text-sm">Create your first ticket to get help</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 sm:p-6 hover:bg-white/5 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                            <h4 className="text-base sm:text-lg font-semibold text-white break-words">{ticket.title}</h4>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`} />
                          </div>
                          
                          <p className="text-gray-400 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base break-words">{ticket.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            <span className={`px-2 sm:px-3 py-1 rounded-xl font-semibold border ${getStatusColor(ticket.status)}`}>
                              {capitalizeFirst(ticket.status)}
                            </span>
                            <span className={`px-2 sm:px-3 py-1 rounded-xl text-white font-semibold ${getCategoryColor(ticket.category)}`}>
                              {ticket.category}
                            </span>
                            <span className="text-gray-400">
                              Created {formatDate(ticket.createdAt)}
                            </span>
                            {ticket.assignedTo && (
                              <span className="text-gray-400 flex items-center space-x-1 hidden sm:flex">
                                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Assigned to {ticket.assignedTo}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button className="text-purple-400 hover:text-purple-300 transition-colors">
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6 lg:space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Support</h2>
            
            {/* Contact Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contactMethods.map((method) => (
                <div key={method.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="p-3 sm:p-4 bg-purple-500/20 rounded-2xl w-fit mx-auto mb-4 sm:mb-6 group-hover:bg-purple-500/30 transition-colors">
                      <method.icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">{method.description}</p>
                    
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-400">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{method.availability}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-purple-400 font-medium">
                        {method.responseTime}
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base">
                      {method.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Additional Resources</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-white">Quick Links</h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {[
                      'Employee Handbook',
                      'IT Policies',
                      'Benefits Guide',
                      'Time Off Policies',
                      'Security Guidelines'
                    ].map((link, index) => (
                      <button key={index} className="w-full text-left p-2.5 sm:p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white text-sm sm:text-base">
                        {link}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="text-base sm:text-lg font-semibold text-white">Emergency Contacts</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl">
                      <div className="font-medium text-white text-sm sm:text-base">IT Emergency</div>
                      <div className="text-xs sm:text-sm text-gray-400">+1 (555) 123-4567</div>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl">
                      <div className="font-medium text-white text-sm sm:text-base">HR Emergency</div>
                      <div className="text-xs sm:text-sm text-gray-400">+1 (555) 765-4321</div>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-white/5 rounded-xl">
                      <div className="font-medium text-white text-sm sm:text-base">Security</div>
                      <div className="text-xs sm:text-sm text-gray-400">+1 (555) 999-0000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;