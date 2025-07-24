import React, { useState, useEffect } from 'react';
import { User, Edit, Camera, MapPin, Calendar, Mail, Phone, Linkedin, Github, MessageSquare, Award, Clock, TrendingUp } from 'lucide-react';
import { getCurrentUser, User as UserType } from '../../utils/storage';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-8 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const stats = [
    { label: 'Years at Company', value: '2.5', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Projects Completed', value: '24', icon: Award, color: 'bg-green-500' },
    { label: 'Team Members', value: '8', icon: User, color: 'bg-purple-500' },
    { label: 'Hours This Month', value: '156', icon: Clock, color: 'bg-amber-500' }
  ];

  const achievements = [
    { title: 'Team Player', description: 'Collaborated on 10+ cross-team projects', icon: '🤝', date: '2024-01-15' },
    { title: 'Innovation Leader', description: 'Led 3 successful product initiatives', icon: '💡', date: '2023-12-10' },
    { title: 'Mentor', description: 'Mentored 5 junior team members', icon: '🎓', date: '2023-11-20' },
    { title: 'Problem Solver', description: 'Resolved 50+ critical issues', icon: '🔧', date: '2023-10-05' }
  ];

  const recentActivity = [
    { action: 'Completed project milestone', time: '2 hours ago', type: 'project' },
    { action: 'Attended team meeting', time: '1 day ago', type: 'meeting' },
    { action: 'Submitted time off request', time: '3 days ago', type: 'timeoff' },
    { action: 'Updated profile information', time: '1 week ago', type: 'profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
              <User className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="text-gray-400 font-medium">Manage your personal information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full ring-4 ring-purple-500/30 mx-auto object-cover"
                  />
                  <button className="absolute bottom-2 right-2 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
                <p className="text-purple-400 font-medium break-words">{user.department}</p>
                <p className="text-gray-400 text-sm capitalize">{user.role}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm break-all">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-3 mb-6">
                {user.socials.slack && (
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                )}
                {user.socials.linkedin && (
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                )}
                {user.socials.github && (
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <Github className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${stat.color}/20`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                    <div className="px-3 py-1 bg-gray-700 rounded-lg">
                      <span className="text-xs text-gray-300 capitalize">{activity.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-4 bg-green-500/20 rounded-2xl w-fit mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-gray-400">Goal Achievement</div>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-blue-500/20 rounded-2xl w-fit mx-auto mb-4">
                    <Award className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">4.8</div>
                  <div className="text-sm text-gray-400">Performance Rating</div>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-purple-500/20 rounded-2xl w-fit mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">Team Collaborations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;