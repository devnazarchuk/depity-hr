'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, MoreHorizontal, Download, Edit, Trash2 } from 'lucide-react';
import { Document, useApp } from '@/contexts/AppContext';

interface DocumentListProps {
  documents: Document[];
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DocumentList({ documents }: DocumentListProps) {
  const { deleteDocument, downloadDocument, renameDocument, hasPermission } = useApp();
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; document: Document | null; newName: string }>({
    isOpen: false,
    document: null,
    newName: ''
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  const handleDownload = (id: string) => {
    downloadDocument(id);
  };

  const handleRename = (document: Document) => {
    setRenameModal({
      isOpen: true,
      document,
      newName: document.name
    });
  };

  const handleRenameSubmit = () => {
    if (renameModal.document && renameModal.newName.trim()) {
      renameDocument(renameModal.document.id, renameModal.newName.trim());
      setRenameModal({ isOpen: false, document: null, newName: '' });
    }
  };

  return (
    <>
    <div className="space-y-2">
      {documents.map((document) => (
        <Card key={document.id} className="hover:shadow-sm transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">{document.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(document.size)} • Uploaded by {document.uploadedBy}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(document.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                      {hasPermission('documents_upload') && (
                        <DropdownMenuItem onClick={() => handleRename(document)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                      )}
                      {hasPermission('documents_delete') && (
                    <DropdownMenuItem 
                      onClick={() => handleDelete(document.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

      {/* Rename Modal */}
      <Dialog open={renameModal.isOpen} onOpenChange={(open) => !open && setRenameModal({ isOpen: false, document: null, newName: '' })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for the document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                placeholder="Enter new name..."
                value={renameModal.newName}
                onChange={(e) => setRenameModal(prev => ({ ...prev, newName: e.target.value }))}
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRenameModal({ isOpen: false, document: null, newName: '' })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRenameSubmit}
              disabled={!renameModal.newName.trim()}
            >
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}