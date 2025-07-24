import React, { useState } from 'react';
import { FolderOpen, Plus, Search, Filter, Calendar, Users, BarChart3, Clock, Trash2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  progress: number;
  team: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  department: string;
}

const ProjectsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    department: 'Engineering',
    priority: 'medium' as Project['priority'],
    dueDate: ''
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Design System Overhaul',
      description: 'Complete redesign of the company design system with new components and guidelines',
      status: 'active',
      progress: 75,
      team: ['Emma Wright', 'Sophia Williams', 'Laura Perez'],
      dueDate: '2024-03-15',
      priority: 'high',
      department: 'Design'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      status: 'active',
      progress: 45,
      team: ['Arthur Taylor', 'James Brown'],
      dueDate: '2024-04-30',
      priority: 'high',
      department: 'Engineering'
    },
    {
      id: '3',
      name: 'Marketing Campaign Q1',
      description: 'Comprehensive marketing campaign for Q1 product launch',
      status: 'completed',
      progress: 100,
      team: ['James Brown', 'Sophia Williams'],
      dueDate: '2024-01-31',
      priority: 'medium',
      department: 'Marketing'
    },
    {
      id: '4',
      name: 'User Research Initiative',
      description: 'In-depth user research to improve product experience',
      status: 'planning',
      progress: 15,
      team: ['Laura Perez', 'Emma Wright'],
      dueDate: '2024-05-15',
      priority: 'medium',
      department: 'Product'
    },
    {
      id: '5',
      name: 'Infrastructure Upgrade',
      description: 'Modernize server infrastructure and improve scalability',
      status: 'on-hold',
      progress: 30,
      team: ['Arthur Taylor'],
      dueDate: '2024-06-01',
      priority: 'low',
      department: 'Engineering'
    }
  ]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || project.status === statusFilter;
    const matchesDepartment = departmentFilter === '' || project.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'on-hold': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Marketing': return 'bg-orange-500';
      case 'Product': return 'bg-purple-500';
      case 'Engineering': return 'bg-blue-500';
      case 'Design': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
  };

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.description.trim() || !newProject.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      progress: 0,
      team: [],
      dueDate: newProject.dueDate,
      priority: newProject.priority,
      department: newProject.department
    };

    setProjects(prev => [...prev, project]);
    setShowNewProjectModal(false);
    setNewProject({
      name: '',
      description: '',
      department: 'Engineering',
      priority: 'medium',
      dueDate: ''
    });
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(project => project.id !== projectId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Projects
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">Manage and track project progress</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{projects.filter(p => p.status === 'active').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Active</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <FolderOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{projects.filter(p => p.status === 'completed').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{projects.filter(p => p.status === 'on-hold').length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">On Hold</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{new Set(projects.flatMap(p => p.team)).size}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Members</div>
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
                placeholder="Search projects..."
                className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="planning">Planning</option>
              </select>
              
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                <FolderOpen className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="font-medium mb-2">No projects found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors break-words">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 break-words">{project.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)} shadow-lg`} />
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-gray-400">Progress</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Status and Department */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-xl text-xs font-semibold border ${getStatusColor(project.status)}`}>
                    {capitalizeFirst(project.status)}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 rounded-xl text-xs font-semibold text-white ${getDepartmentColor(project.department)}`}>
                    {project.department}
                  </span>
                </div>

                {/* Team and Due Date */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-400">
                      {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-400">Due {formatDate(project.dueDate)}</span>
                  </div>
                </div>

                {/* Team Avatars */}
                <div className="flex items-center space-x-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-800"
                        title={member}
                      >
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-800">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowNewProjectModal(false)} />
              
              <div className="relative bg-gray-800 rounded-xl shadow-xl w-full max-w-lg transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Create New Project</h2>
                  <button
                    onClick={() => setShowNewProjectModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter project name..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the project..."
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                      <select
                        value={newProject.department}
                        onChange={(e) => setNewProject(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                      <select
                        value={newProject.priority}
                        onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as Project['priority'] }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min={(() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = String(today.getMonth() + 1).padStart(2, '0');
                  const day = String(today.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                })()}
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleCreateProject}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Create Project
                    </button>
                    <button
                      onClick={() => setShowNewProjectModal(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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

export default ProjectsPage;