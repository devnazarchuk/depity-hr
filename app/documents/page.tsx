'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { FolderCard } from '@/components/documents/FolderCard';
import { DocumentList } from '@/components/documents/DocumentList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  FolderPlus, 
  Search, 
  ArrowLeft,
  Grid3x3,
  List
} from 'lucide-react';
import { useApp, Folder } from '@/contexts/AppContext';

export default function DocumentsPage() {
  const { folders, documents, addFolder, addDocument } = useApp();
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentFolders = folders.filter(folder => 
    folder.parentId === (currentFolder?.id || null)
  );

  const currentDocuments = documents.filter(doc => 
    doc.folderId === (currentFolder?.id || 'root')
  );

  const filteredFolders = currentFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = currentDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        addDocument({
          name: file.name,
          type: file.type,
          size: file.size,
          folderId: currentFolder?.id || 'root',
          uploadedBy: 'Current User',
          uploadedAt: new Date().toISOString(),
          url: '#'
        });
      });
    }
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      addFolder({
        name,
        parentId: currentFolder?.id || null,
        owner: 'Current User',
        createdAt: new Date().toISOString()
      });
    }
  };

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
            <Button onClick={handleCreateFolder} variant="outline">
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
        <div className="space-y-6">
          {/* Folders */}
          {!currentFolder && filteredFolders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Folders</h2>
              <div className={viewMode === 'grid' 
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-2"
              }>
                {filteredFolders.map((folder) => (
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
          {filteredDocuments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {currentFolder ? 'Files' : 'Recent Files'}
              </h2>
              <DocumentList documents={filteredDocuments} />
            </div>
          )}

          {/* Empty State */}
          {filteredFolders.length === 0 && filteredDocuments.length === 0 && (
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
                <div className="flex justify-center space-x-2">
                  <Button onClick={handleCreateFolder} variant="outline">
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}