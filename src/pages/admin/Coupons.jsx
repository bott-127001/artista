import { useState, useEffect } from 'react';
import { couponsAPI, settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    isActive: true,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    maxUses: null,
    description: '',
  });
  const [announcementData, setAnnouncementData] = useState({
    announcementText: '',
    isAnnouncementActive: false,
  });
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  useEffect(() => {
    fetchCoupons();
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await settingsAPI.get();
      setAnnouncementData({
        announcementText: response.data.announcementText || '',
        isAnnouncementActive: response.data.isAnnouncementActive || false,
      });
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching announcement:', error);
      }
    }
  };

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingAnnouncement(true);
      await settingsAPI.update(announcementData);
      toast.success('Announcement updated successfully');
    } catch (error) {
      toast.error('Failed to update announcement');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponsAPI.getAllAdmin();
      setCoupons(response.data);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching coupons:', error);
      }
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        validFrom: new Date(formData.validFrom),
        validTo: new Date(formData.validTo),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        discountValue: parseFloat(formData.discountValue),
      };

      if (editingCoupon) {
        await couponsAPI.update(editingCoupon._id, submitData);
        toast.success('Coupon updated successfully');
      } else {
        await couponsAPI.create(submitData);
        toast.success('Coupon created successfully');
      }
      setShowModal(false);
      setEditingCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      isActive: coupon.isActive,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validTo: new Date(coupon.validTo).toISOString().split('T')[0],
      maxUses: coupon.maxUses || '',
      description: coupon.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await couponsAPI.delete(couponId);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      isActive: true,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: '',
      maxUses: null,
      description: '',
    });
  };

  const isCouponValid = (coupon) => {
    const now = new Date();
    return (
      coupon.isActive &&
      now >= new Date(coupon.validFrom) &&
      now <= new Date(coupon.validTo) &&
      (coupon.maxUses === null || coupon.usedCount < coupon.maxUses)
    );
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Coupon Management</h1>
          <p className="text-sm sm:text-base text-text-color/70">Create and manage discount coupon codes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingCoupon(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span className="text-sm sm:text-base">Add Coupon</span>
        </button>
      </div>

      {/* Announcement Management */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">Moving Text Announcement</h2>
        <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-color mb-1">
              Announcement Text
            </label>
            <textarea
              value={announcementData.announcementText}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  announcementText: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Enter the text to display in the moving strip (e.g., Special offer: 20% off on all courses!)"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAnnouncementActive"
              checked={announcementData.isAnnouncementActive}
              onChange={(e) =>
                setAnnouncementData({
                  ...announcementData,
                  isAnnouncementActive: e.target.checked,
                })
              }
              className="rounded"
            />
            <label htmlFor="isAnnouncementActive" className="text-sm text-text-color">
              Show announcement on website
            </label>
          </div>
          <button
            type="submit"
            disabled={savingAnnouncement}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {savingAnnouncement ? 'Saving...' : 'Save Announcement'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No coupons found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Code</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Value</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Valid From</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Valid To</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Uses</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold">{coupon.code}</td>
                      <td className="p-3 capitalize">{coupon.discountType}</td>
                      <td className="p-3">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="p-3 text-sm">
                        {format(new Date(coupon.validFrom), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-3 text-sm">
                        {format(new Date(coupon.validTo), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-3 text-sm">
                        {coupon.usedCount || 0}
                        {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / ∞'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isCouponValid(coupon)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCouponValid(coupon) ? 'Valid' : 'Invalid'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="text-primary hover:text-primary/80"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  required
                  placeholder="e.g., SAVE20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({ ...formData, discountType: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  max={formData.discountType === 'percentage' ? '100' : undefined}
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder={
                    formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.discountType === 'percentage'
                    ? 'Enter percentage (0-100)'
                    : 'Enter amount in ₹'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Valid From *
                </label>
                <input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Valid To *
                </label>
                <input
                  type="date"
                  value={formData.validTo}
                  onChange={(e) =>
                    setFormData({ ...formData, validTo: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  min={formData.validFrom}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Max Uses (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUses: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="2"
                  placeholder="Optional description for this coupon"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
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
                  {editingCoupon ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoupon(null);
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

export default Coupons;
