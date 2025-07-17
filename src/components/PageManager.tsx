import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Copy,
  Home,
  FileText,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  Globe,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { Page } from '../types';

interface PageManagerProps {
  onPageSelect: (page: Page) => void;
  selectedPageId?: string;
}

const PageManager: React.FC<PageManagerProps> = ({ onPageSelect, selectedPageId }) => {
  const { currentProject, currentPage, createPage, updatePage, deletePage, duplicatePage } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [selectedPageMenu, setSelectedPageMenu] = useState<string | null>(null);
  
  // Form states
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [slugError, setSlugError] = useState('');

  if (!currentProject) return null;

  const validateSlug = (slug: string, excludePageId?: string) => {
    if (!slug) {
      setSlugError('Page URL is required');
      return false;
    }

    const slugPattern = /^[a-z0-9-_]+$/;
    if (!slugPattern.test(slug)) {
      setSlugError('URL can only contain lowercase letters, numbers, hyphens, and underscores');
      return false;
    }

    if (slug.length < 2) {
      setSlugError('URL must be at least 2 characters long');
      return false;
    }

    const slugExists = currentProject.pages.some(p => p.slug === slug && p.id !== excludePageId);
    if (slugExists) {
      setSlugError('This page URL is already taken');
      return false;
    }

    setSlugError('');
    return true;
  };

  const handleSlugChange = (slug: string, excludePageId?: string) => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setPageSlug(cleanSlug);
    if (cleanSlug) {
      validateSlug(cleanSlug, excludePageId);
    } else {
      setSlugError('');
    }
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pageName.trim()) {
      alert('Please enter a page name');
      return;
    }

    if (!validateSlug(pageSlug)) {
      return;
    }

    const newPage = createPage(currentProject.id, pageName, pageSlug, pageTitle || pageName);
    
    // Reset form
    setPageName('');
    setPageSlug('');
    setPageTitle('');
    setPageDescription('');
    setSlugError('');
    setShowCreateModal(false);
    
    // Select the new page
    onPageSelect(newPage);
  };

  const handleEditPage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPage) return;

    if (!pageName.trim()) {
      alert('Please enter a page name');
      return;
    }

    if (!validateSlug(pageSlug, editingPage.id)) {
      return;
    }

    updatePage(currentProject.id, editingPage.id, {
      name: pageName,
      slug: pageSlug,
      title: pageTitle || pageName,
      description: pageDescription,
    });

    // Reset form
    setPageName('');
    setPageSlug('');
    setPageTitle('');
    setPageDescription('');
    setSlugError('');
    setShowEditModal(false);
    setEditingPage(null);
  };

  const openEditModal = (page: Page) => {
    setEditingPage(page);
    setPageName(page.name);
    setPageSlug(page.slug);
    setPageTitle(page.title);
    setPageDescription(page.description || '');
    setSlugError('');
    setShowEditModal(true);
    setSelectedPageMenu(null);
  };

  const handleDeletePage = (page: Page) => {
    if (page.isHomePage) {
      alert('Cannot delete the home page');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the page "${page.name}"? This action cannot be undone.`)) {
      deletePage(currentProject.id, page.id);
      setSelectedPageMenu(null);
    }
  };

  const handleDuplicatePage = (page: Page) => {
    duplicatePage(currentProject.id, page.id);
    setSelectedPageMenu(null);
  };

  const togglePageVisibility = (page: Page) => {
    updatePage(currentProject.id, page.id, {
      isPublished: !page.isPublished
    });
    setSelectedPageMenu(null);
  };

  return (
    <div className="bg-white border-r border-gray-200 w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 font-heading">Pages</h2>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Page
          </motion.button>
        </div>
        
        <p className="text-sm text-gray-600 font-primary">
          Manage your website pages and navigation
        </p>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {currentProject.pages
            .sort((a, b) => a.order - b.order)
            .map((page) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative group p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPageId === page.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onPageSelect(page)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      page.isHomePage 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {page.isHomePage ? (
                        <Home className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate font-primary">
                          {page.name}
                        </h3>
                        {page.isHomePage && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Home
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 font-mono">
                          /{page.slug}
                        </span>
                        <div className="flex items-center gap-1">
                          {page.isPublished ? (
                            <Eye className="w-3 h-3 text-green-500" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500">
                            {page.sections.length} sections
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page Menu */}
                  <div className="relative">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPageMenu(selectedPageMenu === page.id ? null : page.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </motion.button>

                    <AnimatePresence>
                      {selectedPageMenu === page.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(page);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Page
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePageVisibility(page);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            {page.isPublished ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Hide Page
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Show Page
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicatePage(page);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          
                          {!page.isHomePage && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePage(page);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Create Page Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 font-heading">Create New Page</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreatePage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Name *
                  </label>
                  <input
                    type="text"
                    value={pageName}
                    onChange={(e) => {
                      setPageName(e.target.value);
                      if (!pageSlug) {
                        handleSlugChange(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                      }
                    }}
                    placeholder="About Us"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page URL *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-lg border border-r-0 border-gray-300 text-sm">
                      /{currentProject.websiteUrl}/
                    </span>
                    <input
                      type="text"
                      value={pageSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="about"
                      className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        slugError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {slugError && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{slugError}</span>
                    </div>
                  )}
                  {!slugError && pageSlug && (
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">URL is available</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="About Us - Your Company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!slugError || !pageName.trim() || !pageSlug.trim()}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Page
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Page Modal */}
      <AnimatePresence>
        {showEditModal && editingPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 font-heading">Edit Page</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleEditPage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Name *
                  </label>
                  <input
                    type="text"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    placeholder="About Us"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page URL *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-lg border border-r-0 border-gray-300 text-sm">
                      /{currentProject.websiteUrl}/
                    </span>
                    <input
                      type="text"
                      value={pageSlug}
                      onChange={(e) => handleSlugChange(e.target.value, editingPage.id)}
                      placeholder="about"
                      className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        slugError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      disabled={editingPage.isHomePage}
                    />
                  </div>
                  {slugError && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{slugError}</span>
                    </div>
                  )}
                  {!slugError && pageSlug && (
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">URL is available</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="About Us - Your Company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description (SEO)
                  </label>
                  <textarea
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                    placeholder="Brief description of this page for search engines"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!slugError || !pageName.trim() || !pageSlug.trim()}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler */}
      {selectedPageMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSelectedPageMenu(null)}
        />
      )}
    </div>
  );
};

export default PageManager;