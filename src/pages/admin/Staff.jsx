import { useState, useEffect } from 'react';
import { staffAPI, branchesAPI, attendanceAPI, servicesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [filterBranch, setFilterBranch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    branch: '',
    category: [],
    description: '',
    image: '',
    rating: 5.0,
    phone: '',
    isActive: true,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showAttendanceTable, setShowAttendanceTable] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { staffId: 'present' | 'absent' }
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState({}); // { staffId: 'present' | 'absent' } for today
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    fetchStaff();
    fetchBranches();
    fetchServiceCategories();
    fetchTodayAttendance();
  }, []);

  // Fetch today's attendance when staff list changes
  useEffect(() => {
    if (staff.length > 0) {
      fetchTodayAttendance();
    }
  }, [staff.length]);

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await attendanceAPI.getByDate(today);
      const recordsMap = {};
      response.data.forEach(record => {
        const staffId = record.staffId._id || record.staffId;
        recordsMap[staffId] = record.status;
      });
      setTodayAttendance(recordsMap);
    } catch (error) {
      // Only log non-network errors
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching today attendance:', error);
      }
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const response = await servicesAPI.getAll({ isActive: true });
      const categories = [...new Set(response.data.map(s => s.category))];
      setServiceCategories(categories);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching service categories:', error);
      }
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const params = { isActive: true };
      if (filterBranch) params.branch = filterBranch;
      const response = await staffAPI.getAll(params);
      setStaff(response.data);
      // Refresh today's attendance after fetching staff
      if (response.data.length > 0) {
        fetchTodayAttendance();
      }
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching staff:', error);
      }
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchStaff();
  }, [filterBranch]);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownOpen && !event.target.closest('.category-dropdown-container')) {
        setCategoryDropdownOpen(false);
      }
    };

    if (categoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [categoryDropdownOpen]);

  // Fetch attendance records when date changes or table opens
  useEffect(() => {
    if (showAttendanceTable && attendanceDate && staff.length > 0) {
      fetchAttendanceForDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceDate, showAttendanceTable, staff.length]);

  const fetchAttendanceForDate = async () => {
    try {
      const response = await attendanceAPI.getByDate(attendanceDate);
      // Convert array to object for easy lookup: { staffId: 'present' | 'absent' }
      const recordsMap = {};
      response.data.forEach(record => {
        const staffId = record.staffId._id || record.staffId;
        recordsMap[staffId] = record.status;
      });
      
      // Initialize all staff as present (default), then override with fetched records
      const defaultRecords = {};
      staff.forEach(member => {
        defaultRecords[member._id] = recordsMap[member._id] || 'present';
      });
      setAttendanceRecords(defaultRecords);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching attendance:', error);
      }
      // Initialize all as present if fetch fails
      const defaultRecords = {};
      staff.forEach(member => {
        defaultRecords[member._id] = 'present';
      });
      setAttendanceRecords(defaultRecords);
    }
  };

  const handleToggleAttendance = async (staffId, currentStatus) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    
    // Optimistically update UI
    setAttendanceRecords(prev => ({
      ...prev,
      [staffId]: newStatus
    }));

    try {
      setSavingAttendance(true);
      await attendanceAPI.create({
        records: [{
          staffId: staffId,
          date: attendanceDate,
          status: newStatus
        }]
      });
      toast.success(`Marked as ${newStatus === 'present' ? 'Present' : 'Absent'}`);
    } catch (error) {
      // Revert on error
      setAttendanceRecords(prev => ({
        ...prev,
        [staffId]: currentStatus
      }));
      toast.error(error.response?.data?.message || 'Failed to update attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleMarkAbsentToday = async (staffId) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Optimistically update UI
    setTodayAttendance(prev => ({
      ...prev,
      [staffId]: 'absent'
    }));

    try {
      await attendanceAPI.create({
        records: [{
          staffId: staffId,
          date: today,
          status: 'absent'
        }]
      });
      toast.success('Marked as absent for today');
      // Refresh attendance to ensure consistency
      fetchTodayAttendance();
    } catch (error) {
      // Revert on error
      setTodayAttendance(prev => ({
        ...prev,
        [staffId]: 'present'
      }));
      toast.error(error.response?.data?.message || 'Failed to mark as absent');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate category selection
    if (formData.category.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    
    try {
      const submitData = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'category') { // Skip image and category, handle separately
          submitData.append(key, formData[key]);
        }
      });
      
      // Handle category array
      if (Array.isArray(formData.category)) {
        formData.category.forEach(cat => {
          submitData.append('category', cat);
        });
      }

      // Add image file if selected
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      if (editingStaff) {
        await staffAPI.update(editingStaff._id, submitData);
        toast.success('Staff member updated successfully');
      } else {
        await staffAPI.create(submitData);
        toast.success('Staff member created successfully');
      }
      setShowModal(false);
      setEditingStaff(null);
      resetForm();
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save staff member');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      branch: staffMember.branch,
      category: Array.isArray(staffMember.category) ? staffMember.category : (staffMember.category ? [staffMember.category] : []),
      description: staffMember.description || '',
      image: staffMember.image || '',
      rating: staffMember.rating || 5.0,
      phone: staffMember.phone || '',
      isActive: staffMember.isActive,
    });
    setSelectedImage(null);
    setImagePreview(staffMember.image || '');
    setShowModal(true);
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await staffAPI.delete(staffId);
      toast.success('Staff member deleted');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to delete staff member');
    }
  };

  const handleBranchChange = async (staffId, newBranch) => {
    try {
      await staffAPI.changeBranch(staffId, newBranch);
      toast.success('Branch changed successfully');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to change branch');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      branch: '',
      category: [],
      description: '',
      image: '',
      rating: 5.0,
      phone: '',
      isActive: true,
    });
    setSelectedImage(null);
    setImagePreview('');
    setCategoryDropdownOpen(false);
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Staff Management</h1>
          <p className="text-sm sm:text-base text-text-color/70">Manage your salon staff</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              resetForm();
              setEditingStaff(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm sm:text-base">Add New Staff</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-semibold text-text-color">Image</th>
                  <th className="text-left p-4 font-semibold text-text-color">Name</th>
                  <th className="text-left p-4 font-semibold text-text-color">Role</th>
                  <th className="text-left p-4 font-semibold text-text-color">Branch</th>
                  <th className="text-left p-4 font-semibold text-text-color">Category</th>
                  <th className="text-left p-4 font-semibold text-text-color">Rating</th>
                  <th className="text-center p-4 font-semibold text-text-color">Status</th>
                  <th className="text-center p-4 font-semibold text-text-color">Attendance</th>
                  <th className="text-center p-4 font-semibold text-text-color">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr
                    key={member._id}
                    className={`border-b hover:bg-gray-50 ${
                      !member.isActive ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="p-4">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400">person</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-text-color">{member.name}</div>
                      {member.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs">
                          {member.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{member.role}</td>
                    <td className="p-4">
                      <select
                        value={member.branch}
                        onChange={(e) => handleBranchChange(member._id, e.target.value)}
                        className="text-sm rounded border border-gray-300 p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {branches.map((branch) => (
                          <option key={branch._id} value={branch.name}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(member.category) ? (
                          member.category.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                            >
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {member.category || 'N/A'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`inline-block w-3 h-3 text-xs leading-none ${
                                star <= Math.floor(member.rating)
                                  ? 'text-yellow-500'
                                  : star === Math.ceil(member.rating) && member.rating % 1 !== 0
                                  ? 'text-yellow-500 opacity-50'
                                  : 'text-gray-300'
                              }`}
                              style={{
                                fontSize: '12px',
                                lineHeight: '1',
                                fontFamily: 'Arial, sans-serif'
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({member.rating})</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleMarkAbsentToday(member._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-colors"
                      >
                        Mark Absent
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(member)}
                          className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {staff.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No staff members found
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
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
                <label className="block text-sm font-medium text-text-color mb-1">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="e.g., Hairstylist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Branch *</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Category *</label>
                <div className="relative category-dropdown-container">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-left flex items-center justify-between"
                  >
                    <span className={formData.category.length === 0 ? 'text-gray-500' : 'text-text-color'}>
                      {formData.category.length === 0 
                        ? 'Select categories' 
                        : `${formData.category.length} categor${formData.category.length === 1 ? 'y' : 'ies'} selected`}
                    </span>
                    <span className="material-symbols-outlined text-sm text-gray-500">
                      {categoryDropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {categoryDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {serviceCategories.map(category => (
                        <label
                          key={category}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.category.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, category: [...formData.category, category] });
                              } else {
                                setFormData({ ...formData, category: formData.category.filter(c => c !== category) });
                              }
                            }}
                            className="mr-3 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-color">{category}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {formData.category.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.category.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs flex items-center gap-1">
                        {cat}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, category: formData.category.filter(c => c !== cat) });
                          }}
                          className="hover:text-primary/70"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {formData.category.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Please select at least one category</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  {editingStaff ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStaff(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onMouseDown={(e) => {
                    // Prevent dropdown from closing when clicking cancel
                    e.preventDefault();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {showAttendanceTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-text-color">
                Mark Attendance
              </h2>
              <button
                onClick={() => {
                  setShowAttendanceTable(false);
                  setAttendanceRecords({});
                }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-color mb-2">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> All staff are marked as <span className="font-bold">Present</span> by default. 
                Click the button to mark a staff member as <span className="font-bold">Absent</span>.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-3 font-semibold text-text-color">Name</th>
                    <th className="text-left p-3 font-semibold text-text-color">Role</th>
                    <th className="text-left p-3 font-semibold text-text-color">Branch</th>
                    <th className="text-center p-3 font-semibold text-text-color">Status</th>
                    <th className="text-center p-3 font-semibold text-text-color">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => {
                    const status = attendanceRecords[member._id] || 'present';
                    return (
                      <tr key={member._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-text-color">{member.name}</td>
                        <td className="p-3 text-gray-600">{member.role}</td>
                        <td className="p-3 text-gray-600">{member.branch}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {status === 'present' ? '✓ Present' : '✗ Absent'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleAttendance(member._id, status)}
                            disabled={savingAttendance}
                            className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                              status === 'present'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {status === 'present' ? 'Mark Absent' : 'Mark Present'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {staff.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No staff members available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;

