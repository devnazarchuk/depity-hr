'use client';

import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { FolderCard } from '@/components/documents/FolderCard';
import { DocumentList } from '@/components/documents/DocumentList';
import { CreateFolderModal } from '@/components/documents/CreateFolderModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  FolderPlus, 
  Search, 
  ArrowLeft,
  Grid3x3,
  List,
  FileText,
  HardDrive
} from 'lucide-react';
import { useApp, Folder } from '@/contexts/AppContext';

export default function DocumentsPage() {
  const { 
    folders, 
    documents, 
    addFolder, 
    addDocument, 
    currentUser, 
    hasPermission,
    getDocumentsForRole,
    getUsersForRole,
    canAccessDocument
  } = useApp();
  
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Get role-filtered data
  const roleFilteredDocuments = getDocumentsForRole();
  const roleFilteredUsers = getUsersForRole();

  const currentFolders = folders.filter(folder => 
    folder.parentId === (currentFolder?.id || null)
  );

  // Filter documents based on current folder and role permissions
  const currentDocuments = roleFilteredDocuments.filter(doc => 
    doc.folderId === (currentFolder?.id || 'root')
  );

  const filteredFolders = currentFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = currentDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user can upload documents
  const canUpload = hasPermission('documents_upload') || 
                   hasPermission('documents_upload_team');

  // Check if user can create folders
  const canCreateFolders = hasPermission('documents_manage_folders');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUpload) return;
    
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        addDocument({
          name: file.name,
          type: file.type,
          size: file.size,
          folderId: currentFolder?.id || 'root',
          uploadedBy: currentUser?.name || 'Unknown User',
          uploadedAt: new Date().toISOString(),
          url: '#'
        });
      });
    }
  };

  const handleCreateFolder = (name: string) => {
    if (!canCreateFolders) return;
    
    addFolder({
      name,
      parentId: currentFolder?.id || null,
      owner: currentUser?.name || 'Unknown User',
      createdAt: new Date().toISOString()
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!canUpload) return;
    e.preventDefault();
    setDragOver(true);
  }, [canUpload]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!canUpload) return;
    
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      addDocument({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        folderId: currentFolder?.id || 'root',
        uploadedBy: currentUser?.name || 'Unknown User',
        uploadedAt: new Date().toISOString(),
        url: '#'
      });
    });
  }, [addDocument, currentFolder, currentUser, canUpload]);

  // Sort and filter documents
  const sortedAndFilteredDocuments = currentDocuments
    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const sortedAndFilteredFolders = currentFolders
    .filter(folder => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            {currentFolder && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentFolder(null)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {currentFolder ? currentFolder.name : 'Documents'}
              </h1>
              <p className="text-muted-foreground">
                {currentFolder 
                  ? `Files in ${currentFolder.name}` 
                  : 'Organize and manage your documents'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {canUpload && (
              <>
                <Button onClick={() => setShowCreateFolderModal(true)} variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
              </>
            )}
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={(value: 'name' | 'size' | 'date') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
            
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div 
          className={`space-y-6 min-h-[400px] ${dragOver ? 'border-2 border-dashed border-primary bg-primary/5' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Folders */}
          {!currentFolder && sortedAndFilteredFolders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <HardDrive className="mr-2 h-5 w-5" />
                Folders ({sortedAndFilteredFolders.length})
              </h2>
              <div className={viewMode === 'grid' 
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-2"
              }>
                {sortedAndFilteredFolders.map((folder) => (
                  <FolderCard 
                    key={folder.id} 
                    folder={folder} 
                    onOpen={setCurrentFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {sortedAndFilteredDocuments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {currentFolder ? 'Files' : 'Recent Files'} ({sortedAndFilteredDocuments.length})
              </h2>
              <DocumentList documents={sortedAndFilteredDocuments} />
            </div>
          )}

          {/* Empty State */}
          {sortedAndFilteredFolders.length === 0 && sortedAndFilteredDocuments.length === 0 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No documents found</CardTitle>
                <CardDescription>
                  {searchTerm 
                    ? 'Try adjusting your search criteria'
                    : 'Start by creating folders or uploading files'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {canUpload && (
                <div className="flex justify-center space-x-2">
                    <Button onClick={() => setShowCreateFolderModal(true)} variant="outline">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Folder
                  </Button>
                  <label htmlFor="file-upload-empty">
                    <Button asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload-empty"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Folder Modal */}
        <CreateFolderModal
          isOpen={showCreateFolderModal}
          onClose={() => setShowCreateFolderModal(false)}
          onCreateFolder={handleCreateFolder}
          parentFolderId={currentFolder?.id || null}
        />

        {/* Info for limited permissions */}
        {!canUpload && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Note:</strong> You can view documents but cannot upload or delete files. 
              Contact HR or Admin for file management.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}