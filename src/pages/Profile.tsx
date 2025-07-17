import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Camera,
  Edit3,
  Save,
  X,
  Check,
  Globe,
  Shield,
  Bell,
  Moon,
  Sun,
  Monitor,
  Languages,
  Key,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Crown,
  Star,
  Zap,
  Calendar,
  Clock,
  Settings,
  LogOut,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user data
  const userData = optimizedStorage.getUser();
  const userPreferences = optimizedStorage.getUserPreferences();
  const userSubscription = optimizedStorage.getUserSubscription();

  // Form states
  const [profile, setProfile] = useState({
    name: userData?.name || 'User',
    email: userData?.email || 'user@templates.uz',
    avatar: userData?.avatar || '',
    company: userData?.company || '',
    website: userData?.website || '',
    bio: userData?.bio || '',
  });

  const [preferences, setPreferences] = useState({
    theme: userPreferences?.theme || 'light',
    language: userPreferences?.language || 'en',
    timezone: userPreferences?.timezone || 'UTC',
    notifications: {
      email: userPreferences?.notifications?.email ?? true,
      push: userPreferences?.notifications?.push ?? true,
      marketing: userPreferences?.notifications?.marketing ?? false,
    },
    editor: {
      autoSave: userPreferences?.editor?.autoSave ?? true,
      autoSaveInterval: userPreferences?.editor?.autoSaveInterval || 30,
      showGrid: userPreferences?.editor?.showGrid ?? false,
      snapToGrid: userPreferences?.editor?.snapToGrid ?? true,
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      let avatarBase64 = profile.avatar;
      
      if (avatarFile) {
        const reader = new FileReader();
        avatarBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });
      }

      const updatedProfile = {
        ...profile,
        avatar: avatarBase64,
      };

      optimizedStorage.saveUser(updatedProfile);
      optimizedStorage.saveUserPreferences(preferences);
      
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview('');
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, you would validate the current password and update it
    alert('Password updated successfully!');
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone and will permanently delete all your data.')) {
      optimizedStorage.clearAll();
      alert('Account deleted successfully');
      navigate('/dashboard');
    }
  };

  const getSubscriptionBadge = () => {
    const plan = userSubscription?.plan || 'free';
    const colors = {
      free: 'bg-gray-100 text-gray-700 border-gray-200',
      pro: 'bg-blue-100 text-blue-700 border-blue-200',
      enterprise: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    
    const icons = {
      free: Star,
      pro: Zap,
      enterprise: Crown,
    };
    
    const IconComponent = icons[plan as keyof typeof icons];
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${colors[plan as keyof typeof colors]}`}>
        <IconComponent className="w-4 h-4" />
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-secondary-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900 font-heading">Profile Settings</h1>
                  <p className="text-sm text-secondary-600 font-primary">Manage your account and preferences</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getSubscriptionBadge()}
              <button
                onClick={() => navigate('/billing')}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                Billing
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition-colors font-medium font-primary"
              >
                Settings
              </button>
              <button
                onClick={() => navigate('/team')}
                className="px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 transition-colors font-medium font-primary"
              >
                Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200"
            >
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                    {avatarPreview || profile.avatar ? (
                      <img
                        src={avatarPreview || profile.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-secondary-900 mb-1 font-heading">{profile.name}</h2>
                <p className="text-secondary-600 mb-4 font-primary">{profile.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600 font-primary">Member since</span>
                    <span className="font-medium font-primary">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600 font-primary">Projects</span>
                    <span className="font-medium font-primary">{optimizedStorage.getAllProjects().length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600 font-primary">Plan</span>
                    {getSubscriptionBadge()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900 font-heading">Personal Information</h3>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isEditing ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 font-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Website</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 font-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 resize-none font-primary"
                  />
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200"
            >
              <h3 className="text-lg font-semibold text-secondary-900 mb-6 font-heading">Preferences</h3>

              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'auto', label: 'Auto', icon: Monitor },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setPreferences({ ...preferences, theme: value as any })}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          preferences.theme === value
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

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="uz">O'zbek</option>
                  </select>
                </div>

                {/* Notifications */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3 font-primary">Notifications</label>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Email notifications', description: 'Receive updates via email' },
                      { key: 'push', label: 'Push notifications', description: 'Browser notifications' },
                      { key: 'marketing', label: 'Marketing emails', description: 'Product updates and tips' },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
                        <div>
                          <div className="font-medium text-secondary-900 font-primary">{label}</div>
                          <div className="text-sm text-secondary-600 font-primary">{description}</div>
                        </div>
                        <button
                          onClick={() => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              [key]: !preferences.notifications[key as keyof typeof preferences.notifications]
                            }
                          })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            preferences.notifications[key as keyof typeof preferences.notifications]
                              ? 'bg-primary-600'
                              : 'bg-secondary-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            preferences.notifications[key as keyof typeof preferences.notifications]
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200"
            >
              <h3 className="text-lg font-semibold text-secondary-900 mb-6 font-heading">Security</h3>

              <div className="space-y-4">
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-secondary-600" />
                    <div className="text-left">
                      <div className="font-medium text-secondary-900 font-primary">Change Password</div>
                      <div className="text-sm text-secondary-600 font-primary">Update your account password</div>
                    </div>
                  </div>
                  <Edit3 className="w-4 h-4 text-secondary-600" />
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-between p-4 bg-error-50 rounded-xl hover:bg-error-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-error-600" />
                    <div className="text-left">
                      <div className="font-medium text-error-900 font-primary">Delete Account</div>
                      <div className="text-sm text-error-600 font-primary">Permanently delete your account and data</div>
                    </div>
                  </div>
                  <AlertCircle className="w-4 h-4 text-error-600" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 font-heading">Change Password</h3>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordForm(false)}
                className="flex-1 px-4 py-3 text-secondary-700 bg-secondary-100 rounded-xl hover:bg-secondary-200 transition-colors font-medium font-primary"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                Update Password
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">Delete Account</h3>
              <p className="text-secondary-600 font-primary">
                This action cannot be undone. All your projects and data will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 text-secondary-700 bg-secondary-100 rounded-xl hover:bg-secondary-200 transition-colors font-medium font-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-error-600 text-white rounded-xl hover:bg-error-700 transition-colors font-medium font-primary"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;