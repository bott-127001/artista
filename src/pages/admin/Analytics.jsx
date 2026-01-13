import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await bookingsAPI.getAnalytics(params);
      setAnalytics(response.data);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching analytics:', error);
      }
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#556B2F', '#D4AF37', '#8B7355', '#A0A0A0', '#6B8E23'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-500">No analytics data available</div>;
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Analytics</h1>
          <p className="text-sm sm:text-base text-text-color/70">Insights into your salon operations</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="w-full sm:w-auto rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="w-full sm:w-auto rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="End Date"
          />
          <button
            onClick={fetchAnalytics}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm sm:text-base"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-2xl sm:text-3xl font-bold text-primary">{analytics.totals.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{analytics.totals.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{analytics.totals.confirmed}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Bookings by Service */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-text-color mb-4">Bookings by Service</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.byService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#556B2F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Branch */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-text-color mb-4">Bookings by Branch</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.byBranch}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.byBranch.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings Over Time */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-text-color mb-4">Bookings Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics.overTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#556B2F" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bookings by Status */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-color mb-4">Bookings by Status</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.byStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#D4AF37" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;

