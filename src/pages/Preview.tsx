import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit3,
  Share2,
  Globe,
  Eye,
  Layout
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import SectionRenderer from '../components/SectionRenderer';

const Preview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProject();
  const { currentTheme } = useTheme();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCurrentProject(project);
      } else {
        console.log('Project not found for preview:', id);
      }
    }
  }, [id, projects, setCurrentProject, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePublish = () => {
    alert(`🎉 Your website has been published!\n\nYou can access it at: ${currentProject?.name.toLowerCase().replace(/\s+/g, '-')}.templates.uz`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProject?.name,
        text: `Check out my website: ${currentProject?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!currentProject) {
    const projectExists = id && projects.some(p => p.id === id);

    if (id && !projectExists) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h2>
            <p className="text-gray-600 mb-6">
              The website with ID "{id}" doesn't exist.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(`/editor/${id}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Website
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
          <p className="text-gray-600 text-lg">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-4 right-4 z-50 bg-white/98 rounded-2xl shadow-hard border border-gray-100 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/editor/${currentProject.id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-secondary-600 group-hover:text-secondary-800" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-secondary-900 font-heading">{currentProject.name}</h1>
                <p className="text-sm text-secondary-600 font-primary">Live Preview Mode</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/editor/${currentProject.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium font-primary"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium font-primary"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium font-primary"
            >
              <Globe className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </motion.div>

      {/* Website Content */}
      <div className="pt-20">
        {currentProject.sections.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-lg">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto">
                  <Globe className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center animate-bounce">
                  <Layout className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-4 font-heading">
                Your website is empty
              </h2>
              <p className="text-secondary-600 mb-8 text-lg font-primary">
                Add some sections to see your website come to life
              </p>
              <button
                onClick={() => navigate(`/editor/${currentProject.id}`)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg text-lg font-heading"
              >
                Start Building
              </button>
            </div>
          </div>
        ) : (
          currentProject.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                isSelected={false}
                onSelect={() => { }}
                isPreview={true}
                theme={currentTheme}
                isEditing={false}
                onEdit={() => { }}
              />
            ))
        )}
      </div>

      {/* Preview Mode Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl px-6 py-3 text-white flex items-center gap-3 shadow-lg"
        >
          <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          <span className="font-medium font-primary">Preview Mode Active</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Preview;