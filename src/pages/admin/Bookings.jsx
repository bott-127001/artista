import { useState, useEffect } from 'react';
import { bookingsAPI, branchesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { utils, writeFile } from '@e965/xlsx';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    branch: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchBookings();
    fetchBranches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.branch) params.branch = filters.branch;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await bookingsAPI.getAll(params);
      setBookings(response.data);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching bookings:', error);
      }
      toast.error('Failed to load bookings');
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

  const applyFilters = () => {
    let filtered = [...bookings];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchLower) ||
          b.phone.includes(searchLower) ||
          b.service.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.update(bookingId, { status: newStatus });
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      console.error('Status update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (bookingId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await bookingsAPI.delete(bookingId);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete booking';
      toast.error(errorMessage);
    }
  };

  const handleWhatsApp = async (bookingId, e, isCancellation = false) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      const response = await bookingsAPI.getWhatsAppLink(bookingId, isCancellation);
      if (response.data && response.data.whatsappLink) {
        window.open(response.data.whatsappLink, '_blank');
      } else {
        toast.error('Invalid WhatsApp link received');
      }
    } catch (error) {
      console.error('WhatsApp error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate WhatsApp link';
      toast.error(errorMessage);
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleExport = () => {
    const data = filteredBookings.map((b) => ({
      Name: b.name,
      Phone: b.phone,
      Branch: b.branch,
      Service: b.service,
      'Sub Service': b.subService || '',
      Expert: b.expert || '',
      Date: format(new Date(b.date), 'MMM dd, yyyy'),
      Status: b.status,
      'Created At': format(new Date(b.createdAt), 'MMM dd, yyyy HH:mm'),
    }));

    const ws = utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    writeFile(wb, 'Bookings.xlsx');
    toast.success('Bookings exported successfully');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Bookings Management</h1>
          <p className="text-sm sm:text-base text-text-color/70">Manage and track all bookings</p>
        </div>
        <button
          onClick={handleExport}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          <span className="text-sm sm:text-base">Export Excel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="End Date"
          />
        </div>
        <button
          onClick={fetchBookings}
          className="mt-4 w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm sm:text-base"
        >
          Apply Filters
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No bookings found</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Branch</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{booking.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{booking.phone}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCall(booking.phone);
                            }}
                            className="text-primary hover:text-primary/80"
                            title="Call"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-sm">call</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{booking.service}</div>
                        {booking.subService && (
                          <div className="text-xs text-gray-500">{booking.subService}</div>
                        )}
                      </td>
                      <td className="p-4 text-sm">{booking.branch}</td>
                      <td className="p-4 text-sm">{format(new Date(booking.date), 'MMM dd, yyyy')}</td>
                      <td className="p-4">
                        <select
                          value={booking.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(booking._id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`rounded-full px-3 py-1 text-xs font-semibold border-0 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleWhatsApp(booking._id, e, false)}
                            className="text-green-600 hover:text-green-800"
                            title="Send Confirmation"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-lg">chat</span>
                          </button>
                          {booking.status === 'pending' || booking.status === 'confirmed' ? (
                            <button
                              onClick={(e) => handleWhatsApp(booking._id, e, true)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Send Cancellation"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-lg">cancel</span>
                            </button>
                          ) : null}
                          <button
                            onClick={(e) => handleDelete(booking._id, e)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-color mb-1">{booking.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{booking.phone}</span>
                        <button
                          onClick={() => handleCall(booking.phone)}
                          className="text-primary hover:text-primary/80"
                          title="Call"
                        >
                          <span className="material-symbols-outlined text-base">call</span>
                        </button>
                      </div>
                    </div>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border-0 ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-600">Service: </span>
                      <span className="font-medium">{booking.service}</span>
                      {booking.subService && (
                        <div className="text-xs text-gray-500 ml-2">{booking.subService}</div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">Branch: </span>
                      <span className="font-medium">{booking.branch}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date: </span>
                      <span className="font-medium">{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                    </div>
                    {booking.amount && booking.amount > 0 && (
                      <div>
                        <span className="text-gray-600">Amount: </span>
                        <span className="font-medium">₹{(booking.amount / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
                    <button
                      onClick={(e) => handleWhatsApp(booking._id, e, false)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium flex-1 sm:flex-none"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span className="hidden sm:inline">Confirm</span>
                    </button>
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={(e) => handleWhatsApp(booking._id, e, true)}
                        className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 text-sm font-medium flex-1 sm:flex-none"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(booking._id, e)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium flex-1 sm:flex-none"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;

