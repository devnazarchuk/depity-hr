'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Folder, MoreHorizontal, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Folder as FolderType, useApp } from '@/contexts/AppContext';

interface FolderCardProps {
  folder: FolderType;
  onOpen: (folder: FolderType) => void;
}

export function FolderCard({ folder, onOpen }: FolderCardProps) {
  const { deleteFolder } = useApp();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this folder and all its contents?')) {
      deleteFolder(folder.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-center space-x-3 flex-1" 
            onClick={() => onOpen(folder)}
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{folder.name}</h3>
              <p className="text-sm text-muted-foreground">
                {folder.documentsCount} {folder.documentsCount === 1 ? 'file' : 'files'}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(folder)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>By {folder.owner}</span>
          <span>{new Date(folder.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}