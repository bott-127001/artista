import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import expertiseData from '../expertiseData.json'
import employeeImage from '../assets/images/employeeimgforartista.png'
import Logo from '../components/Logo'
import owners from '../ownersData'

function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  // Helper function to truncate description for mobile
  const getMobileDescription = (description) => {
    if (!isMobile) return description
    // Limit to first 8 words for mobile
    const words = description.split(' ')
    if (words.length > 8) {
      return words.slice(0, 8).join(' ') + '...'
    }
    return description
  }

  return (
    <div className="relative w-full">
      <Header />
      <section className="relative bg-primary text-white pt-[232px] pb-12 sm:pt-[200px] sm:pb-16 md:pt-[216px] md:pb-20 lg:pt-[232px] lg:pb-24 fade-in-section">
        <div className="absolute top-20 right-4 sm:top-28 md:top-32 sm:right-8">
          <div className="bg-white rounded-full p-3 sm:p-4 shadow-lg shadow-primary/20">
            <Logo />
          </div>
        </div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-6">About Artista-House of Beauty</h2>
            <p className="mb-4">Welcome to Artista- house of beauty, where beauty knows no boundaries! Our unisex salon is a heaven for individuals seeking top notch grooming and pampering services tailored to enhance your natural beauty. Step into a world of style and relaxation, where our skilled professionals are dedicated to providing you with an unforgettable salon experience.</p>
            <p className="mb-4">At Artista we pride ourselves on offering a diverse range of services designed for both men and women. From trendy haircuts and hair colouring to rejuvenating facials and soothing massages, our expert stylists and therapists are here to cater to your unique needs. Whether you’re looking for a bold new look or a subtle refresh, we’ve got you covered.</p>
            <p className="mb-4">We understand that each person is unique, and so are their beauty preferences. That’s why we offer personalised consultations to understand your individual style and beauty goals. Whether you’re preparing for a special occasion or simply treating yourself to a day of self-care, well tailor our services to meet your expectations.</p>
            <p className="mb-4">We believe in using only the best products to ensure lasting results and maintain the health of your hair and skin. Our salon exclusively features high-quality, professional-grade products that are carefully selected to complement our commitment to excellence.</p>
            <p className="mb-4">Ready for a transformation? Schedule your appointments at Artista and let our skilled team of stylist and therapists enhance your natural beauty. We offer convenient booking options, and our friendly staff is always ready to assist you.</p>
            <p className="mb-8">Indulge in a unisex salon experience that goes beyond the ordinary. At Artista, beauty knows no boundaries- it’s an experience for everyone. Artista- The house of Beauty: Where Style Meets Serenity.</p>
          </div>
        </div>
      </section>
      <main className="bg-background-light">
        {/* Meet the Owners Section */}
        <section className={isMobile ? 'py-12' : 'py-16 lg:py-24'}>
          <div className={`container mx-auto max-w-7xl ${isMobile ? 'px-4' : 'px-6 lg:px-8'}`}>
            <h2 className={`text-center font-bold text-text-color ${isMobile ? 'text-2xl' : 'text-3xl lg:text-5xl'}`}>Meet the Owners</h2>
            <div className={`relative ${isMobile ? 'mt-8' : 'mt-12 lg:mt-16'}`}>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-4 gap-8'}`}>
                {owners.map((member) => (
                  <Link
                    key={member.id}
                    to={`/owners/${member.id}`}
                    className={`group flex flex-col items-center rounded-xl bg-white text-center shadow-lg transition-transform hover:-translate-y-1 ${isMobile ? 'p-6' : 'p-8'}`}
                    aria-label={`Learn more about ${member.name}`}
                  >
                    <div
                      className={`rounded-full bg-cover bg-center ring-2 ring-accent ring-offset-white ${isMobile ? 'h-24 w-24 ring-offset-2' : 'h-40 w-40 ring-offset-4'}`}
                      style={{ backgroundImage: `url("${member.image}")` }}
                    ></div>
                    <h3 className={`font-bold text-primary ${isMobile ? 'mt-4 text-lg' : 'mt-6 text-2xl'}`}>{member.name}</h3>
                    {member.id === 'supriya-vadnere' && (
                      <p className={`text-primary/80 ${isMobile ? 'text-sm' : 'text-lg'}`}>Director</p>
                    )}
                    {member.experience && (
                      <p className={`text-sm uppercase tracking-wide text-accent ${isMobile ? 'mt-1' : 'mt-2'}`}>{member.experience} experience</p>
                    )}
                    <p className={`italic text-text-color/70 ${isMobile ? 'mt-2 text-xs' : 'mt-4 text-base'}`}>{member.shortQuote}</p>
                    <span className="mt-4 text-sm font-semibold text-accent group-hover:underline">View full profile →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="bg-background-light py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-bold text-text-color text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Our Expertise</h2>
            <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-items-center">
              {expertiseData.map((item, index) => (
                <Link key={index} to="/services" className="w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-none">
                  <div className="group overflow-hidden rounded-xl bg-white shadow-lg sm:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full w-full">
                    <div className="w-full bg-cover bg-center h-32 sm:h-36 md:h-44 lg:h-56 xl:h-64" style={{backgroundImage: `url(${item.image})`}}></div>
                    <div className="text-center flex-1 p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6">
                      <h3 className="font-bold text-text-color text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">{item.title}</h3>
                      <p className="text-text-color/80 mt-1 sm:mt-1.5 md:mt-2 text-[10px] sm:text-xs md:text-sm leading-tight sm:leading-relaxed">{getMobileDescription(item.description)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={isMobile ? 'py-12' : 'py-16 lg:py-24'}>
          <div className={`container mx-auto max-w-7xl ${isMobile ? 'px-4' : 'px-6 lg:px-8'}`}>
            <h2 className={`text-center font-bold text-text-color ${isMobile ? 'text-2xl' : 'text-3xl lg:text-5xl'}`}>Meet Our Artists</h2>
            <div className={`relative ${isMobile ? 'mt-8' : 'mt-12 lg:mt-16'}`}>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-3 gap-8'}`}>
                {[
                  { name: "RAVIKIRAN", role: "Hair Director", quote: isMobile ? "Visionary Hair Technical Head with 39+ Years of Experience" : "A visionary Hair Technical Head mastering advanced hair science, color technology, and precision artistry—leading the team with innovation, expertise, and unmatched technical excellence. 39+ Years of Experience", image: employeeImage },
                  { name: "OMKAR", role: "Hairstylist", quote: isMobile ? "Hair artistry expert with 11+ Years of Experience" : "A hair artistry expert with mastery in advanced cuts, color, and styling. Recognized for creating signature looks that blend trend with individuality. 11+ Years of Experience", image: employeeImage },
                  { name: "Ruchika", role: "Beauty Therapist", quote: isMobile ? "Skincare specialist with 10+ Years of Experience" : "A skincare perfectionist specializing in customised treatments that unlock natural radiance. Trusted for delivering consistent, visible results. 10+ Years of Experience", image: employeeImage }
                ].map((member, index) => (
                  <div key={index} className={`flex flex-col items-center rounded-xl bg-white text-center shadow-lg ${isMobile ? 'p-6' : 'p-8'}`}>
                    <div className={`rounded-full bg-cover bg-center ring-2 ring-accent ring-offset-white ${isMobile ? 'h-24 w-24 ring-offset-2' : 'h-40 w-40 ring-offset-4'}`} style={{backgroundImage: `url("${member.image}")`}}></div>
                    <h3 className={`font-bold text-primary ${isMobile ? 'mt-4 text-lg' : 'mt-6 text-2xl'}`}>{member.name}</h3>
                    <p className={`text-primary/80 ${isMobile ? 'text-sm' : 'text-lg'}`}>{member.role}</p>
                    <p className={`italic text-text-color/70 ${isMobile ? 'mt-2 text-xs' : 'mt-4 text-base'}`}>{member.quote}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex justify-center ${isMobile ? 'mt-8' : 'mt-16'}`}>
              <Link to="/staff">
                <button className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary font-bold text-white shadow-lg transition-transform hover:scale-105 ${isMobile ? 'h-10 px-8 text-sm' : 'h-14 px-12 text-lg'}`}>
                  <span>View All Artists</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Academics Section */}
        <section className={`text-white ${isMobile ? 'bg-primary py-12' : 'bg-primary py-16 lg:py-24'}`}>
          <div className={`container mx-auto max-w-7xl ${isMobile ? 'px-4' : 'px-6 lg:px-8'}`}>
            <div className={`flex items-center ${isMobile ? 'flex-col gap-8 text-center' : 'flex-col lg:flex-row justify-between gap-12 lg:gap-16'}`}>
              <div className={`${isMobile ? 'flex-shrink-0' : 'hidden lg:block flex-shrink-0'}`}>
                <span className={`material-symbols-outlined text-accent opacity-50 ${isMobile ? 'text-6xl' : 'text-7xl xl:text-9xl'}`} style={{fontVariationSettings: "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 48"}}>school</span>
              </div>
              <div className={`flex-1 w-full ${isMobile ? '' : 'text-center lg:text-left'}`}>
                <h2 className={`font-bold ${isMobile ? 'text-2xl' : 'text-4xl lg:text-5xl'}`}>Launch Your Career in Beauty</h2>
                <p className={`opacity-90 ${isMobile ? 'mt-3 max-w-full text-sm' : 'mt-4 max-w-full lg:max-w-2xl text-lg lg:text-xl mx-auto lg:mx-0'}`}>Join the Salon Artista Academy and elevate your skills with our industry-leading educational programs, designed to turn passion into a profession.</p>
              </div>
              <Link to="/academics" className={`w-full flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-accent px-6 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-105 ${isMobile ? 'lg:w-auto' : 'lg:w-auto'}`}>
                <span className="text-center">Explore Academics & Careers</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-background-light py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-color">What Our Clients Say</h2>
            <div className="relative mt-8 sm:mt-12 md:mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { name: "Maheshwari khade", quote: "I am delighted with the results. The service and staff are sweetest! Worth it! Ruchika has been doing my rica waxing and I don't think so I will stop getting it done from her!", stars: 5 },
                  { name: "Kiara Agarwal", quote: "I have been going to Artista for 10 years and I have never had a single complaint. Their service is so good & just look at that glow tysm Ruchika For keeping my skin so refreshed & hydrated in winter lots of love keep it up 🫶🏻", stars: 5 },
                  { name: "kruttika zala", quote: "I have been getting bridal facials here once a month. It is wonderful! The whole experience is so relaxing… Thanks to all staff. Special thanks to Supriya ma'am, Dhanashree ma'am for taking care of every small things and Anjali ma'am for the best nail art. Love coming here!", stars: 4 }
                ].map((review, index) => (
                  <div key={index} className="flex flex-col rounded-xl bg-white p-8 shadow-lg">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < review.stars ? 'text-accent' : 'text-accent'}`}>{i < review.stars ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="mt-4 flex-grow text-base text-text-color/80 italic">{review.quote}</p>
                    <p className="mt-6 text-lg font-bold text-primary">- {review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
