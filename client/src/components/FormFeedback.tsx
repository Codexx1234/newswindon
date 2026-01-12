import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface FormFeedbackProps {
  type: 'success' | 'error' | 'info';
  message: ReactNode;
  show: boolean;
  onDismiss?: () => void;
}

export function FormFeedback({ type, message, show, onDismiss }: FormFeedbackProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 text-green-900 border-green-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-3 p-4 rounded-lg border ${colors[type]} mb-4`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            {icons[type]}
          </motion.div>
          <span className="flex-1">{message}</span>
          {onDismiss && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="text-lg font-bold opacity-50 hover:opacity-100"
            >
              ×
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FieldErrorProps {
  error?: string;
  show: boolean;
}

export function FieldError({ error, show }: FieldErrorProps) {
  return (
    <AnimatePresence>
      {show && error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-red-600 text-sm mt-1 font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
