import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Plus,
  Mail,
  Crown,
  Edit3,
  Eye,
  Trash2,
  Settings,
  UserPlus,
  Send,
  Copy,
  Check,
  X,
  Clock,
  Shield,
  Star,
  Zap,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Search,
  Filter,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Calendar,
  Activity,
  MessageSquare,
  Bell,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'designer' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: Date;
  lastActive: Date;
  permissions: string[];
  projects: string[];
}

interface TeamInvite {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'designer' | 'viewer';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  message?: string;
}

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'settings'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Check subscription
  const userSubscription = optimizedStorage.getUserSubscription();
  const isPro = userSubscription?.plan === 'pro' || userSubscription?.plan === 'enterprise';

  // Mock data - in a real app, this would come from your backend
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(),
      permissions: ['all'],
      projects: ['project-1', 'project-2', 'project-3'],
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@company.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-01-20'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      permissions: ['manage_projects', 'invite_members', 'edit_content'],
      projects: ['project-1', 'project-2'],
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@company.com',
      avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      role: 'designer',
      status: 'active',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      permissions: ['edit_design', 'view_projects'],
      projects: ['project-1'],
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@company.com',
      role: 'editor',
      status: 'pending',
      joinedAt: new Date('2024-02-10'),
      lastActive: new Date('2024-02-10'),
      permissions: ['edit_content', 'view_projects'],
      projects: [],
    },
  ]);

  const [pendingInvites] = useState<TeamInvite[]>([
    {
      id: '1',
      email: 'john@company.com',
      role: 'editor',
      invitedBy: 'Sarah Johnson',
      invitedAt: new Date('2024-02-15'),
      expiresAt: new Date('2024-02-22'),
      status: 'pending',
      message: 'Welcome to our design team! Looking forward to collaborating with you.',
    },
    {
      id: '2',
      email: 'lisa@company.com',
      role: 'viewer',
      invitedBy: 'Michael Chen',
      invitedAt: new Date('2024-02-14'),
      expiresAt: new Date('2024-02-21'),
      status: 'pending',
    },
  ]);

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'editor' as 'admin' | 'editor' | 'designer' | 'viewer',
    message: '',
    projects: [] as string[],
  });

  const roles = [
    {
      id: 'owner',
      name: 'Owner',
      description: 'Full access to everything including billing and team management',
      icon: Crown,
      color: 'text-purple-600 bg-purple-100',
      permissions: ['All permissions'],
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage team members, projects, and most settings',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100',
      permissions: ['Manage projects', 'Invite members', 'Edit content', 'View analytics'],
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Edit content and manage assigned projects',
      icon: Edit3,
      color: 'text-green-600 bg-green-100',
      permissions: ['Edit content', 'View projects', 'Export projects'],
    },
    {
      id: 'designer',
      name: 'Designer',
      description: 'Focus on design and visual elements',
      icon: Star,
      color: 'text-orange-600 bg-orange-100',
      permissions: ['Edit design', 'View projects', 'Access design tools'],
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'View projects and provide feedback',
      icon: Eye,
      color: 'text-gray-600 bg-gray-100',
      permissions: ['View projects', 'Add comments'],
    },
  ];

  const handleInviteMember = () => {
    if (!inviteForm.email) {
      alert('Please enter an email address');
      return;
    }

    // In a real app, this would send an API request
    alert(`Invitation sent to ${inviteForm.email} as ${inviteForm.role}`);
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'editor', message: '', projects: [] });
  };

  const handleCopyInviteLink = (inviteId: string) => {
    const link = `${window.location.origin}/invite/${inviteId}`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied to clipboard!');
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      // In a real app, this would send an API request
      alert('Team member removed successfully');
    }
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    // In a real app, this would send an API request
    alert(`Role changed to ${newRole}`);
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-success-100 text-success-700 border-success-200',
      pending: 'bg-warning-100 text-warning-700 border-warning-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    
    const icons = {
      active: CheckCircle,
      pending: Clock,
      inactive: UserX,
    };
    
    const IconComponent = icons[status as keyof typeof icons];
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.id === role);
    if (!roleData) return Users;
    return roleData.icon;
  };

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.id === role);
    return roleData?.color || 'text-gray-600 bg-gray-100';
  };

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-secondary-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-secondary-900 font-heading">Team Collaboration</h1>
                    <p className="text-sm text-secondary-600 font-primary">Pro feature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Prompt */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Users className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning-400 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-secondary-900 mb-4 font-heading">
              Team Collaboration
            </h2>
            <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto font-primary">
              Collaborate with your team in real-time. Invite members, assign roles, and build amazing websites together.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: UserPlus,
                  title: 'Invite Team Members',
                  description: 'Add designers, editors, and viewers to your projects',
                },
                {
                  icon: Shield,
                  title: 'Role-Based Access',
                  description: 'Control what each team member can see and edit',
                },
                {
                  icon: Activity,
                  title: 'Real-Time Collaboration',
                  description: 'Work together simultaneously on the same project',
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-2xl shadow-soft border border-secondary-200"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">{title}</h3>
                  <p className="text-secondary-600 font-primary">{description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/billing')}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg text-lg font-heading"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-colors font-semibold font-primary"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900 font-heading">Team Collaboration</h1>
                  <p className="text-sm text-secondary-600 font-primary">{teamMembers.length} members</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-secondary-100 rounded-xl p-1 mb-8">
          {[
            { id: 'members', label: 'Team Members', icon: Users },
            { id: 'invites', label: 'Pending Invites', icon: Mail },
            { id: 'settings', label: 'Team Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Team Members Tab */}
        {activeTab === 'members' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Members List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200 hover:shadow-medium transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            member.status === 'active' ? 'bg-success-500' : 
                            member.status === 'pending' ? 'bg-warning-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900 font-primary">{member.name}</h3>
                          <p className="text-sm text-secondary-600 font-primary">{member.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(member.status)}
                        <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-secondary-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getRoleColor(member.role)}`}>
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-secondary-900 font-primary">
                        {roles.find(r => r.id === member.role)?.name}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-secondary-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-primary">Joined {member.joinedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span className="font-primary">
                          Last active {member.lastActive.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-primary">{member.projects.length} projects</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowMemberDetails(member.id)}
                        className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium font-primary"
                      >
                        View Details
                      </button>
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="px-3 py-2 bg-error-50 text-error-600 rounded-lg hover:bg-error-100 transition-colors font-medium font-primary"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Pending Invites Tab */}
        {activeTab === 'invites' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-200">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="text-lg font-semibold text-secondary-900 font-heading">Pending Invitations</h2>
                <p className="text-secondary-600 font-primary">Manage sent invitations and their status</p>
              </div>

              <div className="divide-y divide-secondary-200">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900 font-primary">{invite.email}</div>
                        <div className="text-sm text-secondary-600 font-primary">
                          Invited as {invite.role} by {invite.invitedBy}
                        </div>
                        <div className="text-xs text-secondary-500 font-primary">
                          Expires {invite.expiresAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invite.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                        invite.status === 'accepted' ? 'bg-success-100 text-success-700' :
                        'bg-error-100 text-error-700'
                      }`}>
                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                      </div>
                      
                      <button
                        onClick={() => handleCopyInviteLink(invite.id)}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                        title="Copy invite link"
                      >
                        <Copy className="w-4 h-4 text-secondary-600" />
                      </button>
                      
                      <button
                        onClick={() => {
                          if (window.confirm('Cancel this invitation?')) {
                            alert('Invitation cancelled');
                          }
                        }}
                        className="p-2 hover:bg-error-100 rounded-lg transition-colors"
                        title="Cancel invitation"
                      >
                        <X className="w-4 h-4 text-error-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pendingInvites.length === 0 && (
                <div className="p-12 text-center">
                  <Mail className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">No pending invites</h3>
                  <p className="text-secondary-600 font-primary">All invitations have been accepted or expired.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Team Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6 font-heading">Team Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                  <div>
                    <div className="font-medium text-secondary-900 font-primary">Allow team members to invite others</div>
                    <div className="text-sm text-secondary-600 font-primary">Let admins and editors send invitations</div>
                  </div>
                  <button className="w-12 h-6 bg-primary-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                  <div>
                    <div className="font-medium text-secondary-900 font-primary">Require approval for new members</div>
                    <div className="text-sm text-secondary-600 font-primary">Owner must approve all new team members</div>
                  </div>
                  <button className="w-12 h-6 bg-secondary-300 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl">
                  <div>
                    <div className="font-medium text-secondary-900 font-primary">Enable real-time collaboration</div>
                    <div className="text-sm text-secondary-600 font-primary">Allow simultaneous editing of projects</div>
                  </div>
                  <button className="w-12 h-6 bg-primary-600 rounded-full">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 font-heading">Role Permissions</h3>
              
              <div className="space-y-4">
                {roles.slice(1).map((role) => {
                  const Icon = role.icon;
                  return (
                    <div key={role.id} className="p-4 border border-secondary-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-secondary-900 font-primary">{role.name}</div>
                          <div className="text-sm text-secondary-600 font-primary">{role.description}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium font-primary"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 font-heading">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Email Address</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-primary"
                >
                  {roles.slice(1, -1).map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2 font-primary">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Welcome to our team! Looking forward to working with you."
                  rows={3}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-3 text-secondary-700 bg-secondary-100 rounded-xl hover:bg-secondary-200 transition-colors font-medium font-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                Send Invite
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Team;