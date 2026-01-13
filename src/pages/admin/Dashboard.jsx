import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    today: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();

    // Set up Socket.io connection
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('new-booking', (booking) => {
      // Play alert sound
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Booking Received', {
          body: `${booking.name} booked ${booking.service}`,
          icon: '/favicon.png',
        });
      }

      toast.success(`New booking from ${booking.name}!`, {
        duration: 5000,
        onClick: () => navigate('/admin/bookings'),
      });

      // Refresh data
      fetchDashboardData();
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, analyticsRes] = await Promise.all([
        bookingsAPI.getAll({ limit: 10 }),
        bookingsAPI.getAnalytics()
      ]);

      const bookings = bookingsRes.data;
      const analytics = analyticsRes.data;

      // Calculate today's bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = bookings.filter(
        (b) => new Date(b.date).toDateString() === today.toDateString()
      );

      setStats({
        total: analytics.totals.total,
        pending: analytics.totals.pending,
        confirmed: analytics.totals.confirmed,
        today: todayBookings.length,
      });


      setRecentBookings(bookings.slice(0, 10));
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching dashboard data:', error);
      }
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => {
    const colorClasses = {
      primary: 'text-primary',
      'yellow-600': 'text-yellow-600',
      'green-600': 'text-green-600',
      'blue-600': 'text-blue-600',
    };
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl sm:text-3xl font-bold ${colorClasses[color] || colorClasses.primary}`}>{value}</p>
          </div>
          <span className="material-symbols-outlined text-3xl sm:text-4xl text-gray-300">{icon}</span>
        </div>
      </div>
    );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hidden audio element for alerts */}
      <audio ref={audioRef} preload="auto">
        {/* You can add a notification sound file to public/notification.mp3 */}
      </audio>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-color mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-text-color/70">Overview of your salon operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard title="Total Bookings" value={stats.total} icon="event" color="primary" />
        <StatCard title="Pending" value={stats.pending} icon="schedule" color="yellow-600" />
        <StatCard title="Confirmed" value={stats.confirmed} icon="check_circle" color="green-600" />
        <StatCard title="Today's Bookings" value={stats.today} icon="today" color="blue-600" />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-text-color">Recent Bookings</h2>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="text-primary hover:underline text-sm font-medium"
          >
            View All
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No bookings yet</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Service</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Branch</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/bookings`)}>
                      <td className="p-3">{booking.name}</td>
                      <td className="p-3">{booking.service}</td>
                      <td className="p-3">{booking.branch}</td>
                      <td className="p-3">
                        {format(new Date(booking.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  onClick={() => navigate('/admin/bookings')}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text-color">{booking.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{booking.service}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{booking.branch}</span>
                    <span>•</span>
                    <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
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

export default Dashboard;

