import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Globe,
  Bell,
  Clock,
  Moon,
  Sun,
  Monitor,
  Languages,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Save,
  Check,
  AlertCircle,
  Shield,
  Key,
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Palette,
  Layout,
  Code,
  Zap,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'advanced'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load current settings
  const userPreferences = optimizedStorage.getUserPreferences();
  const userData = optimizedStorage.getUser();

  // Form states
  const [settings, setSettings] = useState({
    // General settings
    language: userPreferences?.language || 'en',
    timezone: userPreferences?.timezone || 'UTC',
    theme: userPreferences?.theme || 'light',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Notification settings
    emailNotifications: userPreferences?.notifications?.email ?? true,
    pushNotifications: userPreferences?.notifications?.push ?? true,
    marketingEmails: userPreferences?.notifications?.marketing ?? false,
    projectUpdates: true,
    teamInvites: true,
    systemAlerts: true,
    weeklyDigest: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showEmail: false,
    allowIndexing: true,
    dataCollection: true,
    
    // Advanced settings
    autoSave: userPreferences?.editor?.autoSave ?? true,
    autoSaveInterval: userPreferences?.editor?.autoSaveInterval || 30,
    showGrid: userPreferences?.editor?.showGrid ?? false,
    snapToGrid: userPreferences?.editor?.snapToGrid ?? true,
    enableShortcuts: true,
    debugMode: false,
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿' },
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Asia/Tashkent',
    'Australia/Sydney',
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update user preferences
      const updatedPreferences = {
        theme: settings.theme as 'light' | 'dark' | 'auto',
        language: settings.language,
        timezone: settings.timezone,
        notifications: {
          email: settings.emailNotifications,
          push: settings.pushNotifications,
          marketing: settings.marketingEmails,
        },
        editor: {
          autoSave: settings.autoSave,
          autoSaveInterval: settings.autoSaveInterval,
          showGrid: settings.showGrid,
          snapToGrid: settings.snapToGrid,
        },
      };

      optimizedStorage.saveUserPreferences(updatedPreferences);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const data = optimizedStorage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templates-uz-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          const success = optimizedStorage.importAllData(data);
          if (success) {
            alert('Settings imported successfully!');
            window.location.reload();
          } else {
            alert('Failed to import settings. Please check the file format.');
          }
        } catch (error) {
          alert('Invalid file format. Please select a valid settings file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-secondary-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900 font-heading">Settings</h1>
                  <p className="text-sm text-secondary-600 font-primary">Customize your experience</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 bg-success-100 text-success-700 rounded-xl border border-success-200"
                >
                  <Check className="w-4 h-4" />
                  <span className="font-medium font-primary">Saved!</span>
                </motion.div>
              )}
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-secondary-200 sticky top-32">
              <nav className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      activeTab === id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-primary">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 font-heading">General Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                        <Languages className="w-4 h-4 inline mr-2" />
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'auto', label: 'Auto', icon: Monitor },
                        ].map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setSettings({ ...settings, theme: value })}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              settings.theme === value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-secondary-200 hover:border-secondary-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="font-medium font-primary">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time Format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                          Date Format
                        </label>
                        <select
                          value={settings.dateFormat}
                          onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                          Time Format
                        </label>
                        <select
                          value={settings.timeFormat}
                          onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                        >
                          <option value="12h">12 Hour</option>
                          <option value="24h">24 Hour</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 font-heading">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {[
                      {
                        key: 'emailNotifications',
                        label: 'Email Notifications',
                        description: 'Receive important updates via email',
                        icon: Mail,
                      },
                      {
                        key: 'pushNotifications',
                        label: 'Push Notifications',
                        description: 'Browser notifications for real-time updates',
                        icon: Smartphone,
                      },
                      {
                        key: 'marketingEmails',
                        label: 'Marketing Emails',
                        description: 'Product updates, tips, and promotional content',
                        icon: Bell,
                      },
                      {
                        key: 'projectUpdates',
                        label: 'Project Updates',
                        description: 'Notifications when projects are modified',
                        icon: Layout,
                      },
                      {
                        key: 'teamInvites',
                        label: 'Team Invitations',
                        description: 'Notifications for team collaboration requests',
                        icon: Globe,
                      },
                      {
                        key: 'systemAlerts',
                        label: 'System Alerts',
                        description: 'Important system maintenance and security updates',
                        icon: AlertCircle,
                      },
                      {
                        key: 'weeklyDigest',
                        label: 'Weekly Digest',
                        description: 'Summary of your activity and achievements',
                        icon: Clock,
                      },
                    ].map(({ key, label, description, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900 font-primary">{label}</div>
                            <div className="text-sm text-secondary-600 font-primary">{description}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSettings({
                            ...settings,
                            [key]: !settings[key as keyof typeof settings]
                          })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings[key as keyof typeof settings]
                              ? 'bg-primary-600'
                              : 'bg-secondary-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings[key as keyof typeof settings]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 font-heading">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                        <Eye className="w-4 h-4 inline mr-2" />
                        Profile Visibility
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { value: 'public', label: 'Public', description: 'Visible to everyone' },
                          { value: 'private', label: 'Private', description: 'Only visible to you' },
                          { value: 'team', label: 'Team Only', description: 'Visible to team members' },
                        ].map(({ value, label, description }) => (
                          <button
                            key={value}
                            onClick={() => setSettings({ ...settings, profileVisibility: value })}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              settings.profileVisibility === value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-secondary-200 hover:border-secondary-300'
                            }`}
                          >
                            <div className="font-medium text-secondary-900 font-primary">{label}</div>
                            <div className="text-sm text-secondary-600 font-primary">{description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Privacy Toggles */}
                    {[
                      {
                        key: 'showEmail',
                        label: 'Show Email Address',
                        description: 'Display your email on your public profile',
                      },
                      {
                        key: 'allowIndexing',
                        label: 'Allow Search Engine Indexing',
                        description: 'Let search engines index your public projects',
                      },
                      {
                        key: 'dataCollection',
                        label: 'Analytics Data Collection',
                        description: 'Help improve our service with anonymous usage data',
                      },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                        <div>
                          <div className="font-medium text-secondary-900 font-primary">{label}</div>
                          <div className="text-sm text-secondary-600 font-primary">{description}</div>
                        </div>
                        <button
                          onClick={() => setSettings({
                            ...settings,
                            [key]: !settings[key as keyof typeof settings]
                          })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings[key as keyof typeof settings]
                              ? 'bg-primary-600'
                              : 'bg-secondary-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings[key as keyof typeof settings]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Editor Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 font-heading">Editor Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Auto Save */}
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                      <div>
                        <div className="font-medium text-secondary-900 font-primary">Auto Save</div>
                        <div className="text-sm text-secondary-600 font-primary">Automatically save changes while editing</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.autoSave ? 'bg-primary-600' : 'bg-secondary-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Auto Save Interval */}
                    {settings.autoSave && (
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">
                          Auto Save Interval (seconds)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          value={settings.autoSaveInterval}
                          onChange={(e) => setSettings({ ...settings, autoSaveInterval: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                        />
                      </div>
                    )}

                    {/* Grid Settings */}
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                      <div>
                        <div className="font-medium text-secondary-900 font-primary">Show Grid</div>
                        <div className="text-sm text-secondary-600 font-primary">Display alignment grid in editor</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, showGrid: !settings.showGrid })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.showGrid ? 'bg-primary-600' : 'bg-secondary-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.showGrid ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                      <div>
                        <div className="font-medium text-secondary-900 font-primary">Snap to Grid</div>
                        <div className="text-sm text-secondary-600 font-primary">Automatically align elements to grid</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, snapToGrid: !settings.snapToGrid })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.snapToGrid ? 'bg-primary-600' : 'bg-secondary-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.snapToGrid ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                      <div>
                        <div className="font-medium text-secondary-900 font-primary">Keyboard Shortcuts</div>
                        <div className="text-sm text-secondary-600 font-primary">Enable keyboard shortcuts for faster editing</div>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, enableShortcuts: !settings.enableShortcuts })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.enableShortcuts ? 'bg-primary-600' : 'bg-secondary-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.enableShortcuts ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 font-heading">Data Management</h2>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleExportData}
                      className="w-full flex items-center gap-3 p-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium font-primary">Export Settings</div>
                        <div className="text-sm font-primary">Download your settings as a backup file</div>
                      </div>
                    </button>

                    <label className="w-full flex items-center gap-3 p-4 bg-secondary-50 text-secondary-700 rounded-xl hover:bg-secondary-100 transition-colors cursor-pointer">
                      <Upload className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium font-primary">Import Settings</div>
                        <div className="text-sm font-primary">Restore settings from a backup file</div>
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
                          optimizedStorage.clearCache();
                          window.location.reload();
                        }
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-warning-50 text-warning-700 rounded-xl hover:bg-warning-100 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium font-primary">Reset to Defaults</div>
                        <div className="text-sm font-primary">Restore all settings to their default values</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Debug Mode */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
                  <h2 className="text-xl font-semibold text-secondary-900 mb-6 font-heading">Developer Options</h2>
                  
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                    <div>
                      <div className="font-medium text-secondary-900 font-primary">Debug Mode</div>
                      <div className="text-sm text-secondary-600 font-primary">Show additional debugging information</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, debugMode: !settings.debugMode })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.debugMode ? 'bg-primary-600' : 'bg-secondary-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.debugMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;