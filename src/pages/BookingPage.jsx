import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { bookingsAPI, servicesAPI, staffAPI, branchesAPI, couponsAPI } from '../services/api'
import toast from 'react-hot-toast'

function BookingPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    service: '',
    subService: '',
    expert: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchAllServiceCategories();
    fetchServices();
    fetchStaff();
    fetchBranches();
  }, []);

  // Fetch all service categories once (not filtered by branch)
  const fetchAllServiceCategories = async () => {
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

  // Fetch all services (not filtered by branch - we'll filter on frontend)
  const fetchServices = async () => {
    try {
      const params = { isActive: true };
      const response = await servicesAPI.getAll(params);
      setServices(response.data);
      // Don't update serviceCategories here - keep all categories available
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching services:', error);
      }
      toast.error('Failed to load services');
    }
  };

  // Fetch staff with optional date filter for attendance
  const fetchStaff = async (date = null) => {
    try {
      const params = { isActive: true };
      if (date) {
        params.excludeAbsentOnDate = date;
      }
      const response = await staffAPI.getAll(params);
      setStaff(response.data);
      
      // Validate expert selection after staff list updates
      // Use functional update to get latest formData state
      setFormData(prev => {
        if (prev.expert && prev.branch) {
          const availableExperts = response.data.filter(s => s.branch === prev.branch && s.isActive);
          const expertExists = availableExperts.some(expert => expert.name === prev.expert);
          if (!expertExists) {
            return { ...prev, expert: '' };
          }
        }
        return prev;
      });
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching staff:', error);
      }
    }
  };

  // Fetch branches
  const fetchBranches = async () => {
    try {
      const response = await branchesAPI.getAll({ isActive: true });
      setBranches(response.data);
    } catch (error) {
      // Only log non-network errors to reduce console noise
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
      console.error('Error fetching branches:', error);
      }
    }
  };

  // Update sub-services when service changes or services are loaded
  useEffect(() => {
    if (formData.service && services.length > 0) {
      // Filter services by category, and include services for "All Branches" or the selected branch
      const filtered = services.filter(s => {
        const matchesCategory = s.category === formData.service;
        const matchesBranch = !formData.branch || 
          s.branch === 'All Branches' || 
          s.branch === formData.branch;
        return matchesCategory && matchesBranch;
      });
      setSubServices(filtered);
    } else {
      setSubServices([]);
      if (!formData.service) {
        setSelectedServicePrice(null);
      }
    }
  }, [formData.service, formData.branch, services]);

  // Update price when service or subService changes
  useEffect(() => {
    if (formData.subService) {
      const service = services.find(s => s.name === formData.subService && s.category === formData.service);
      if (service) {
        if (service.priceType === 'fixed' && service.priceAmount) {
          setSelectedServicePrice(service.priceAmount);
        } else {
          setSelectedServicePrice(null);
        }
      }
    } else if (formData.service) {
      // If only category selected, check if all services in category have same price
      const categoryServices = services.filter(s => s.category === formData.service);
      if (categoryServices.length === 1 && categoryServices[0].priceType === 'fixed' && categoryServices[0].priceAmount) {
        setSelectedServicePrice(categoryServices[0].priceAmount);
      } else {
        setSelectedServicePrice(null);
      }
    } else {
      setSelectedServicePrice(null);
    }
    // Reset coupon when price changes
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setFinalPrice(null);
      setCouponCode('');
    }
  }, [formData.service, formData.subService, services]);

  // Re-fetch staff when date changes to filter by attendance
  useEffect(() => {
    // Reset expert when date changes - use functional update to ensure we get latest state
    setFormData(prev => {
      if (prev.expert) {
        return { ...prev, expert: '' };
      }
      return prev;
    });
    
    // Fetch staff - validation will check current state after staff loads
    if (formData.date) {
      fetchStaff(formData.date);
    } else {
      fetchStaff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date]);

  // Re-fetch staff when branch changes if date is selected (to apply attendance filter)
  useEffect(() => {
    if (formData.branch && formData.date) {
      fetchStaff(formData.date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.branch]);

  // Reset subService when branch changes (services are already loaded, filtering happens in subServices useEffect)
  useEffect(() => {
    if (formData.branch) {
      // Only reset subService when branch changes, keep service category selected
      setFormData(prev => ({ ...prev, subService: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.branch]);

  // Handle URL params - wait for services to load first
  useEffect(() => {
    if (services.length === 0) return; // Wait for services to load
    
    const searchParams = new URLSearchParams(location.search);
    const serviceParam = searchParams.get('service');
    const expert = searchParams.get('expert');
    const branch = searchParams.get('branch');

    const newFormData = {};
    
    // Match service parameter against actual service categories
    if (serviceParam) {
      const decodedService = decodeURIComponent(serviceParam);
      // Try exact match first
      const exactMatch = serviceCategories.find(cat => 
        cat.toLowerCase() === decodedService.toLowerCase()
      );
      if (exactMatch) {
        newFormData.service = exactMatch;
      } else {
        // Fallback to partial matching
        const partialMatch = serviceCategories.find(cat => 
          cat.toLowerCase().includes(decodedService.toLowerCase()) ||
          decodedService.toLowerCase().includes(cat.toLowerCase())
        );
        if (partialMatch) {
          newFormData.service = partialMatch;
        }
      }
    }
    
    if (expert) {
      newFormData.expert = expert;
    }
    if (branch) {
      newFormData.branch = branch;
    }

    if (Object.keys(newFormData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...newFormData
      }));
    }
  }, [location.search, services, serviceCategories]);

  const availableExperts = formData.branch 
    ? staff.filter(s => {
        const matchesBranch = s.branch === formData.branch;
        const matchesCategory = !formData.service || 
          (Array.isArray(s.category) ? s.category.includes(formData.service) : s.category === formData.service);
        return matchesBranch && matchesCategory && s.isActive;
      })
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === 'service' && { subService: '' }),
      ...(name === 'branch' && { expert: '' }),
      ...(name === 'date' && { expert: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone || !formData.branch || !formData.service || !formData.date) {
      toast.error('Please fill in all required fields.');
      return;
    }

    await handleBooking();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (!selectedServicePrice) {
      toast.error('Please select a service with a fixed price to apply coupon');
      return;
    }

    try {
      setValidatingCoupon(true);
      const response = await couponsAPI.validate(couponCode, selectedServicePrice);
      setAppliedCoupon(response.data.coupon);
      setFinalPrice(response.data.finalPrice);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setFinalPrice(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setFinalPrice(null);
  };

  const handleBooking = async () => {
    setLoading(true);

    try {
      // Format date for API
      const bookingData = {
        name: formData.name,
        phone: formData.phone,
        branch: formData.branch,
        service: formData.service,
        subService: formData.subService || '',
        expert: formData.expert || '',
        date: new Date(formData.date).toISOString(),
        couponCode: appliedCoupon ? couponCode : ''
      };

      await bookingsAPI.create(bookingData);

      toast.success('Appointment request submitted successfully!');

      // Reset form
      setFormData({
        name: '',
        phone: '',
        branch: '',
        service: '',
        subService: '',
        expert: '',
        date: ''
      });
      setSelectedServicePrice(null);
      setCouponCode('');
      setAppliedCoupon(null);
      setFinalPrice(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="relative w-full">
      <Header />
      <main className="pt-[120px]">
        {/* Booking Section */}
        <section className="py-12 md:py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-xl bg-white p-6 md:p-12 shadow-xl">
              <h2 className="text-center text-3xl md:text-4xl font-bold text-text-color">Book Appointment</h2>
              <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-text-color">Full Name *</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </label>
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-text-color">Phone Number *</p>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                  />
                </label>
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-text-color">Preferred Branch *</p>
                  <div className="relative">
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                      disabled={loading}
                    >
                      <option value="">Select a Location</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch.name}>{branch.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-color">expand_more</span>
                  </div>
                </label>
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-text-color">Service Category *</p>
                  <div className="relative">
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                      disabled={loading}
                    >
                      <option value="">Select a Service</option>
                      {serviceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-color">expand_more</span>
                  </div>
                </label>
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-text-color">Sub Service (Optional)</p>
                  <div className="relative">
                    <select
                      name="subService"
                      value={formData.subService}
                      onChange={handleInputChange}
                      disabled={!formData.service || loading}
                      className="w-full appearance-none rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a Sub Service</option>
                      {subServices.map(service => (
                        <option key={service._id} value={service.name}>{service.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-color">expand_more</span>
                  </div>
                </label>
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-text-color">Preferred Expert (Optional)</p>
                  <div className="relative">
                    <select
                      name="expert"
                      value={formData.expert}
                      onChange={handleInputChange}
                      disabled={!formData.branch || !formData.date || loading}
                      className="w-full appearance-none rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Any Available Expert</option>
                      {availableExperts.length === 0 && formData.date && formData.branch ? (
                        <option value="" disabled>No staff available on this date</option>
                      ) : (
                        availableExperts.map(expert => (
                          <option key={expert._id} value={expert.name}>
                            {expert.name} ({expert.role})
                          </option>
                        ))
                      )}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-color">expand_more</span>
                  </div>
                  {formData.date && formData.branch && availableExperts.length === 0 && (
                    <p className="mt-1 text-sm text-orange-600">No staff available on this date. Please select a different date.</p>
                  )}
                </label>
                <div className="flex flex-col md:col-span-2 lg:col-span-1">
                  <p className="pb-2 text-base font-medium text-text-color">Choose a Date *</p>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-text-color/20 bg-background-light p-4 text-base text-text-color focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      min={getTodayDate()}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Coupon Code Section */}
                {selectedServicePrice && (
                  <div className="md:col-span-2 lg:col-span-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-text-color mb-2">Have a coupon code?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        disabled={!!appliedCoupon || loading}
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !couponCode.trim() || loading}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {validatingCoupon ? 'Validating...' : 'Apply'}
                        </button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Coupon Applied:</span> {appliedCoupon.code} 
                          {appliedCoupon.discountType === 'percentage' 
                            ? ` (${appliedCoupon.discountValue}% off)`
                            : ` (₹${appliedCoupon.discountValue} off)`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Price Display */}
                {selectedServicePrice && (
                  <div className="md:col-span-2 lg:col-span-3 p-4 bg-primary/10 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-text-color">Estimated Amount:</span>
                      <div className="text-right">
                        {appliedCoupon && finalPrice !== null ? (
                          <>
                            <span className="text-lg line-through text-text-color/60 mr-2">₹{selectedServicePrice}</span>
                            <span className="text-2xl font-bold text-primary">₹{finalPrice}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-primary">₹{selectedServicePrice}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-text-color/70 mt-2">Price may vary based on service requirements</p>
                  </div>
                )}

                {!selectedServicePrice && formData.service && (
                  <div className="md:col-span-2 lg:col-span-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-800">
                      Price varies or consultation-based. Payment will be discussed during service.
                    </p>
                  </div>
                )}
              </form>
              <div className="mt-10 flex justify-center">
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-6 md:px-10 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {loading ? 'Submitting...' : 'Book Appointment'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default BookingPage
