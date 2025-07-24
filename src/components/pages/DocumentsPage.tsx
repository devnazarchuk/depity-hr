import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, Upload, Folder, Calendar, User } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  category: 'hr' | 'payroll' | 'benefits' | 'policies' | 'forms' | 'personal';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  isPrivate: boolean;
}

const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Mock documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Employee Handbook 2024',
      type: 'PDF',
      category: 'hr',
      size: '2.4 MB',
      uploadedBy: 'HR Team',
      uploadedAt: '2024-01-15T10:30:00Z',
      description: 'Complete guide to company policies and procedures',
      isPrivate: false
    },
    {
      id: '2',
      name: 'Pay Stub - January 2024',
      type: 'PDF',
      category: 'payroll',
      size: '156 KB',
      uploadedBy: 'Payroll System',
      uploadedAt: '2024-01-31T09:00:00Z',
      description: 'Monthly pay statement',
      isPrivate: true
    },
    {
      id: '3',
      name: 'Benefits Enrollment Form',
      type: 'PDF',
      category: 'benefits',
      size: '890 KB',
      uploadedBy: 'Sophia Williams',
      uploadedAt: '2024-01-10T14:20:00Z',
      description: 'Health insurance and benefits selection',
      isPrivate: true
    },
    {
      id: '4',
      name: 'Remote Work Policy',
      type: 'DOCX',
      category: 'policies',
      size: '245 KB',
      uploadedBy: 'HR Team',
      uploadedAt: '2024-01-08T11:15:00Z',
      description: 'Guidelines for remote work arrangements',
      isPrivate: false
    },
    {
      id: '5',
      name: 'Time Off Request Form',
      type: 'PDF',
      category: 'forms',
      size: '123 KB',
      uploadedBy: 'HR Team',
      uploadedAt: '2024-01-05T16:45:00Z',
      description: 'Template for requesting time off',
      isPrivate: false
    },
    {
      id: '6',
      name: 'Performance Review - Q4 2023',
      type: 'PDF',
      category: 'personal',
      size: '567 KB',
      uploadedBy: 'Manager',
      uploadedAt: '2023-12-20T13:30:00Z',
      description: 'Quarterly performance evaluation',
      isPrivate: true
    },
    {
      id: '7',
      name: 'Tax Documents - W2 2023',
      type: 'PDF',
      category: 'payroll',
      size: '234 KB',
      uploadedBy: 'Payroll System',
      uploadedAt: '2024-01-25T08:00:00Z',
      description: 'Annual tax statement',
      isPrivate: true
    },
    {
      id: '8',
      name: 'Code of Conduct',
      type: 'PDF',
      category: 'policies',
      size: '1.2 MB',
      uploadedBy: 'HR Team',
      uploadedAt: '2024-01-01T12:00:00Z',
      description: 'Company code of conduct and ethics',
      isPrivate: false
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || doc.category === categoryFilter;
    const matchesType = typeFilter === '' || doc.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr': return 'bg-blue-500';
      case 'payroll': return 'bg-green-500';
      case 'benefits': return 'bg-purple-500';
      case 'policies': return 'bg-amber-500';
      case 'forms': return 'bg-pink-500';
      case 'personal': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': case 'doc': return '📝';
      case 'xlsx': case 'xls': return '📊';
      case 'pptx': case 'ppt': return '📋';
      default: return '📄';
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
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const categories = [...new Set(documents.map(doc => doc.category))];
  const types = [...new Set(documents.map(doc => doc.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Documents
                </h1>
                <p className="text-sm sm:text-base text-gray-400 font-medium">Access your important documents and files</p>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2 text-sm sm:text-base">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{documents.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Total</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-xl">
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{documents.filter(d => d.isPrivate).length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Private</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <Folder className="w-4 h-4 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{categories.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Categories</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-white">
                    {documents.filter(d => {
                      const docDate = new Date(d.uploadedAt);
                      const today = new Date();
                      const diffTime = today.getTime() - docDate.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 30;
                    }).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Recent</div>
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
                placeholder="Search documents..."
                className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{capitalizeFirst(category)}</option>
                ))}
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white">Document Library</h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                  <FileText className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <p className="font-medium mb-2">No documents found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDocuments.map((document) => (
                <div key={document.id} className="p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      <div className="text-2xl sm:text-3xl">{getFileIcon(document.type)}</div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-300 transition-colors break-words">
                            {document.name}
                          </h3>
                          {document.isPrivate && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/30 w-fit">
                              Private
                            </span>
                          )}
                        </div>
                        
                        {document.description && (
                          <p className="text-gray-400 text-xs sm:text-sm mb-2 break-words">{document.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-lg text-white font-semibold ${getCategoryColor(document.category)}`}>
                            {capitalizeFirst(document.category)}
                          </span>
                          <span className="hidden sm:inline">{document.type}</span>
                          <span className="hidden sm:inline">{document.size}</span>
                          <span className="hidden lg:inline">Uploaded by {document.uploadedBy}</span>
                          <span>{formatDate(document.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2">
                      <button className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300" title="Preview">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300" title="Download">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;