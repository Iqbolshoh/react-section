import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  Search,
  Plus,
  MessageSquare,
  Video,
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Star,
  Play,
  Book,
  Zap,
  Users,
  Settings,
  CreditCard,
  Globe,
  Smartphone,
  Code,
  Palette,
  Shield,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { optimizedStorage, SupportTicket, FAQItem } from '../utils/optimizedStorage';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'tutorials' | 'contact'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Load data
  const faqItems = optimizedStorage.getFAQ();
  const supportTickets = optimizedStorage.getSupportTickets();

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'question' as 'bug' | 'feature' | 'question' | 'billing',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    userEmail: optimizedStorage.getUser()?.email || '',
  });

  const faqCategories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'editor', name: 'Editor', icon: Edit },
    { id: 'templates', name: 'Templates', icon: Palette },
    { id: 'domains', name: 'Domains', icon: Globe },
    { id: 'export', name: 'Export', icon: Download },
    { id: 'uploads', name: 'File Uploads', icon: Upload },
    { id: 'collaboration', name: 'Team Collaboration', icon: Users },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    { id: 'seo', name: 'SEO', icon: Search },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const tutorials = [
    {
      id: '1',
      title: 'Getting Started with Templates.uz',
      description: 'Learn the basics of creating your first website',
      duration: '5:30',
      thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1',
      category: 'getting-started',
      views: 1250,
    },
    {
      id: '2',
      title: 'Advanced Editor Features',
      description: 'Master the drag-and-drop editor with pro tips',
      duration: '8:45',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1',
      category: 'editor',
      views: 890,
    },
    {
      id: '3',
      title: 'Customizing Themes and Colors',
      description: 'Create beautiful designs with our theme system',
      duration: '6:20',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1',
      category: 'design',
      views: 675,
    },
    {
      id: '4',
      title: 'Publishing and Domain Setup',
      description: 'Go live with your website and custom domain',
      duration: '4:15',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1',
      category: 'publishing',
      views: 1100,
    },
  ];

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'> = {
      subject: ticketForm.subject,
      description: ticketForm.description,
      category: ticketForm.category,
      priority: ticketForm.priority,
      userEmail: ticketForm.userEmail,
    };

    optimizedStorage.saveSupportTicket(ticket as SupportTicket);
    
    setShowTicketForm(false);
    setTicketForm({
      subject: '',
      description: '',
      category: 'question',
      priority: 'medium',
      userEmail: optimizedStorage.getUser()?.email || '',
    });

    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
  };

  const handleFAQHelpful = (faqId: string, helpful: boolean) => {
    // In a real app, this would update the FAQ item
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-secondary-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900 font-heading">Help Center</h1>
                  <p className="text-sm text-secondary-600 font-primary">Get help and support</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTicketForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4 font-heading">How can we help you?</h2>
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-secondary-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-soft text-lg font-primary"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-secondary-100 rounded-xl p-1 mb-8">
          {[
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
            { id: 'tutorials', label: 'Video Tutorials', icon: Video },
            { id: 'contact', label: 'Contact Us', icon: Mail },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-heading">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {faqCategories.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all text-left ${
                      selectedCategory === id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'hover:bg-secondary-50 text-secondary-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium font-primary text-sm">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQ.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-soft border border-secondary-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 font-heading">{faq.question}</h3>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-secondary-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-secondary-600" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-secondary-200"
                      >
                        <div className="p-6">
                          <p className="text-secondary-700 leading-relaxed mb-4 font-primary">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-secondary-500 font-primary">Was this helpful?</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleFAQHelpful(faq.id, true)}
                                  className="flex items-center gap-1 px-3 py-1 text-sm text-success-600 hover:bg-success-50 rounded-lg transition-colors font-primary"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  Yes
                                </button>
                                <button
                                  onClick={() => handleFAQHelpful(faq.id, false)}
                                  className="flex items-center gap-1 px-3 py-1 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors font-primary"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  No
                                </button>
                              </div>
                            </div>
                            <div className="text-sm text-secondary-500 font-primary">
                              {faq.views} views • {faq.helpful} helpful
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {filteredFAQ.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">No results found</h3>
                <p className="text-secondary-600 font-primary">Try adjusting your search terms or browse different categories.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-secondary-900 font-heading">Your Support Tickets</h2>
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                  >
                    <Plus className="w-4 h-4" />
                    New Ticket
                  </button>
                </div>
              </div>

              <div className="divide-y divide-secondary-200">
                {supportTickets.length > 0 ? (
                  supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-6 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-secondary-900 font-primary">{ticket.subject}</h3>
                          <p className="text-sm text-secondary-600 font-primary">#{ticket.id}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'open' ? 'bg-warning-100 text-warning-700' :
                          ticket.status === 'in-progress' ? 'bg-primary-100 text-primary-700' :
                          ticket.status === 'resolved' ? 'bg-success-100 text-success-700' :
                          'bg-secondary-100 text-secondary-700'
                        }`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </div>
                      </div>
                      <p className="text-secondary-700 mb-3 font-primary">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-secondary-500">
                        <span className="font-primary">Category: {ticket.category}</span>
                        <span className="font-primary">Priority: {ticket.priority}</span>
                        <span className="font-primary">Created: {ticket.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">No support tickets</h3>
                    <p className="text-secondary-600 mb-4 font-primary">You haven't submitted any support tickets yet.</p>
                    <button
                      onClick={() => setShowTicketForm(true)}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                    >
                      Submit Your First Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-soft border border-secondary-200 overflow-hidden hover:shadow-medium transition-all cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-sm rounded font-primary">
                      {tutorial.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">{tutorial.title}</h3>
                    <p className="text-secondary-600 mb-4 font-primary">{tutorial.description}</p>
                    <div className="flex items-center justify-between text-sm text-secondary-500">
                      <span className="font-primary">{tutorial.views} views</span>
                      <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded font-primary">
                        {tutorial.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 font-heading">Email Support</h3>
                    <p className="text-sm text-secondary-600 font-primary">Get help via email</p>
                  </div>
                </div>
                <p className="text-secondary-700 mb-4 font-primary">
                  Send us an email and we'll respond within 24 hours during business days.
                </p>
                <a
                  href="mailto:support@templates.uz"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                >
                  <Mail className="w-4 h-4" />
                  support@templates.uz
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 font-heading">Telegram Bot</h3>
                    <p className="text-sm text-secondary-600 font-primary">Instant chat support</p>
                  </div>
                </div>
                <p className="text-secondary-700 mb-4 font-primary">
                  Chat with our support bot on Telegram for quick answers and assistance.
                </p>
                <a
                  href="https://t.me/templates_uz_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors font-medium font-primary"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open Telegram Bot
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 font-heading">Response Times</h3>
                    <p className="text-sm text-secondary-600 font-primary">Our commitment to you</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600 font-primary">Email Support:</span>
                    <span className="font-medium text-secondary-900 font-primary">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600 font-primary">Telegram Bot:</span>
                    <span className="font-medium text-secondary-900 font-primary">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600 font-primary">Critical Issues:</span>
                    <span className="font-medium text-secondary-900 font-primary">4 hours</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                    <Book className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 font-heading">Documentation</h3>
                    <p className="text-sm text-secondary-600 font-primary">Comprehensive guides</p>
                  </div>
                </div>
                <p className="text-secondary-700 mb-4 font-primary">
                  Browse our detailed documentation for step-by-step guides and tutorials.
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-warning-600 text-white rounded-xl hover:bg-warning-700 transition-colors font-medium font-primary">
                  <Book className="w-4 h-4" />
                  View Documentation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Support Ticket Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-secondary-900 font-heading">Submit Support Ticket</h3>
              <button
                onClick={() => setShowTicketForm(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Subject *</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  >
                    <option value="question">General Question</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="billing">Billing Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Email</label>
                <input
                  type="email"
                  value={ticketForm.userEmail}
                  onChange={(e) => setTicketForm({ ...ticketForm, userEmail: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Description *</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTicketForm(false)}
                className="flex-1 px-4 py-3 text-secondary-700 bg-secondary-100 rounded-xl hover:bg-secondary-200 transition-colors font-medium font-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTicket}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                Submit Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Support;