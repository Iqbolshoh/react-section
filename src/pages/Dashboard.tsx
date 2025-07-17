import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Globe,
  Layers,
  Clock,
  Sparkles,
  Bookmark,
  Layout,
  BarChart3,
  Smartphone,
  X,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  Building,
  User,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Camera,
  Music,
  Gamepad2,
  Utensils,
  Car,
  Home,
  Check,
  AlertCircle,
  UserCircle,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { formatRelativeTime } from '../utils/helpers';
import { optimizedStorage } from '../utils/optimizedStorage';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, createProject, deleteProject, isLoading } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newCategory, setNewCategory] = useState('business');
  const [newSeoKeywords, setNewSeoKeywords] = useState('');
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newFavicon, setNewFavicon] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated');
  const [urlError, setUrlError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Website categories
  const categories = [
    { id: 'business', name: 'Business', icon: Building, description: 'Corporate websites, agencies, consulting' },
    { id: 'personal', name: 'Personal', icon: User, description: 'Personal blogs, portfolios, resumes' },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, description: 'Creative portfolios, showcases' },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag, description: 'Online stores, marketplaces' },
    { id: 'education', name: 'Education', icon: GraduationCap, description: 'Schools, courses, learning platforms' },
    { id: 'photography', name: 'Photography', icon: Camera, description: 'Photo galleries, studios' },
    { id: 'music', name: 'Music', icon: Music, description: 'Musicians, bands, music studios' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, description: 'Gaming communities, esports' },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils, description: 'Restaurants, cafes, food services' },
    { id: 'automotive', name: 'Automotive', icon: Car, description: 'Car dealerships, auto services' },
    { id: 'realestate', name: 'Real Estate', icon: Home, description: 'Property listings, real estate agencies' },
  ];

  const filteredProjects = projects
    .filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.websiteUrl?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const validateWebsiteUrl = (url: string) => {
    if (!url) {
      setUrlError('Website URL is required');
      return false;
    }

    const urlPattern = /^[a-zA-Z0-9-_]+$/;
    if (!urlPattern.test(url)) {
      setUrlError('URL can only contain letters, numbers, hyphens, and underscores');
      return false;
    }

    if (url.length < 3) {
      setUrlError('URL must be at least 3 characters long');
      return false;
    }

    if (url.length > 50) {
      setUrlError('URL must be less than 50 characters');
      return false;
    }

    const urlExists = projects.some(p => p.websiteUrl === url);
    if (urlExists) {
      setUrlError('This website URL is already taken. Please choose a different one.');
      return false;
    }

    setUrlError('');
    return true;
  };

  const handleWebsiteUrlChange = (url: string) => {
    const cleanUrl = url.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setNewWebsiteUrl(cleanUrl);
    if (cleanUrl) {
      validateWebsiteUrl(cleanUrl);
    } else {
      setUrlError('');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for the logo');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB');
        return;
      }
      
      setNewLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file for the favicon');
        return;
      }
      
      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('Favicon file size must be less than 1MB');
        return;
      }
      
      setNewFavicon(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProjectName.trim()) {
      alert('Please enter a website name');
      return;
    }

    if (!validateWebsiteUrl(newWebsiteUrl)) {
      return;
    }

    setIsCreating(true);

    try {
      // Convert uploaded files to base64 for storage
      let logoBase64 = '';
      let faviconBase64 = '';
      
      if (newLogo) {
        logoBase64 = await convertFileToBase64(newLogo);
      }
      
      if (newFavicon) {
        faviconBase64 = await convertFileToBase64(newFavicon);
      }

      // Parse SEO keywords
      const seoKeywords = newSeoKeywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      // Create enhanced project data
      const projectData = {
        name: newProjectName.trim(),
        websiteUrl: newWebsiteUrl.trim(),
        category: newCategory,
        seoKeywords,
        logo: logoBase64,
        favicon: faviconBase64,
      };

      const project = createProject(
        projectData.name,
        undefined, // No description field
        projectData.websiteUrl,
        projectData.category,
        projectData.seoKeywords,
        projectData.logo,
        projectData.favicon
      );

      // Reset form
      setNewProjectName('');
      setNewWebsiteUrl('');
      setNewCategory('business');
      setNewSeoKeywords('');
      setNewLogo(null);
      setNewFavicon(null);
      setLogoPreview('');
      setFaviconPreview('');
      setUrlError('');
      setShowCreateModal(false);

      // Navigate to editor only after successful creation
      setTimeout(() => {
        navigate(`/editor/${project.id}`);
      }, 100);

    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create website. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
      setSelectedProject(null); // Clear selection after delete
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const newUrl = `${project.websiteUrl}-copy-${Date.now()}`;
      createProject(`${project.name} (Copy)`, project.description, newUrl);
    }
  };

  const handleExportData = () => {
    const data = optimizedStorage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templates-uz-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL your websites and data. This action cannot be undone.\n\nAre you absolutely sure you want to continue?')) {
      if (window.confirm('🚨 FINAL CONFIRMATION: All your websites will be lost forever. Type "DELETE" in the next prompt to confirm.')) {
        const confirmation = window.prompt('Type "DELETE" to confirm deletion of all data:');
        if (confirmation === 'DELETE') {
          clearAllData();
          setSelectedProject(null);
          alert('✅ All data has been cleared successfully.');
        } else {
          alert('❌ Deletion cancelled - confirmation text did not match.');
        }
      }
    }
  };

  const storageInfo = optimizedStorage.getStorageHealth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2 font-heading">Loading Your Projects</h2>
          <p className="text-secondary-600 font-primary">Please wait while we fetch your data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Mobile-First Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-40 shadow-soft">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div 
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Layout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-heading">
                  Templates.uz
                </h1>
                <p className="text-xs sm:text-sm text-secondary-500 font-medium font-primary">Mobile Website Builder</p>
              </div>
            </motion.div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search - Hidden on mobile, shown on larger screens */}
              <div className="hidden md:block relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 backdrop-blur-sm w-64 lg:w-80 font-primary text-sm"
                />
              </div>

              {/* Profile Button */}
              <motion.button
                onClick={() => navigate('/profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-3 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-all duration-200 shadow-medium"
              >
                <UserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              {/* Create Button */}
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-glow transition-all duration-200 font-semibold shadow-medium font-heading text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">New Site</span>
                <span className="sm:hidden">New</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 backdrop-blur-sm font-primary"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 font-heading">{projects.length}</p>
                <p className="text-xs sm:text-sm text-secondary-500 font-medium font-primary">Total Sites</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 font-heading">
                  {projects.filter(p => p.isPublished).length}
                </p>
                <p className="text-xs sm:text-sm text-secondary-500 font-medium font-primary">Published</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 font-heading">
                  {projects.reduce((total, project) => total + project.sections.length, 0)}
                </p>
                <p className="text-xs sm:text-sm text-secondary-500 font-medium font-primary">Sections</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 font-heading">
                  {Math.round((storageInfo.totalSize / (5 * 1024 * 1024)) * 100)}%
                </p>
                <p className="text-xs sm:text-sm text-secondary-500 font-medium font-primary">Storage</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2 font-heading">Your Websites</h2>
              <p className="text-secondary-600 font-primary">Create and manage your mobile-friendly websites</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'updated' | 'created' | 'name')}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90 backdrop-blur-sm font-primary text-sm"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-20"
            >
              <div className="relative mb-8">
                <motion.div 
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto shadow-glow"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </motion.div>
                <motion.div 
                  className="absolute -top-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-accent-400 rounded-full flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </motion.div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4 font-heading">
                {searchTerm ? 'No websites found' : 'Create Your First Mobile Website'}
              </h3>
              <p className="text-secondary-600 mb-8 max-w-lg mx-auto text-base sm:text-lg font-primary px-4">
                {searchTerm 
                  ? `No websites match "${searchTerm}". Try a different search term.`
                  : 'Click the button below to create your first professional website. It\'s easy and takes just a few minutes to get started.'
                }
              </p>
              {!searchTerm && (
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl hover:shadow-glow transition-all duration-200 font-semibold shadow-medium text-base sm:text-lg font-heading"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  Create Your First Site
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-secondary-200 shadow-soft hover:shadow-hard transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Project Thumbnail */}
                  <div className="relative h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
                    {project.thumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-medium"
                        >
                          <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                        </motion.div>
                        <p className="text-xs sm:text-sm font-semibold text-secondary-700 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1 font-primary">
                          {project.sections.length} sections
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-medium ${
                          project.isPublished 
                            ? 'bg-success-50 text-success-700 border border-success-200' 
                            : 'bg-warning-50 text-warning-700 border border-warning-200'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                          project.isPublished ? 'bg-success-500' : 'bg-warning-500'
                        }`}></div>
                        <span className="font-primary">{project.isPublished ? 'Live' : 'Draft'}</span>
                      </motion.span>
                    </div>

                    {/* Action Menu */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <motion.button
                          onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-medium"
                        >
                          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
                        </motion.button>
                        
                        <AnimatePresence>
                          {selectedProject === project.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className="absolute right-0 top-12 w-44 sm:w-48 bg-white rounded-xl sm:rounded-2xl shadow-hard border border-secondary-200 py-2 z-50"
                            >
                              <button
                                onClick={() => {
                                  navigate(`/preview/${project.id}`);
                                  setSelectedProject(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center gap-3 transition-colors font-primary"
                              >
                                <Eye className="w-4 h-4" />
                                Preview
                              </button>
                              <button
                                onClick={() => {
                                  handleDuplicateProject(project.id);
                                  setSelectedProject(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-secondary-700 hover:bg-secondary-50 flex items-center gap-3 transition-colors font-primary"
                              >
                                <Copy className="w-4 h-4" />
                                Duplicate
                              </button>
                              <div className="border-t border-secondary-100 my-1"></div>
                              <button
                                onClick={() => {
                                  handleDeleteProject(project.id);
                                  setSelectedProject(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-3 transition-colors font-primary"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-secondary-900 truncate flex-1 mr-2 group-hover:text-primary-600 transition-colors font-heading">
                        {project.name}
                      </h3>
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400 hover:text-primary-500 cursor-pointer transition-colors flex-shrink-0" />
                    </div>
                    
                    {/* Website URL */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-secondary-50 rounded-lg">
                      <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-primary-600 font-mono truncate">
                        templates.uz/{project.websiteUrl}
                      </span>
                    </div>
                    
                    {project.description && (
                      <p className="text-secondary-600 text-sm mb-4 line-clamp-2 leading-relaxed font-primary">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-secondary-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium font-primary">{formatRelativeTime(project.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium font-primary">{project.sections.length} sections</span>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <motion.button
                        onClick={() => navigate(`/editor/${project.id}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-glow transition-all duration-200 font-semibold text-sm shadow-medium font-heading"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => navigate(`/preview/${project.id}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-2.5 sm:px-4 sm:py-3 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-colors font-semibold text-sm font-primary"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isCreating) {
                setShowCreateModal(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-hard border border-secondary-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-medium"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 font-heading">Create New Website</h2>
                    <p className="text-sm sm:text-base text-secondary-600 font-primary">Build your professional website</p>
                  </div>
                </div>
                {!isCreating && (
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-secondary-500" />
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                {/* Website Name */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3 font-primary">
                    Website Name *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My Awesome Website"
                    className="w-full px-4 py-3 sm:py-4 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-lg font-primary"
                    required
                    disabled={isCreating}
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3 font-primary">
                    Website URL *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-3 sm:py-4 bg-secondary-100 text-secondary-600 rounded-l-xl border border-r-0 border-secondary-300 text-sm sm:text-base font-mono">
                      templates.uz/
                    </span>
                    <input
                      type="text"
                      value={newWebsiteUrl}
                      onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                      placeholder="my-website"
                      className={`flex-1 px-4 py-3 sm:py-4 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base sm:text-lg font-mono ${
                        urlError ? 'border-error-500' : 'border-secondary-300'
                      }`}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  {urlError && (
                    <div className="flex items-center gap-2 mt-2 text-error-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-primary">{urlError}</span>
                    </div>
                  )}
                  {!urlError && newWebsiteUrl && (
                    <div className="flex items-center gap-2 mt-2 text-success-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-primary">URL is available</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-secondary-500 mt-2 font-primary">
                    Only letters, numbers, hyphens, and underscores allowed
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3 font-primary">
                    Website Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <motion.button
                          key={category.id}
                          type="button"
                          onClick={() => setNewCategory(category.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isCreating}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            newCategory === category.id
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                          }`}
                        >
                          <IconComponent className="w-5 h-5 mb-2" />
                          <div className="text-sm font-semibold font-primary">{category.name}</div>
                          <div className="text-xs text-secondary-500 font-primary">{category.description}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3 font-primary">
                    SEO Keywords (Optional)
                  </label>
                  <input
                    type="text"
                    value={newSeoKeywords}
                    onChange={(e) => setNewSeoKeywords(e.target.value)}
                    placeholder="business, website, professional, services"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-primary text-base"
                    disabled={isCreating}
                  />
                  <p className="text-xs sm:text-sm text-secondary-500 mt-2 font-primary">
                    Separate keywords with commas
                  </p>
                </div>

                {/* Logo File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3 font-primary">
                    Logo Upload (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={isCreating}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-secondary-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer font-primary text-base"
                      >
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-secondary-500" />
                          <span className="text-secondary-700">
                            {newLogo ? newLogo.name : 'Choose logo file'}
                          </span>
                        </div>
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="relative w-16 h-16 border border-secondary-200 rounded-lg overflow-hidden bg-white">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewLogo(null);
                            setLogoPreview('');
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-error-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-secondary-500 mt-2 font-primary">
                    Recommended: PNG or SVG format, max 5MB. Will be automatically added to header, footer, and relevant sections.
                  </p>
                </div>

                {/* Favicon File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 mb-3 font-primary">
                    Favicon Upload (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        disabled={isCreating}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="favicon-upload"
                      />
                      <label
                        htmlFor="favicon-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-secondary-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer font-primary text-base"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-secondary-500" />
                          <span className="text-secondary-700">
                            {newFavicon ? newFavicon.name : 'Choose favicon file'}
                          </span>
                        </div>
                      </label>
                    </div>
                    {faviconPreview && (
                      <div className="relative w-8 h-8 border border-secondary-200 rounded overflow-hidden bg-white">
                        <img
                          src={faviconPreview}
                          alt="Favicon preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewFavicon(null);
                            setFaviconPreview('');
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-error-600 transition-colors"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-secondary-500 mt-2 font-primary">
                    Recommended: ICO, PNG format, 16x16 or 32x32 pixels, max 1MB. Displayed in browser tabs.
                  </p>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isCreating}
                    className="flex-1 px-4 py-3 sm:px-6 sm:py-4 text-secondary-700 bg-secondary-100 rounded-xl hover:bg-secondary-200 transition-colors font-semibold font-primary text-base disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isCreating || !!urlError || !newProjectName.trim() || !newWebsiteUrl.trim()}
                    className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-glow transition-all duration-200 font-semibold shadow-medium font-heading text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Website
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;