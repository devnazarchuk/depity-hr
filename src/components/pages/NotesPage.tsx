import React, { useState } from 'react';
import { StickyNote, Plus, Search, Filter, Edit, Trash2, Pin, Calendar } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
}

const NotesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'ideas',
    color: 'yellow'
  });

  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Meeting Notes - Q1 Planning',
      content: 'Discussed quarterly goals and objectives. Key points: increase user engagement by 25%, launch new feature set, improve customer satisfaction scores.',
      category: 'meetings',
      isPinned: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      color: 'yellow'
    },
    {
      id: '2',
      title: 'Design System Guidelines',
      content: 'Color palette updates: Primary blue #3B82F6, Secondary purple #8B5CF6. Typography: Inter for headings, system fonts for body text.',
      category: 'design',
      isPinned: false,
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-14T14:20:00Z',
      color: 'blue'
    },
    {
      id: '3',
      title: 'Project Ideas',
      content: 'Mobile app redesign, user onboarding flow improvement, dark mode implementation, accessibility audit.',
      category: 'ideas',
      isPinned: true,
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      color: 'green'
    },
    {
      id: '4',
      title: 'Code Review Checklist',
      content: 'Check for: proper error handling, code documentation, test coverage, performance implications, security considerations.',
      category: 'development',
      isPinned: false,
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      color: 'purple'
    },
    {
      id: '5',
      title: 'Team Feedback',
      content: 'Positive feedback on new collaboration tools. Suggestions: better notification system, improved file sharing, more integration options.',
      category: 'feedback',
      isPinned: false,
      createdAt: '2024-01-11T11:30:00Z',
      updatedAt: '2024-01-11T11:30:00Z',
      color: 'pink'
    }
  ]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || note.category === categoryFilter;
    const matchesPinned = !showPinnedOnly || note.isPinned;
    
    return matchesSearch && matchesCategory && matchesPinned;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40';
      case 'blue': return 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40';
      case 'green': return 'bg-green-500/10 border-green-500/20 hover:border-green-500/40';
      case 'purple': return 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40';
      case 'pink': return 'bg-pink-500/10 border-pink-500/20 hover:border-pink-500/40';
      default: return 'bg-gray-500/10 border-gray-500/20 hover:border-gray-500/40';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meetings': return 'bg-blue-500';
      case 'design': return 'bg-pink-500';
      case 'ideas': return 'bg-green-500';
      case 'development': return 'bg-purple-500';
      case 'feedback': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: newNote.color
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', category: 'ideas', color: 'yellow' });
    setShowNewNoteModal(false);
  };

  const togglePin = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const deleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  const categories = [...new Set(notes.map(note => note.category))];
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 p-4 sm:p-6 lg:p-8 bg-fixed">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <StickyNote className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Notes
                </h1>
                <p className="text-gray-400 font-medium">Capture and organize your thoughts</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowNewNoteModal(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Note</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <StickyNote className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{notes.length}</div>
                  <div className="text-sm text-gray-400">Total Notes</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Pin className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{notes.filter(n => n.isPinned).length}</div>
                  <div className="text-sm text-gray-400">Pinned</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Filter className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{categories.length}</div>
                  <div className="text-sm text-gray-400">Categories</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {notes.filter(n => {
                      const noteDate = new Date(n.createdAt);
                      const today = new Date();
                      return noteDate.toDateString() === today.toDateString();
                    }).length}
                  </div>
                  <div className="text-sm text-gray-400">Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-white/5 backdrop-blur-sm rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{capitalizeFirst(category)}</option>
                ))}
              </select>
              
              <label className="flex items-center space-x-3 cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                <input
                  type="checkbox"
                  checked={showPinnedOnly}
                  onChange={(e) => setShowPinnedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-white text-sm font-medium">Pinned only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="space-y-8">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && !showPinnedOnly && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Pin className="w-5 h-5 text-amber-400" />
                <span>Pinned Notes</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pinnedNotes.map((note) => (
                  <div key={note.id} className={`backdrop-blur-xl rounded-2xl p-6 border shadow-2xl transition-all duration-300 group ${getColorClasses(note.color)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors break-words">
                        {note.title}
                      </h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => togglePin(note.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-amber-400 transition-all duration-300"
                          title="Unpin note"
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 break-words">
                      {note.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold text-white ${getCategoryColor(note.category)}`}>
                        {capitalizeFirst(note.category)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {unpinnedNotes.length > 0 && (
            <div>
              {!showPinnedOnly && pinnedNotes.length > 0 && (
                <h2 className="text-xl font-bold text-white mb-4">All Notes</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(showPinnedOnly ? pinnedNotes : unpinnedNotes).map((note) => (
                  <div key={note.id} className={`backdrop-blur-xl rounded-2xl p-6 border shadow-2xl transition-all duration-300 group ${getColorClasses(note.color)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors break-words">
                        {note.title}
                      </h3>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => togglePin(note.id)}
                          className={`p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 ${note.isPinned ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'}`}
                          title={note.isPinned ? 'Unpin note' : 'Pin note'}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 break-words">
                      {note.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold text-white ${getCategoryColor(note.category)}`}>
                        {capitalizeFirst(note.category)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                <StickyNote className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="font-medium mb-2">No notes found</p>
              <p className="text-sm">Try adjusting your search or create a new note</p>
            </div>
          )}
        </div>

        {/* New Note Modal */}
        {showNewNoteModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowNewNoteModal(false)} />
              
              <div className="relative bg-gray-800 rounded-xl shadow-xl w-full max-w-lg transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Create New Note</h2>
                  <button
                    onClick={() => setShowNewNoteModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter note title..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your note content..."
                      rows={4}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select
                        value={newNote.category}
                        onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="ideas">Ideas</option>
                        <option value="meetings">Meetings</option>
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                      <select
                        value={newNote.color}
                        onChange={(e) => setNewNote(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="yellow">Yellow</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="pink">Pink</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleCreateNote}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Create Note
                    </button>
                    <button
                      onClick={() => setShowNewNoteModal(false)}
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

export default NotesPage;