import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import adminService from '../../services/adminService';
import LoadingScreen from '../../components/feedback/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination for users
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete modal state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteData, setDeleteData] = useState({ isOpen: false, type: '', id: '' });

  useEffect(() => {
    fetchDashboardData();
  }, [page]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(page, 20)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTotalPages(usersRes.pages || 1);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      setError('Failed to load dashboard data.');
      toast.error('Error loading admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = (type, id) => {
    setDeleteData({ isOpen: true, type, id });
  };

  const confirmDelete = async () => {
    if (!deleteData.type || !deleteData.id) return;
    
    setIsDeleting(true);
    try {
      await adminService.deleteContent(deleteData.type, deleteData.id);
      toast.success(`${deleteData.type} deleted successfully`);
      
      // Refresh stats
      fetchDashboardData();
    } catch (err) {
      console.error('Delete failed', err);
      toast.error(err.response?.data?.message || 'Failed to delete content');
    } finally {
      setIsDeleting(false);
      setDeleteData({ isOpen: false, type: '', id: '' });
    }
  };

  if (loading && !stats) return <LoadingScreen />;

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <h2>{error}</h2>
        <button onClick={fetchDashboardData} className="mt-4 px-4 py-2 bg-primary text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome, {user?.name}</p>
      </header>

      {/* Stats Grid */}
      {stats && (
        <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Creators" value={stats.creators} />
          <StatCard title="Artworks" value={stats.artworks} />
          <StatCard title="Tutorials" value={stats.tutorials} />
          <StatCard title="Portfolios" value={stats.portfolios} />
          <StatCard title="Products" value={stats.products} />
          <StatCard title="Orders" value={stats.orders} />
          <StatCard title="Live Sessions" value={stats.liveSessions} />
        </section>
      )}

      {/* Users List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">@{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{u.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Test Delete Area - Useful for administrators to clean up bad data */}
      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <div className="flex gap-4 items-center">
          <input 
            type="text" 
            id="deleteType"
            placeholder="Type (e.g. artwork, tutorial)" 
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <input 
            type="text" 
            id="deleteId"
            placeholder="Content ID" 
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 w-64"
          />
          <button 
            onClick={() => {
              const type = document.getElementById('deleteType').value;
              const id = document.getElementById('deleteId').value;
              if (type && id) handleDeletePrompt(type, id);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Force Delete Content
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Only use for urgent content removal. Supported types: artwork, tutorial, portfolio, product, liveSession.</p>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteData.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this {deleteData.type}? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setDeleteData({ isOpen: false, type: '', id: '' })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
