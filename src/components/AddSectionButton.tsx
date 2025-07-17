import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface AddSectionButtonProps {
  onAdd: () => void;
  position: 'above' | 'below' | 'between';
  theme?: ThemeConfig;
  index?: number;
  isVisible?: boolean;
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({
  onAdd,
  position,
  index,
  isVisible = true
}) => {
  if (!isVisible) return null;

  return (
    <div className="relative group py-4">
      {/* Animated line */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Add button */}
      <motion.button
        onClick={onAdd}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: position === 'above' ? -10 : 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto flex items-center justify-center w-12 h-12 bg-white border-2 border-dashed border-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 shadow-lg hover:shadow-xl z-10"
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
        </motion.div>
      </motion.button>

      {/* Enhanced Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Add Section {position === 'above' ? 'Above' : position === 'below' ? 'Below' : 'Here'}</span>
          {typeof index === 'number' && (
            <span className="text-blue-300">#{index + 1}</span>
          )}
        </div>
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </motion.div>

      {/* Hover area for better UX */}
      <div className="absolute inset-0 -my-2 cursor-pointer" onClick={onAdd} />
    </div>
  );
};

export default AddSectionButton;