import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Eye,
  Heart,
  Crown,
  Zap,
  Users,
  Briefcase,
  ShoppingBag,
  Camera,
  Music,
  Utensils,
  GraduationCap,
  Car,
  Home,
  Gamepad2,
  User,
  Building,
  ExternalLink,
  Play,
  Check,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Palette,
  Layout,
  Code,
  Smartphone,
  Globe,
  Shield,
  Target,
} from 'lucide-react';
import { optimizedStorage, TemplateGalleryItem } from '../utils/optimizedStorage';
import { useProject } from '../contexts/ProjectContext';

const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateGalleryItem | null>(null);

  // Load templates
  const allTemplates = optimizedStorage.getTemplateGallery();

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid, count: allTemplates.length },
    { id: 'business', name: 'Business', icon: Building, count: allTemplates.filter(t => t.category === 'business').length },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, count: allTemplates.filter(t => t.category === 'portfolio').length },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag, count: allTemplates.filter(t => t.category === 'ecommerce').length },
    { id: 'personal', name: 'Personal', icon: User, count: allTemplates.filter(t => t.category === 'personal').length },
    { id: 'photography', name: 'Photography', icon: Camera, count: allTemplates.filter(t => t.category === 'photography').length },
    { id: 'music', name: 'Music', icon: Music, count: allTemplates.filter(t => t.category === 'music').length },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils, count: allTemplates.filter(t => t.category === 'restaurant').length },
    { id: 'education', name: 'Education', icon: GraduationCap, count: allTemplates.filter(t => t.category === 'education').length },
    { id: 'automotive', name: 'Automotive', icon: Car, count: allTemplates.filter(t => t.category === 'automotive').length },
    { id: 'realestate', name: 'Real Estate', icon: Home, count: allTemplates.filter(t => t.category === 'realestate').length },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, count: allTemplates.filter(t => t.category === 'gaming').length },
  ];

  // Filter and sort templates
  const filteredTemplates = optimizedStorage.searchTemplates(
    searchTerm,
    selectedCategory === 'all' ? undefined : selectedCategory
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.downloads - a.downloads;
    }
  });

  const handleUseTemplate = (template: TemplateGalleryItem) => {
    // Create a new project based on the template
    const project = createProject(
      `${template.name} Website`,
      template.description,
      `${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      template.category
    );

    // Navigate to editor
    navigate(`/editor/${project.websiteUrl}`);
  };

  const handlePreviewTemplate = (template: TemplateGalleryItem) => {
    setSelectedTemplate(template);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-warning-500 text-warning-500' : 'text-secondary-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900 font-heading">Template Gallery</h1>
                  <p className="text-sm text-secondary-600 font-primary">{allTemplates.length} professional templates</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-colors font-medium font-primary"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search templates by name, category, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-soft font-primary"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-soft font-primary"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            {categories.map(({ id, name, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${
                  selectedCategory === id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-primary">{name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === id
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="mt-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3 font-heading">No templates found</h3>
              <p className="text-secondary-600 max-w-md mx-auto font-primary">
                Try adjusting your search terms or browse different categories to find the perfect template.
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-soft border border-secondary-200 overflow-hidden hover:shadow-medium transition-all group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Template Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'
                  }`}>
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <button
                          onClick={() => handlePreviewTemplate(template)}
                          className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Eye className="w-5 h-5 text-secondary-700" />
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Premium Badge */}
                    {template.isPremium && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-warning-500 text-white rounded-full text-xs font-semibold">
                        <Crown className="w-3 h-3" />
                        Pro
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 fill-warning-500 text-warning-500" />
                      {template.rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors font-heading">
                        {template.name}
                      </h3>
                      <button className="p-1 hover:bg-secondary-100 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 text-secondary-400 hover:text-error-500" />
                      </button>
                    </div>

                    <p className="text-secondary-600 text-sm mb-4 line-clamp-2 font-primary">
                      {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs font-medium font-primary"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs font-medium font-primary">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span className="font-primary">{template.downloads}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getRatingStars(template.rating)}
                        </div>
                      </div>
                      <span className="text-xs text-secondary-400 font-primary">
                        {template.sections.length} sections
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreviewTemplate(template)}
                        className="flex-1 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-colors font-medium font-primary"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900 font-heading">{selectedTemplate.name}</h3>
                  <p className="text-secondary-600 font-primary">{selectedTemplate.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-3 font-heading">Template Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-primary">Category:</span>
                      <span className="font-medium text-secondary-900 font-primary">{selectedTemplate.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-primary">Sections:</span>
                      <span className="font-medium text-secondary-900 font-primary">{selectedTemplate.sections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-primary">Downloads:</span>
                      <span className="font-medium text-secondary-900 font-primary">{selectedTemplate.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 font-primary">Rating:</span>
                      <div className="flex items-center gap-1">
                        {getRatingStars(selectedTemplate.rating)}
                        <span className="font-medium text-secondary-900 font-primary ml-1">
                          {selectedTemplate.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-secondary-900 mb-3 mt-6 font-heading">Included Sections</h4>
                  <div className="space-y-2">
                    {selectedTemplate.sections.map((sectionId) => (
                      <div key={sectionId} className="flex items-center gap-2 p-2 bg-secondary-50 rounded-lg">
                        <Layout className="w-4 h-4 text-secondary-600" />
                        <span className="text-sm text-secondary-700 font-primary">{sectionId}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-secondary-900 mb-3 font-heading">Tags</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium font-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
                    <h4 className="font-semibold text-secondary-900 mb-3 font-heading">Ready to get started?</h4>
                    <p className="text-secondary-600 mb-4 font-primary">
                      Use this template to create your website in minutes. All sections are fully customizable.
                    </p>
                    <button
                      onClick={() => {
                        handleUseTemplate(selectedTemplate);
                        setSelectedTemplate(null);
                      }}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold font-heading"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;