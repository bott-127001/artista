import { useState, useEffect } from 'react';
import { branchesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    whatsappNumber: '',
    isActive: true,
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchesAPI.getAll();
      setBranches(response.data);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching branches:', error);
      }
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await branchesAPI.update(editingBranch._id, formData);
        toast.success('Branch updated successfully');
      } else {
        await branchesAPI.create(formData);
        toast.success('Branch created successfully');
      }
      setShowModal(false);
      setEditingBranch(null);
      resetForm();
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save branch');
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address || '',
      phone: branch.phone || '',
      whatsappNumber: branch.whatsappNumber,
      isActive: branch.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      whatsappNumber: '',
      isActive: true,
    });
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Branches</h1>
          <p className="text-sm sm:text-base text-text-color/70">Manage your salon branches</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingBranch(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="text-sm sm:text-base">Add Branch</span>
        </button>
      </div>

      {/* Branch Management */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">Branches</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : branches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No branches found</div>
        ) : (
          <div className="space-y-4">
            {branches.map((branch) => (
              <div
                key={branch._id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-text-color">{branch.name}</h3>
                  {branch.address && (
                    <p className="text-sm text-gray-600">{branch.address}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm">
                    {branch.phone && (
                      <span className="text-gray-600">Phone: {branch.phone}</span>
                    )}
                    <span className="text-gray-600">
                      WhatsApp: {branch.whatsappNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      branch.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleEdit(branch)}
                    className="text-primary hover:text-primary/80"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">
              {editingBranch ? 'Edit Branch' : 'Add Branch'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="e.g., 7066110033"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm text-text-color">
                  Active
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  {editingBranch ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBranch(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

