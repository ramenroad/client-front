import { useState, useCallback } from 'react';
import { Toast } from '../components/Toast';

export const useToast = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openToast = useCallback((toastMessage: string) => {
    setMessage(toastMessage);
    setIsOpen(true);
  }, []);

  const closeToast = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ToastComponent = () => (
    <Toast message={message} isOpen={isOpen} onClose={closeToast} />
  );

  return {
    openToast,
    ToastComponent,
  };
}; 