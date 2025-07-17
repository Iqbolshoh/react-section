import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  X,
  User,
  Settings,
  CreditCard,
  Users,
  Palette,
  LogOut,
  Bell,
  Search,
  Plus,
  ChevronDown,
  Home,
  Sparkles,
  Crown,
  Zap,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';

interface HeaderProps {
  showSearch?: boolean;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = false,
  showCreateButton = true,
  onCreateClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load user data
  const userData = optimizedStorage.getUser();
  const userSubscription = optimizedStorage.getUserSubscription();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Your projects overview'
    },
    {
      id: 'templates',
      label: 'Templates',
      path: '/templates',
      icon: Palette,
      description: 'Browse template gallery'
    },
    {
      id: 'team',
      label: 'Team',
      path: '/team',
      icon: Users,
      description: 'Collaborate with team',
      isPro: true
    },
    {
      id: 'billing',
      label: 'Billing',
      path: '/billing',
      icon: CreditCard,
      description: 'Manage subscription'
    },
  ];

  const userMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      path: '/profile',
      icon: User,
      description: 'Manage your account'
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'App preferences'
    },
    {
      id: 'billing',
      label: 'Billing',
      path: '/billing',
      icon: CreditCard,
      description: 'Subscription & payments'
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getSubscriptionBadge = () => {
    const plan = userSubscription?.plan || 'free';
    const colors = {
      free: 'bg-gray-100 text-gray-700',
      pro: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      enterprise: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    };

    const icons = {
      free: Sparkles,
      pro: Zap,
      enterprise: Crown,
    };

    const IconComponent = icons[plan as keyof typeof icons];

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors[plan as keyof typeof colors]}`}>
        <IconComponent className="w-3 h-3" />
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </div>
    );
  };

  const handleLogout = () => {
    // In a real app, this would handle logout
    optimizedStorage.clearAll();
    navigate('/dashboard');
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo & Brand */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-medium"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Layout className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-heading">
                  Templates.uz
                </h1>
                <p className="text-xs lg:text-sm text-secondary-500 font-medium font-primary">
                  Mobile Website Builder
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all group ${isActive
                        ? 'bg-primary-50 text-primary-700 shadow-soft'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-primary">{item.label}</span>

                    {item.isPro && userSubscription?.plan === 'free' && (
                      <Crown className="w-3 h-3 text-warning-500" />
                    )}

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-100 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>

            {/* Search Bar (Desktop) */}
            {showSearch && (
              <div className="hidden lg:block flex-1 max-w-md mx-8">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search projects, templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 backdrop-blur-sm font-primary text-sm"
                  />
                </div>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Create Button */}
              {showCreateButton && (
                <motion.button
                  onClick={onCreateClick || (() => navigate('/dashboard'))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-glow transition-all duration-200 font-semibold shadow-medium font-heading text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline">New Site</span>
                  <span className="lg:hidden">New</span>
                </motion.button>
              )}

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowNotifications(!showNotifications)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-all duration-200 shadow-medium relative"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse"></div>
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-hard border border-secondary-200 py-4 z-50"
                    >
                      <div className="px-4 pb-3 border-b border-secondary-200">
                        <h3 className="font-semibold text-secondary-900 font-heading">Notifications</h3>
                      </div>
                      <div className="p-4 text-center text-secondary-600">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-secondary-400" />
                        <p className="font-primary">No new notifications</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-2 hover:bg-secondary-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-white shadow-medium"
                      />
                    ) : (
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-medium">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <div className="font-medium text-secondary-900 font-primary text-sm">
                        {userData?.name || 'User'}
                      </div>
                      <div className="flex items-center gap-2">
                        {getSubscriptionBadge()}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary-600 hidden lg:block" />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-hard border border-secondary-200 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-secondary-200">
                        <div className="font-medium text-secondary-900 font-primary">
                          {userData?.name || 'User'}
                        </div>
                        <div className="text-sm text-secondary-600 font-primary">
                          {userData?.email || 'user@templates.uz'}
                        </div>
                        <div className="mt-2">
                          {getSubscriptionBadge()}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                navigate(item.path);
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left text-secondary-700 hover:bg-secondary-50 transition-colors font-primary"
                            >
                              <IconComponent className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-secondary-500">{item.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-secondary-200 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-error-600 hover:bg-error-50 transition-colors font-primary"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2.5 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-all duration-200 shadow-medium"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="lg:hidden pb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search projects, templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90 backdrop-blur-sm font-primary"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-hard z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                      <Layout className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-secondary-900 font-heading">Templates.uz</h2>
                      <p className="text-xs text-secondary-500 font-primary">Mobile Builder</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-secondary-600" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2 mb-8">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = isActivePath(item.path);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                          }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-primary">{item.label}</div>
                          <div className="text-xs text-secondary-500 font-primary">{item.description}</div>
                        </div>
                        {item.isPro && userSubscription?.plan === 'free' && (
                          <Crown className="w-4 h-4 text-warning-500" />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Mobile Create Button */}
                {showCreateButton && (
                  <button
                    onClick={() => {
                      if (onCreateClick) onCreateClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-medium font-heading mb-6"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Site
                  </button>
                )}

                {/* Mobile User Section */}
                <div className="border-t border-secondary-200 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-medium"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-medium">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-secondary-900 font-primary">
                        {userData?.name || 'User'}
                      </div>
                      <div className="text-sm text-secondary-600 font-primary">
                        {userData?.email || 'user@templates.uz'}
                      </div>
                      <div className="mt-1">
                        {getSubscriptionBadge()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {userMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (

                        <button
                          key={item.id}
                          onClick={() => {
                            navigate(item.path);
                            setShowMobileMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors font-primary"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-error-600 hover:bg-error-50 rounded-lg transition-colors font-primary"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handlers */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default Header;