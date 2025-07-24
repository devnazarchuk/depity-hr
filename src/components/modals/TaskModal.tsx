import React from 'react';
import Modal from './Modal';
import TaskForm from '../forms/TaskForm';
import { Task } from '../../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSubmit: (task: Task) => void;
  existingTags?: string[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSubmit,
  existingTags
}) => {
  const handleSubmit = (taskData: Task) => {
    onSubmit(taskData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <TaskForm
        task={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
        existingTags={existingTags}
      />
    </Modal>
  );
};

export default TaskModal;