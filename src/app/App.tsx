import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { initializeStaffAccounts } from './utils/initializeStaff';

export default function App() {
  useEffect(() => {
    // Initialize pre-defined staff accounts on first load
    initializeStaffAccounts();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}