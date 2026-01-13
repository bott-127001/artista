import { useState, useEffect } from 'react';
import { servicesAPI, branchesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    price: 'Varies',
    priceType: 'varies',
    priceAmount: null,
    branch: 'All Branches',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
    fetchBranches();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await servicesAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching categories:', error);
      }
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await branchesAPI.getAll();
      setBranches(response.data);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching branches:', error);
      }
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      // Filter out inactive services - only show active ones
      setServices(response.data.filter(s => s.isActive !== false));
      // Also refresh categories when services are fetched
      fetchCategories();
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching services:', error);
      }
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, formData);
        toast.success('Service updated successfully');
      } else {
        await servicesAPI.create(formData);
        toast.success('Service created successfully');
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
      fetchCategories(); // Refresh categories in case new category was added
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    // Check if category already exists
    if (categories.includes(newCategoryName.trim())) {
      toast.error('Category already exists');
      return;
    }

    try {
      // Create a placeholder service with the new category to "register" the category
      // This is a simple way to create a category without a separate category model
      await servicesAPI.create({
        category: newCategoryName.trim(),
        name: 'Placeholder - Delete this service',
        description: 'This is a placeholder service created to register the category. You can delete this after creating your actual services.',
        price: 'Varies',
        priceType: 'varies',
        branch: 'All Branches',
        isActive: false, // Make it inactive so it doesn't show in public
      });
      
      toast.success('Category created successfully');
      setNewCategoryName('');
      setShowCategoryModal(false);
      fetchCategories();
      fetchServices();
      // Select the new category in the form
      setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      category: service.category,
      name: service.name,
      description: service.description || '',
      price: service.price || 'Varies',
      priceType: service.priceType || 'varies',
      priceAmount: service.priceAmount || null,
      branch: service.branch || 'All Branches',
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await servicesAPI.delete(serviceId);
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      description: '',
      price: 'Varies',
      priceType: 'varies',
      priceAmount: null,
      branch: 'All Branches',
      isActive: true,
    });
  };

  // Get unique categories from services for grouping
  const serviceCategories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  const groupedServices = serviceCategories.reduce((acc, category) => {
    acc[category] = services.filter((s) => s.category === category);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Services Management</h1>
          <p className="text-sm sm:text-base text-text-color/70">Manage your salon services</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setNewCategoryName('');
              setShowCategoryModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm sm:text-base">Add Category</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingService(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm sm:text-base">Add Service</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {serviceCategories.map((category) => (
            <div key={category} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {groupedServices[category].map((service) => (
                  <div
                    key={service._id}
                    className={`p-4 border rounded-lg ${
                      service.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-text-color">{service.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    )}
                    <p className="text-sm font-semibold text-primary mb-1">
                      {service.priceType === 'fixed' && service.priceAmount 
                        ? `₹${service.priceAmount}` 
                        : service.price || 'Varies'}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Branch: {service.branch || 'All Branches'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">
              {editingService ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-sm font-medium text-text-color mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Price Type *</label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value, priceAmount: e.target.value === 'fixed' ? formData.priceAmount : null })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="varies">Varies</option>
                  <option value="consultation">By Consultation</option>
                </select>
              </div>
              {formData.priceType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-text-color mb-1">Price Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.priceAmount || ''}
                    onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter price in rupees"
                    required={formData.priceType === 'fixed'}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Price Display (Legacy)</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., ₹500 or Varies (for display)"
                />
                <p className="text-xs text-gray-500 mt-1">This field is for backward compatibility. Use Price Type and Amount above.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Branch *</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="All Branches">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
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
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
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

      {/* Create Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">
              Create New Category
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Haircare, Skincare & Wellness"
                  required
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateCategory();
                    }
                  }}
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  A placeholder service will be created to register this category. You can delete it after creating your actual services.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateCategory}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  Create Category
                </button>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

