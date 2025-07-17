import React from 'react';
import { motion } from 'framer-motion';
import { 
  GripVertical, 
  Edit, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus,
  Eye,
  EyeOff,
  File,
  Layout,
  Type,
  Image,
  Users,
  MessageSquare,
  Star,
  Grid,
  Phone,
  Zap,
  DollarSign,
  Briefcase,
  Heart,
  Mail,
  Home,
  Info,
  Camera,
  Code,
  Globe,
  Shield,
  Target,
  Award,
  Clock,
  Map,
  Book,
  Music,
  Video,
  Headphones,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Server,
  Database,
  Cloud,
  Wifi,
  Battery,
  Power,
  Settings as SettingsIcon
} from 'lucide-react';
import { SectionInstance, ThemeConfig } from '../types';

// Icon mapping for dynamic icon rendering
const iconMap: { [key: string]: React.ComponentType<any> } = {
  File,
  Layout,
  Type,
  Image,
  Users,
  MessageSquare,
  Star,
  Grid,
  Phone,
  Zap,
  DollarSign,
  Briefcase,
  Heart,
  Mail,
  Home,
  Info,
  Camera,
  Code,
  Globe,
  Shield,
  Target,
  Award,
  Clock,
  Map,
  Book,
  Music,
  Video,
  Headphones,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Server,
  Database,
  Cloud,
  Wifi,
  Battery,
  Power,
  Settings: SettingsIcon
};

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || File;
};

interface SectionControlsProps {
  section: SectionInstance;
  template: any;
  isSelected: boolean;
  isEditing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: (editing: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  dragHandleProps?: any;
}

const SectionControls: React.FC<SectionControlsProps> = ({
  template,
  isSelected,
  isEditing,
  canMoveUp,
  canMoveDown,
  onEdit,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddAbove,
  onAddBelow,
  onToggleVisibility,
  isVisible = true,
  dragHandleProps
}) => {
  if (!isSelected || isEditing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 px-3 py-2"
    >
      {/* Section Info */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mr-2 px-2">
        {template?.icon && (
          <div className="w-4 h-4 flex items-center justify-center">
            {React.createElement(getIconComponent(template.icon), {
              className: "w-4 h-4"
            })}
          </div>
        )}
        <span className="font-medium">{template?.name || 'Section'}</span>
      </div>
      
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Add Above */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onAddAbove();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-green-50 rounded-xl text-green-600 transition-colors"
        title="Add section above"
      >
        <Plus className="w-4 h-4" />
      </motion.button>

      {/* Move Up */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!canMoveUp}
        className={`p-2 rounded-xl transition-colors ${
          canMoveUp 
            ? 'hover:bg-blue-50 text-blue-600' 
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Move up"
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>

      {/* Move Down */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!canMoveDown}
        className={`p-2 rounded-xl transition-colors ${
          canMoveDown 
            ? 'hover:bg-blue-50 text-blue-600' 
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Move down"
      >
        <ArrowDown className="w-4 h-4" />
      </motion.button>

      <div className="w-px h-6 bg-gray-300"></div>
      
      {/* Drag Handle */}
      <motion.button
        {...dragHandleProps}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-gray-100 rounded-xl cursor-grab active:cursor-grabbing transition-colors"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </motion.button>
      
      {/* Edit */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(true);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors"
        title="Edit section"
      >
        <Edit className="w-4 h-4" />
      </motion.button>

      {/* Visibility Toggle */}
      {onToggleVisibility && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-xl transition-colors ${
            isVisible 
              ? 'hover:bg-yellow-50 text-yellow-600' 
              : 'hover:bg-gray-50 text-gray-400'
          }`}
          title={isVisible ? 'Hide section' : 'Show section'}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </motion.button>
      )}
      
      {/* Duplicate */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-green-50 rounded-xl text-green-600 transition-colors"
        title="Duplicate section"
      >
        <Copy className="w-4 h-4" />
      </motion.button>
      
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Add Below */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onAddBelow();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-green-50 rounded-xl text-green-600 transition-colors"
        title="Add section below"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
      
      {/* Delete */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
        title="Delete section"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default SectionControls;