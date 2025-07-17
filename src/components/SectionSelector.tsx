import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Plus,
  Sparkles,
  Grid,
  Navigation,
  Rocket,
  Users,
  Zap,
  Star,
  DollarSign,
  MessageSquare,
  Briefcase,
  Mail,
  Link,
  Target,
  FileText,
  File,
  ChevronRight
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { getAllCategories } from '../data/improvedSectionTemplates';

interface SectionSelectorProps {
  onClose: () => void;
  onSelect: () => void;
  insertPosition?: { index: number; position: 'above' | 'below' } | null;
}

const iconMap: Record<string, any> = {
  Navigation,
  Rocket,
  Users,
  Zap,
  Star,
  DollarSign,
  MessageSquare,
  Briefcase,
  Mail,
  Link,
  Target,
  FileText,
  File,
  Palette: Sparkles,
  UserCheck: Users,
  Code: FileText,
  Smartphone: Rocket,
  TrendingUp: Zap,
  BarChart3: Star,
  Shield: Zap,
  Lock: Zap,
  Grid: Grid
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || File;
};

// Category color schemes
const categoryColors: Record<string, { bg: string; border: string; text: string; icon: string; gradient: string }> = {
  headers: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  heroes: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  about: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  services: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  features: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  pricing: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  testimonials: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    icon: 'text-pink-600',
    gradient: 'from-pink-500 to-pink-600'
  },
  portfolio: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  contact: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    icon: 'text-cyan-600',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  footers: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    icon: 'text-slate-600',
    gradient: 'from-slate-500 to-slate-600'
  },
  cta: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  blog: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    icon: 'text-violet-600',
    gradient: 'from-violet-500 to-violet-600'
  }
};

const SectionSelector: React.FC<SectionSelectorProps> = ({ onClose, onSelect, insertPosition }) => {
  const { addSectionFromTemplate, sectionTemplates } = useProject();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All', count: sectionTemplates.length, icon: 'File' },
    ...getAllCategories(),
  ];

  const filteredSections = sectionTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddSection = (template: typeof sectionTemplates[0]) => {
    addSectionFromTemplate(template.id, undefined, insertPosition);
    onSelect();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Plus className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">
                  {insertPosition
                    ? `Add Section ${insertPosition.position === 'above' ? 'Above' : 'Below'} #${insertPosition.index + 1}`
                    : 'Add Section'
                  }
                </h2>
                <p className="text-base text-gray-600 font-primary">
                  {insertPosition
                    ? `Insert a new section ${insertPosition.position} the current position`
                    : 'Choose from beautiful, pre-built sections'
                  }
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 hover:bg-white/90 rounded-2xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const colors = categoryColors[category.id] || categoryColors.headers;
                const isSelected = selectedCategory === category.id;
                const IconComponent = getIconComponent(category.icon);

                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm ${isSelected
                        ? `${colors.bg} ${colors.text} ${colors.border} border-2 shadow-md`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name} ({category.count})
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-lg font-primary"
              />
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1">
            <div className="p-6">
              {filteredSections.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">No sections found</h3>
                  <p className="text-base text-gray-600 max-w-md mx-auto font-primary">
                    Try adjusting your search terms or browse other categories.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSections.map((template, index) => {
                    const colors = categoryColors[template.category] || categoryColors.headers;
                    const IconComponent = getIconComponent(template.icon);

                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group cursor-pointer bg-white rounded-3xl border-2 hover:shadow-xl transition-all duration-300 ${colors.border} hover:border-opacity-50`}
                        onClick={() => handleAddSection(template)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                          <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                          {/* Category Badge */}
                          <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} font-primary`}>
                            {template.category}
                          </div>

                          {/* Add Button */}
                          <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <Plus className="w-5 h-5 text-gray-700" />
                          </div>

                          {/* Icon */}
                          <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-gray-700" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-2 font-heading">
                            {template.name}
                          </h3>
                          <p className="text-gray-600 text-base line-clamp-2 mb-4 font-primary">{template.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {template.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-primary">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action */}
                          <div className={`flex items-center justify-between p-3 rounded-xl ${colors.bg} group-hover:bg-opacity-80 transition-all`}>
                            <span className={`text-sm font-medium ${colors.text} font-primary`}>
                              Add to website
                            </span>
                            <ChevronRight className={`w-4 h-4 ${colors.icon} group-hover:translate-x-1 transition-transform`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-medium font-primary">
                {filteredSections.length} sections available
              </span>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium font-primary"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SectionSelector;