import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  currentIcon: string;
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

// Comprehensive icon list organized by categories
const iconCategories = {
  'Popular': [
    'Zap', 'Star', 'Heart', 'Shield', 'Lock', 'Eye', 'Home', 'User', 'Settings',
    'Phone', 'Mail', 'Globe', 'Code', 'Palette', 'Camera', 'Music', 'Video'
  ],
  'Business': [
    'Briefcase', 'Building', 'TrendingUp', 'BarChart3', 'PieChart', 'Target',
    'Award', 'Trophy', 'Medal', 'Crown', 'Gem', 'DollarSign', 'CreditCard'
  ],
  'Technology': [
    'Smartphone', 'Laptop', 'Monitor', 'Tablet', 'Watch', 'Gamepad2', 'Wifi',
    'Bluetooth', 'Database', 'Server', 'Cloud', 'Code', 'Terminal', 'Cpu'
  ],
  'Communication': [
    'MessageSquare', 'MessageCircle', 'Send', 'Bell', 'Phone', 'Mail',
    'Users', 'UserCheck', 'UserPlus', 'Share', 'Link', 'ExternalLink'
  ],
  'Navigation': [
    'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp',
    'ChevronDown', 'ChevronLeft', 'ChevronRight', 'Menu', 'MoreVertical'
  ],
  'Media': [
    'Play', 'Pause', 'Square', 'SkipForward', 'SkipBack', 'Repeat',
    'Volume2', 'VolumeX', 'Camera', 'Image', 'Video', 'Music', 'Headphones'
  ],
  'Actions': [
    'Plus', 'Minus', 'Check', 'X', 'Edit', 'Trash2', 'Copy', 'Download',
    'Upload', 'Save', 'Search', 'Filter', 'Maximize', 'Minimize'
  ],
  'Weather': [
    'Sun', 'Moon', 'Cloud', 'CloudRain', 'Snowflake', 'Thermometer',
    'Wind', 'Umbrella', 'Rainbow', 'Sunrise', 'Sunset'
  ],
  'Food': [
    'Coffee', 'Pizza', 'Utensils', 'Wine', 'Apple', 'Cherry', 'Cake',
    'IceCream', 'Cookie', 'Sandwich', 'Soup', 'Salad'
  ],
  'Security': [
    'Shield', 'Lock', 'Unlock', 'Key', 'ShieldCheck', 'ShieldAlert',
    'Eye', 'EyeOff', 'Fingerprint', 'Scan', 'AlertTriangle'
  ]
};

const IconSelector: React.FC<IconSelectorProps> = ({ currentIcon, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);

  // Flatten all icons for search
  const allIcons = useMemo(() => {
    const icons = new Set<string>();
    Object.values(iconCategories).forEach(categoryIcons => {
      categoryIcons.forEach(icon => icons.add(icon));
    });
    return Array.from(icons);
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = selectedCategory === 'All' ? allIcons : iconCategories[selectedCategory] || [];

    if (searchTerm) {
      icons = icons.filter(iconName =>
        iconName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return icons;
  }, [searchTerm, selectedCategory, allIcons]);

  // Handle icon selection
  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
    onSelect(iconName);
  };

  // Get icon component safely
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Zap;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Live Preview */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* Live Preview */}
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIcon}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {React.createElement(getIconComponent(selectedIcon), {
                      className: "w-8 h-8 text-white"
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-heading">Choose Icon</h2>
                <p className="text-base text-gray-600 font-primary">
                  Currently selected: <span className="font-semibold text-purple-600">{selectedIcon}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 hover:bg-white/90 rounded-2xl transition-colors group"
            >
              <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 text-lg font-primary placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${selectedCategory === 'All'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                All ({allIcons.length})
              </button>
              {Object.entries(iconCategories).map(([category, icons]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {category} ({icons.length})
                </button>
              ))}
            </div>
          </div>

          {/* Icons Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {filteredIcons.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-heading">No icons found</h3>
                  <p className="text-base text-gray-600 max-w-md mx-auto font-primary">
                    Try adjusting your search terms or browse other categories.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {filteredIcons.map((iconName, index) => {
                    const IconComponent = getIconComponent(iconName);
                    const isSelected = selectedIcon === iconName;

                    return (
                      <motion.button
                        key={iconName}
                        onClick={() => handleIconClick(iconName)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01, duration: 0.2 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-4 rounded-2xl transition-all duration-200 group ${isSelected
                          ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300 scale-110'
                          : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 hover:shadow-md'
                          }`}
                        title={iconName}
                      >
                        <IconComponent className="w-6 h-6 mx-auto transition-transform duration-200" />

                        {/* Selection indicator */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {iconName}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>

                        {/* Ripple effect on click */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 0, opacity: 0 }}
                          whileTap={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            background: isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(147, 51, 234, 0.3)'
                          }}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-medium font-primary">
                {filteredIcons.length} icons available
              </span>
              {searchTerm && (
                <span className="text-purple-600">
                  • Filtered by "{searchTerm}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium font-primary"
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg font-heading"
              >
                Done
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IconSelector;