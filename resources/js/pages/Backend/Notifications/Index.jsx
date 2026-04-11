import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FiBell, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function Index({ notifications }) {
  const items = notifications?.data || [];

  const handleMarkAllRead = () => {
    router.post(route('backend.notifications.read-all'), {}, {
      preserveScroll: true,
    });
  };

  const handleMarkRead = (id) => {
    router.post(route('backend.notifications.read', id), {}, {
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Notifications" />

      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track updates on your job applications in one place.
              </p>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <FiCheckCircle className="w-4 h-4" />
              Mark all as read
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {items.length === 0 && (
              <div className="p-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <FiBell className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">No notifications yet</h2>
                <p className="text-sm text-gray-500 mt-2">
                  When an employer updates your application status, it will appear here.
                </p>
              </div>
            )}

            {items.map((notification) => {
              const data = notification.data || {};

              return (
                <div
                  key={notification.id}
                  className={`p-5 md:p-6 ${notification.read_at ? 'bg-white' : 'bg-blue-50/60'}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${notification.read_at ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                        <FiBell className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-semibold text-gray-900">
                            {data.title || 'Application update'}
                          </h2>
                          {!notification.read_at && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-medium">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {data.message || 'There is an update on your application.'}
                        </p>

                        {data.notes && (
                          <div className="mt-3 p-3 rounded-lg bg-white border border-blue-100 text-sm text-gray-700">
                            {data.notes}
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                          <FiClock className="w-4 h-4" />
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                          {data.job_title && <span>• {data.job_title}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!notification.read_at && (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Mark read
                        </button>
                      )}

                      <Link
                        href={route(data.route_name || 'backend.apply.index', data.route_params || {})}
                        className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                      >
                        View application
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
