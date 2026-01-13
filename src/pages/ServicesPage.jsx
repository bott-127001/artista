import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { servicesAPI } from '../services/api'

function ServicesPage() {
  const [activeSection, setActiveSection] = useState('haircare')
  const [services, setServices] = useState({})
  const [loading, setLoading] = useState(true)

  const serviceCategoryMapping = {
    "HAIRCARE": "Haircare",
    "SKINCARE & WELLNESS": "Skincare & Wellness",
    "MAKEUP STUDIO & TATTOO ART": "Makeup & Tattoos",
    "MANICURE & PEDICURE": "Manicure & Pedicure",
    "NAIL ART": "Nail Art"
  };

  // Map category names to UI section keys
  const categoryToKeyMap = {
    "Haircare": "haircare",
    "HAIRCARE": "haircare",
    "Skincare & Wellness": "skincare_wellness",
    "SKINCARE & WELLNESS": "skincare_wellness",
    "Makeup & Tattoos": "makeup_studio",
    "MAKEUP STUDIO & TATTOO ART": "makeup_studio",
    "Makeup Studio & Tattoo Art": "makeup_studio",
    "Manicure & Pedicure": "manicure_pedicure",
    "MANICURE & PEDICURE": "manicure_pedicure",
    "Nail Art": "nail_art",
    "NAIL ART": "nail_art"
  };

  // Default descriptions for categories
  const categoryDescriptions = {
    "haircare": "Experience the ultimate in hair luxury, from stunning style to deep repair and vibrant color.",
    "skincare_wellness": "Indulge in treatments designed to revitalize your skin, soothe your body, and promote holistic well-being.",
    "makeup_studio": "Get ready for your moment with professional makeup or make a permanent statement.",
    "manicure_pedicure": "Pamper your hands and feet with our rejuvenating services.",
    "nail_art": "Express your creativity with custom designs on your nails."
  };

  const getFormattedServiceName = (serviceTitle) => {
    return serviceCategoryMapping[serviceTitle] || serviceTitle;
  };

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getAll({ isActive: true });
        const servicesData = response.data;

        // Transform API data to match existing UI structure
        const transformedServices = {};

        // Group services by category
        const groupedByCategory = servicesData.reduce((acc, service) => {
          const category = service.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            name: service.name,
            desc: service.description || '',
            price: service.price || 'Varies'
          });
          return acc;
        }, {});

        // Transform to UI structure
        Object.keys(groupedByCategory).forEach(category => {
          const key = categoryToKeyMap[category] || category.toLowerCase().replace(/\s+/g, '_');
          const title = category.toUpperCase();
          transformedServices[key] = {
            title: title,
            description: categoryDescriptions[key] || `Explore our ${category} services.`,
            items: groupedByCategory[category]
          };
        });
        setServices(transformedServices);
        
        // Set first category as active if available
        const firstKey = Object.keys(transformedServices)[0];
        if (firstKey) {
          setActiveSection(firstKey);
        }
      } catch (error) {
        // Only log non-network errors to reduce console noise
        if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching services:', error);
        }
        // Fallback to empty services object
        setServices({});
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleScroll = () => {
    const sections = Object.keys(services)
    const scrollPosition = window.scrollY + 150

    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }
  }

  useEffect(() => {
    if (Object.keys(services).length > 0) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [services])

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow pt-24 sm:pt-28 md:pt-32">
        {/* Page Heading */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-text-color text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">The Menu of Mastery</h1>
            <p className="mt-4 text-lg text-text-color/80 max-w-2xl mx-auto">
              Discover our comprehensive suite of services, meticulously crafted to elevate your natural beauty and well-being with an artistic touch.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="text-text-color text-lg">Loading services...</div>
            </div>
          </div>
        ) : Object.keys(services).length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="text-text-color text-lg">No services available at the moment.</div>
            </div>
          </div>
        ) : (
          <>
            {/* Sticky Category Navigation */}
            <nav className="sticky top-16 sm:top-20 md:top-24 z-40 bg-background-light/80 backdrop-blur-sm border-b border-t border-text-color/10 overflow-x-auto">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-start sm:justify-center md:justify-between min-w-max sm:min-w-0 px-2 sm:px-4">
                  {Object.keys(services).map((key) => (
                    <a
                      key={key}
                      href={`#${key}`}
                      onClick={() => setActiveSection(key)}
                      className={`flex flex-col items-center justify-center py-3 sm:py-4 px-3 sm:px-4 md:px-6 flex-shrink-0 sm:flex-1 transition-colors whitespace-nowrap ${
                        activeSection === key
                          ? 'text-primary font-bold'
                          : 'text-text-color hover:text-primary'
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] text-center">
                        {services[key].title.split(' & ')[0]}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </nav>

            <div className="space-y-16 sm:space-y-24 py-16 sm:py-24 px-4">
              {Object.entries(services).map(([key, service]) => (
                <section key={key} className="max-w-5xl mx-auto scroll-mt-24" id={key}>
                  <div className="bg-white p-8 sm:p-12 rounded-xl shadow-xl shadow-heading/10">
                    <h2 className="text-heading text-3xl sm:text-4xl font-bold tracking-tight">{service.title}</h2>
                    <p className="text-text-color mt-4 max-w-3xl">{service.description}</p>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      {service.items && service.items.length > 0 ? (
                        service.items.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                            <div>
                              <h3 className="font-bold text-text-color">{item.name}</h3>
                              {item.desc && (
                                <p className="text-sm text-text-color/80">{item.desc}</p>
                              )}
                              {/*<p className="text-sm font-bold text-primary mt-1">{item.price}</p>*/}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center text-text-color/60 py-8">
                          No services available in this category.
                        </div>
                      )}
                    </div>
                    <div className="mt-10">
                      <Link to={`/booking?service=${encodeURIComponent(getFormattedServiceName(service.title))}`} className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all">
                        <span className="truncate">Book {service.title.split(' & ')[0]} Services</span>
                      </Link>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </>
        )}


      </main>
      <Footer />
    </div>
  )
}

export default ServicesPage
