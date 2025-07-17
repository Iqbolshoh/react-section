import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type, Sparkles, Check, Eye, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeCustomizerProps {
  onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
  const { currentTheme, availableThemes, availableFonts, updateTheme, updateFonts } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts'>('colors');

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'fonts', label: 'Fonts', icon: Type },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Theme Customizer</h2>
                <p className="text-sm text-gray-600">Customize your website's appearance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'colors' | 'fonts')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'colors' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Color Themes</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>Preview changes instantly</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableThemes.map((theme) => (
                      <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${currentTheme.id === theme.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => updateTheme(theme.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentTheme.id === theme.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}

                        <h4 className="font-semibold text-gray-900 mb-3">{theme.name}</h4>

                        {/* Color Preview */}
                        <div className="flex gap-2 mb-4">
                          <div
                            className="w-8 h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: theme.colors.primary }}
                            title="Primary"
                          ></div>
                          <div
                            className="w-8 h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: theme.colors.secondary }}
                            title="Secondary"
                          ></div>
                          <div
                            className="w-8 h-8 rounded-lg shadow-sm"
                            style={{ backgroundColor: theme.colors.accent }}
                            title="Accent"
                          ></div>
                          <div
                            className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                            style={{ backgroundColor: theme.colors.surface }}
                            title="Surface"
                          ></div>
                        </div>

                        {/* Sample Text */}
                        <div className="space-y-1">
                          <div
                            className="h-3 rounded"
                            style={{ backgroundColor: theme.colors.primary, width: '80%' }}
                          ></div>
                          <div
                            className="h-2 rounded"
                            style={{ backgroundColor: theme.colors.textSecondary, width: '60%' }}
                          ></div>
                          <div
                            className="h-2 rounded"
                            style={{ backgroundColor: theme.colors.textSecondary, width: '40%' }}
                          ></div>
                        </div>

                        {/* Color Labels */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Primary
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Secondary
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            Accent
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'fonts' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Font Collections</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4" />
                      <span>Google Fonts included</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {availableFonts.map((fontCollection) => (
                      <motion.div
                        key={fontCollection.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-lg ${currentTheme.fonts.primary === fontCollection.fonts.primary
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => updateFonts(fontCollection.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {currentTheme.fonts.primary === fontCollection.fonts.primary && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">{fontCollection.name}</h4>
                          <p className="text-sm text-gray-600">{fontCollection.description}</p>
                        </div>

                        {/* Font Preview */}
                        <div className="space-y-3">
                          <div style={{ fontFamily: fontCollection.fonts.primary }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">PRIMARY</span>
                              <span className="text-xs text-gray-500">{fontCollection.fonts.primary}</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900">The quick brown fox</div>
                          </div>

                          <div style={{ fontFamily: fontCollection.fonts.secondary }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">SECONDARY</span>
                              <span className="text-xs text-gray-500">{fontCollection.fonts.secondary}</span>
                            </div>
                            <div className="text-base text-gray-700">jumps over the lazy dog</div>
                          </div>

                          <div style={{ fontFamily: fontCollection.fonts.accent }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">ACCENT</span>
                              <span className="text-xs text-gray-500">{fontCollection.fonts.accent}</span>
                            </div>
                            <div className="text-sm text-gray-600 italic">1234567890</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4" />
              Current theme: <span className="font-medium">{currentTheme.name}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeCustomizer;