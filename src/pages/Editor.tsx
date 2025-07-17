import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  ArrowLeft,
  Plus,
  Eye,
  Download,
  Save,
  Menu,
  X,
  Check,
  Layout,
  Palette,
  Layers,
  Code,
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import SectionSelector from '../components/SectionSelector';
import SectionRenderer from '../components/SectionRenderer';
import ThemeCustomizer from '../components/ThemeCustomizer';
import { generateCompleteHTML } from '../utils/htmlExporter';
import AddSectionButton from '../components/AddSectionButton';

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, reorderSections, createProject, isLoading } = useProject();
  const { currentTheme } = useTheme();
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [insertPosition, setInsertPosition] = useState<{ index: number; position: 'above' | 'below' } | null>(null);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
      } else {
        console.log('Project not found:', id);
      }
    }
  }, [id, projects, setCurrentProject, navigate]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !currentProject) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      const sections = [...currentProject.sections];
      const activeIndex = sections.findIndex(section => section.id === activeId);
      const overIndex = sections.findIndex(section => section.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = sections.splice(activeIndex, 1);
        sections.splice(overIndex, 0, removed);

        const updatedSections = sections.map((section, index) => ({
          ...section,
          order: index
        }));

        reorderSections(updatedSections);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setEditingSection(null);
    }, 1000);
  };

  const handleExport = () => {
    if (currentProject && currentTheme) {
      const htmlContent = generateCompleteHTML(currentProject, currentTheme);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      alert('Website exported successfully! The HTML file has been downloaded.');
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const handleAddSection = (position?: { index: number; position: 'above' | 'below' }) => {
    setInsertPosition(position || null);
    setShowSectionSelector(true);
  };

  const handleSectionAdded = () => {
    setShowSectionSelector(false);
    setInsertPosition(null);
  };

  const moveSectionUp = (sectionId: string) => {
    if (!currentProject) return;

    const sections = [...currentProject.sections].sort((a, b) => a.order - b.order);
    const currentIndex = sections.findIndex(s => s.id === sectionId);

    if (currentIndex > 0) {
      const updatedSections = [...sections];
      [updatedSections[currentIndex - 1], updatedSections[currentIndex]] =
        [updatedSections[currentIndex], updatedSections[currentIndex - 1]];

      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index
      }));

      reorderSections(reorderedSections);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    if (!currentProject) return;

    const sections = [...currentProject.sections].sort((a, b) => a.order - b.order);
    const currentIndex = sections.findIndex(s => s.id === sectionId);

    if (currentIndex < sections.length - 1) {
      const updatedSections = [...sections];
      [updatedSections[currentIndex], updatedSections[currentIndex + 1]] =
        [updatedSections[currentIndex + 1], updatedSections[currentIndex]];

      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index
      }));

      reorderSections(reorderedSections);
    }
  };

  if (!currentProject) {
    const projectExists = id && projects.some(p => p.id === id);

    if (id && !projectExists && !isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              The project with ID "{id}" doesn't exist.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  const project = createProject(
                    `New Project ${projects.length + 1}`,
                    undefined,
                    id
                  );
                  setCurrentProject(project);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isLoading ? 'Loading your projects...' : 'Loading your project...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:hidden shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 truncate max-w-32">{currentProject.name}</h1>
              <p className="text-xs text-gray-500">{currentProject.sections.length} sections</p>
            </div>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAddSection()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>

                <button
                  onClick={() => {
                    setShowThemeCustomizer(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-sm font-semibold shadow-md"
                >
                  <Palette className="w-4 h-4" />
                  Theme
                </button>

                <button
                  onClick={() => navigate(`/preview/${currentProject.id}`)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-semibold shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 text-sm font-semibold shadow-md"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : editingSection ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : editingSection ? 'Done' : 'Save'}
                </button>
              </div>

              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all text-sm font-semibold shadow-md"
              >
                <Download className="w-4 h-4" />
                Export HTML
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white/95 border-b border-gray-200 px-6 py-5 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-secondary-600 group-hover:text-secondary-800" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Layout className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900 font-heading">{currentProject.name}</h1>
                <p className="text-sm text-secondary-500 font-primary">
                  {currentProject.sections.length} sections • Last saved {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAddSection()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg font-heading"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>

            <button
              onClick={() => setShowThemeCustomizer(true)}
              className="flex items-center gap-2 px-6 py-3 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition-all font-semibold shadow-lg font-heading"
            >
              <Palette className="w-4 h-4" />
              Customize
            </button>

            <button
              onClick={() => navigate(`/preview/${currentProject.id}`)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-lg font-heading"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 font-semibold shadow-lg font-heading"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : editingSection ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : editingSection ? 'Done Editing' : 'Save'}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-semibold shadow-lg font-heading"
            >
              <Code className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 overflow-auto">
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={currentProject.sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="min-h-full" style={{ fontFamily: currentTheme?.fonts?.primary }}>
                {currentProject.sections.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="text-center max-w-lg">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                          <Layers className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center animate-bounce">
                          <Layout className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-secondary-900 mb-4 font-heading">
                        Ready to Build Something Amazing?
                      </h3>
                      <p className="text-secondary-600 mb-8 text-lg leading-relaxed font-primary">
                        Start by adding your first section. Choose from headers, heroes, content blocks, and more to create your perfect website.
                      </p>
                      <button
                        onClick={() => handleAddSection()}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg text-lg font-heading"
                      >
                        <Plus className="w-5 h-5" />
                        Add Your First Section
                      </button>
                    </div>
                  </div>
                ) : (
                  currentProject.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <React.Fragment key={section.id}>
                        <AddSectionButton
                          onAdd={() => handleAddSection({ index, position: 'above' })}
                          position="above"
                          theme={currentTheme}
                          index={index}
                          isVisible={index === 0}
                        />
                        <SectionRenderer
                          section={section}
                          isSelected={selectedSection === section.id}
                          onSelect={() => setSelectedSection(section.id)}
                          theme={currentTheme}
                          isEditing={editingSection === section.id}
                          onEdit={(editing) => {
                            if (editing) {
                              setEditingSection(section.id);
                            } else {
                              setEditingSection(null);
                            }
                          }}
                          onAddAbove={() => handleAddSection({ index, position: 'above' })}
                          onAddBelow={() => handleAddSection({ index, position: 'below' })}
                          canMoveUp={index > 0}
                          canMoveDown={index < currentProject.sections.length - 1}
                          onMoveUp={() => moveSectionUp(section.id)}
                          onMoveDown={() => moveSectionDown(section.id)}
                        />
                        <AddSectionButton
                          onAdd={() => handleAddSection({ index, position: 'below' })}
                          position="below"
                          theme={currentTheme}
                          index={index}
                        />
                      </React.Fragment>
                    ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Modals */}
      {showSectionSelector && (
        <SectionSelector
          onClose={() => {
            setShowSectionSelector(false);
            setInsertPosition(null);
          }}
          onSelect={handleSectionAdded}
          insertPosition={insertPosition}
        />
      )}

      {showThemeCustomizer && (
        <ThemeCustomizer
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}
    </div>
  );
};

export default Editor;