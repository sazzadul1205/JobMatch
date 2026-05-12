// resources/js/layouts/AuthenticatedLayout.jsx
import Sidebar from '@/components/Sidebar';
import { usePage } from '@inertiajs/react';

const AuthenticatedLayout = ({ children }) => {
  // `auth` may be missing on some Inertia responses (or during hydration),
  // so keep this layout resilient.
  usePage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 p-2 mx-auto text-black">
          {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
