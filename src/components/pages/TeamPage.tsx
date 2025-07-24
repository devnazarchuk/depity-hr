import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, MessageSquare, Github, Linkedin, MapPin, Calendar, Plus } from 'lucide-react';
import { User, getUsers } from '../../utils/storage';

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

const TeamPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: 'employee' as User['role']
  });

  // Array of high-quality avatar URLs for new members
  const avatarUrls = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  ];

  useEffect(() => {
    const allUsers = getUsers();
    setUsers(allUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || user.department === departmentFilter;
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Marketing': return 'bg-orange-500';
      case 'Product Management': return 'bg-purple-500';
      case 'Engineering': return 'bg-blue-500';
      case 'Design': return 'bg-pink-500';
      case 'HR': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'hr': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'employee': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const departments = [...new Set(users.map(user => user.department))];

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      alert('Please fill in both name and email');
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === newMember.email.toLowerCase())) {
      alert('A user with this email already exists');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      avatar: avatarUrls[Math.floor(Math.random() * avatarUrls.length)],
      department: newMember.department,
      role: newMember.role,
      joinDate: formatDateString(new Date()),
      socials: {
        slack: `@${newMember.name.toLowerCase().replace(' ', '.')}`
      }
    };

    // Add to users array
    setUsers(prev => [...prev, newUser]);
    
    // Reset form and close modal
    setNewMember({ name: '', email: '', department: 'Engineering', role: 'employee' });
    setShowAddMemberModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Team
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">Meet your colleagues and team members</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{users.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Total</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{users.filter(u => u.role === 'manager').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Managers</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{users.filter(u => u.role === 'employee').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Employees</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{departments.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Departments</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team members..."
                className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            
            <button 
              onClick={() => setShowAddMemberModal(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Roles</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
              
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                <Users className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="font-medium mb-2">No team members found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 group">
                {/* Profile Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all duration-300 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-gray-800 shadow-lg" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-purple-400 font-medium break-words">{user.department}</p>
                  
                  <span className={`px-2 sm:px-3 py-1 rounded-xl text-xs font-semibold border ${getRoleColor(user.role)}`}>
                    {capitalizeFirst(user.role)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300 break-all">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300">Joined {formatJoinDate(user.joinDate)}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 pt-3 sm:pt-4 border-t border-white/10">
                  {user.socials.slack && (
                    <button className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/btn">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                    </button>
                  )}
                  {user.socials.linkedin && (
                    <button className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/btn">
                      <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                    </button>
                  )}
                  {user.socials.github && (
                    <button className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/btn">
                      <Github className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowAddMemberModal(false)} />
              
              <div className="relative bg-gray-800 rounded-xl shadow-xl w-full max-w-lg transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Add Team Member</h2>
                  <button
                    onClick={() => setShowAddMemberModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                      <select
                        value={newMember.department}
                        onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Design">Design</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <select
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleAddMember}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => setShowAddMemberModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;