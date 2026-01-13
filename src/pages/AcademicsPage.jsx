import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import cosmetologyImage from '../assets/images/cosmetology.png';


function AcademicsPage() {
  const handleEnroll = (program) => {
    const phoneNumber = '9579158374'; // Remove '+' for URL
    const message = `*ENROLLMENT INQUIRY*\n\n` +
                   `*Course:* ${program.title}\n\n` +
                   `*Description:* ${program.description}\n\n` +
                   `Hello! I am interested in enrolling for the "${program.title}" program. \n\n` +
                   `Please provide me with more details about:\n` +
                   `• Course duration\n` +
                   `• Fees and payment options\n` +
                   `• Batch timings\n` +
                   `• Admission requirements\n\n` +
                   `Thank you! 🙏`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const programs = [
    {
      id: 'beauty-cosmetology',
      title: "Beauty - Cosmetology",
      description: "Explore the world of beauty and cosmetology, from skincare to makeup application.",
      image: "https://www.neodermaskinclinic.com/treatments/skintherapy1.jpg",
      originalPrice: 50000,
      discountedPrice: 40000
    },
    {
      id: 'hair-trichology',
      title: "Hair - Trichology",
      description: "Dive deep into the science of hair and scalp health with our trichology program.",
      image: "https://cdn.shopify.com/s/files/1/0532/0998/9283/files/Exploring_the_Science_of_Trichology__A_Deep_Dive_into_Scalp_Health_480x480.jpg?v=1717157983",
      originalPrice: 45000,
      discountedPrice: 35000
    },
    {
      id: 'tattoos-piercing',
      title: "Tattoos - Piercing",
      description: "Master the art of body modification, from intricate tattoo designs to safe piercing techniques.",
      image: "https://media.istockphoto.com/id/1162623180/photo/process-of-creating-tattoo-in-form-of-black-flower.jpg?s=612x612&w=0&k=20&c=79iUS8RSYKXAmLfHkf9S3DgsKXUaj2-jEksKAWMerNA=",
      originalPrice: 60000,
      discountedPrice: 48000
    },
    {
      id: 'nail-art-diploma',
      title: "Nail Art Diploma",
      description: "Unleash your creativity with professional training in nail art, manicures, and pedicures.",
      image: "https://nailboo.com/cdn/shop/articles/Manicure_2248b30f-65fd-4fb4-bd4b-296644a709e3.jpg?v=1754502555&width=1100",
      originalPrice: 30000,
      discountedPrice: 25000
    },
    {
      id: 'painting-crafting',
      title: "Painting & Crafting",
      description: "Develop your artistic voice and technical skills in various painting mediums and crafting techniques.",
      image: "https://www.thesprucecrafts.com/thmb/fRiKQLuNA2JLZalLQwzxc50upto=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-922707682-5b90467bc9e77c0025931eef.jpg",
      originalPrice: 25000,
      discountedPrice: 20000
    }
  ]



  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-10">
            <div className="flex min-h-[480px] flex-col items-center justify-center gap-8 rounded-xl bg-cover bg-center bg-no-repeat p-4 shadow-xl" style={{backgroundImage: "linear-gradient(rgba(40, 50, 20, 0.5) 0%, rgba(20, 20, 0, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuB--H3MZK7tqHsSDxO1HVU5Sa6CHWKXSRxDSu9hT7OHTrQoLXW_USb9PHWNsDrItkHvS4ze2F6xzUTK2EIFF9Ot8yUHAc5ht-ojTucgTs4GF0Pu4DwkrMZvfLDPeoX3qdaP7Y1ofZ0XbhpJ3D0VgBl7jR6Shq8-uhDmYunLAWWyYrzmbK4lZb4PVkYFCaNc4WmaUD2c2C-zG6jlRgOo2gWnPkXVx_5P3Q3-gBXtXZrEWh1FqcTzaS7H0nlWJZlHTeReSicgVVTL_pg')"}}>
              <div className="flex flex-col gap-2 text-center text-white">
                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] md:text-6xl">Nurturing Future Artistas</h1>
                <p className="mx-auto max-w-2xl text-base font-normal leading-normal md:text-lg">
                  Discover your passion and craft your future with our world-class training programs designed for the next generation of beauty professionals.
                </p>
              </div>
              <button 
                onClick={() => document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-accent text-text-color text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
              >
                <span className="truncate">Explore Programs</span>
              </button>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs-section" className="w-full py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-primary">Our Programs</h2>
              <p className="mt-2 text-lg text-text-color/80">Embark on a journey to mastery with our specialized diploma programs.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div key={program.id} className="flex flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-shadow hover:shadow-2xl">
                  <div className="w-full aspect-[4/3] bg-cover bg-center" style={{backgroundImage: `url("${program.image}")`}}></div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-primary">{program.title}</h3>
                      <p className="mt-2 text-sm text-text-color/80">{program.description}</p>
                      {program.originalPrice && program.discountedPrice && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">₹{program.discountedPrice.toLocaleString()}</span>
                          {program.originalPrice > program.discountedPrice && (
                            <>
                              <span className="text-sm text-text-color/60 line-through">₹{program.originalPrice.toLocaleString()}</span>
                              <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                                {Math.round(((program.originalPrice - program.discountedPrice) / program.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <Link to={`/academics/${program.id}`}>
                      <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-md hover:bg-opacity-90 transition-all hover:shadow-lg">
                        Explore
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>







      </main>
      <Footer />
    </div>
  )
}

export default AcademicsPage

