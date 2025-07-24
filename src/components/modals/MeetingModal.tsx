import React from 'react';
import Modal from './Modal';
import MeetingForm from '../forms/MeetingForm';
import { Meeting } from '../../types/meeting';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting?: Meeting;
  onSubmit: (meeting: Meeting) => void;
  selectedDate?: string;
}

const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  meeting,
  onSubmit,
  selectedDate
}) => {
  const handleSubmit = (meetingData: Meeting) => {
    onSubmit(meetingData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={meeting ? 'Edit Meeting' : 'Create New Meeting'}
      size="lg"
    >
      <MeetingForm
        meeting={meeting}
        onSubmit={handleSubmit}
        onCancel={onClose}
        selectedDate={selectedDate}
      />
    </Modal>
  );
};

export default MeetingModal;