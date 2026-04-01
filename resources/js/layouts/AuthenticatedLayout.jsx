// resources/js/Layouts/AuthenticatedLayout.jsx
import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';

const AuthenticatedLayout = ({ children }) => {
  const { auth } = usePage().props;
  const userRole = auth.user?.role || 'job_seeker';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />

      {/* Main Content */}
      <main className="ml-64 p-2 mx-auto text-black">
          {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;