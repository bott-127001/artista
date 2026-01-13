import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { couponsAPI } from '../services/api'
import toast from 'react-hot-toast'

function ProgramDetailPage() {
  const { programId } = useParams()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [finalPrice, setFinalPrice] = useState(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    const program = programDetails[programId] || programDetails['hair-artistry']
    if (!program.discountedPrice) {
      toast.error('This program does not have a price')
      return
    }

    try {
      setValidatingCoupon(true)
      const response = await couponsAPI.validate(couponCode, program.discountedPrice)
      setAppliedCoupon(response.data.coupon)
      setFinalPrice(response.data.finalPrice)
      toast.success('Coupon applied successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code')
      setAppliedCoupon(null)
      setFinalPrice(null)
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setAppliedCoupon(null)
    setFinalPrice(null)
  }

  const handleEnroll = () => {
    const phoneNumber = '7066110033'; // Remove '+' for URL
    const priceInfo = showPrice 
      ? `*Price:* ₹${displayPrice.toLocaleString()}${appliedCoupon ? ` (After coupon: ${appliedCoupon.code})` : ''}\n` +
        `*Original Price:* ₹${program.originalPrice.toLocaleString()}\n` +
        `*Discounted Price:* ₹${program.discountedPrice.toLocaleString()}\n`
      : '';
    
    const message = `*ENROLLMENT INQUIRY*\n\n` +
                   `*Course:* ${program.title}\n` +
                   `*Duration:* ${program.duration}\n` +
                   `*Focus:* ${program.focus}\n` +
                   `*Certification:* ${program.certification}\n` +
                   priceInfo +
                   `\n*About this course:*\n${program.description}\n\n` +
                   `Hello! I am interested in enrolling for the "${program.title}" program (${program.duration}). \n\n` +
                   `Please provide me with more details about:\n` +
                   `• Course fees and payment options\n` +
                   `• Batch timings and start dates\n` +
                   `• Admission requirements and process\n` +
                   `• Scholarship or installment options\n\n` +
                   `Thank you! 🙏`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const programDetails = {
    'hair-artistry': {
      title: "Advanced Hairdressing Mastery",
      description: "Elevate your craft and unlock your artistic potential with our premier advanced course.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLTa_k_x-WTYweC-Oyfh8N8x1QL6z9c67lB9Ug5SK85j12Rhq0ry-_BP9z3fSE-tur-ow5FV-AWMaRXbpA-vRJhdIjHp3v6fG28gRzykupK9fD8E9RJ55InKXJaznIdW34VDPw9vhyp5H0-O-FCYT71mkwvoxs-enyFhRWE-gcCz_NQdfqTxHYvstzcaXzChyj7-ofn-ffY702Z1Av4cb2z43nKpPCZ0Ggw7YJF0On7qcrh0c05sIr8pn8HdgGjOujyxRsv_6NRXw",
      duration: "6 Months",
      originalPrice: 55000,
      discountedPrice: 45000,
      prerequisites: "Basic Certification",
      schedule: "Full-Time",
      overview: "This comprehensive program is designed to elevate your hairdressing skills to an expert level. Through hands-on training and theoretical knowledge, you will master advanced techniques in cutting, coloring, and styling, preparing you for a successful career in high-end salons. Our curriculum blends artistic vision with technical precision, ensuring you graduate as a confident and sought-after professional.",
      curriculum: [
        {
          title: "Module 1: Precision Cutting",
          description: "Master advanced geometric shapes, texturizing techniques, and razor cutting for both classic and contemporary styles."
        },
        {
          title: "Module 2: Creative Coloring",
          description: "Explore balayage, foilyage, color melting, and complex color correction scenarios to create bespoke looks for every client."
        },
        {
          title: "Module 3: Advanced Styling & Updos",
          description: "Learn intricate braiding, avant-garde styling, and red-carpet-worthy updos for weddings and special events."
        }
      ],
      outcomes: [
        "Execute a wide range of advanced cutting and coloring techniques with confidence and precision.",
        "Conduct in-depth client consultations to design personalized, high-end looks.",
        "Build a professional portfolio showcasing your advanced skills and unique artistic style.",
        "Develop business acumen for salon management and client retention."
      ],
      instructors: [
        {
          name: "Amelia Vance",
          role: "Lead Educator, Cutting",
          description: "With 15 years of editorial styling experience, Amelia brings a sharp eye for detail and trend-setting vision.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqz111SVF5pGnnXwHKKYkl83Nkcr7-V9dpDian2-59Bt1RSfrL_oojCPVAVP2mAzVzTzDMtGOdpINfBK727d0R2n5bYk6HzUYNB1BpCG2kW8O-jQeZ7uZtzrmgAoG0bqDqk07tkYBCCmBSXzKqu_C-TIOaG5IukBnKTG8SWI255GrVdJe4z91oef-7i-wpNvs2BC18XMPeSB5SgdqnZI41as9iVpSmdWvm1W9T8kJfaz1ppiiXPMw0JhoCuQLAMrQIeM0PziwXHmg"
        },
        {
          name: "Ben Carter",
          role: "Master Colorist",
          description: "A certified color master, Ben is renowned for his innovative techniques in balayage and color correction.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0tU4iIE2Ctv0gdD9ph3VjAYRRDbtfZp0d5yJcqgZh6rdK_5aErkdhSPdZebbmWSAdYuiCnscoQNEs4b0wAw9e8OsAgdoc1Mf0TwoQnRC-un_3ecJRCf4GbINyaK_XY_X_W5VPAyTiTIqXnVsCBh1lyEb1a-LhMPf9vSIMMFJogOtCbMYc8qZk-7i2IQE2O_HsdJzsgadSOyHsJcAxTKPrH6Mzi-efrm84F3p75fCPB8qxxILp90jMGBEZFVNERVdEPWKfdAHA0XI"
        },
        {
          name: "Chloe Davis",
          role: "Styling & Business Lead",
          description: "Chloe's expertise lies in bridal updos and business strategies for freelance stylists.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQO7kh_HhPgXa5lySMp7nJ6nJ4tySfRALHq_2axeNxf0ffvF6KpzBo4tAJfPUBghKA0nuAP1KkKPCLE87MZtiF6zBfQvCbGQwHhhD-iUaawHhvGtIzo56fuu_oeh3QGGwISEYiKsecFNnauddqJC6r6KtT_mbixDANjr97Czw6v-12eNel6p1jDEqjgGTNABTzRUKSz1X2XZHGO6PymQxB0lK__3luOTNJE5DcW3tQjSKOGVQvflY9z5FylS8ETqwtqC_8xx1I76g"
        }
      ],
      testimonials: [
        {
          name: "Olivia Chen",
          quote: "This course completely transformed my career. The hands-on training was incredible, and the instructors are true masters of their craft. I landed a job at my dream salon before I even graduated.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4iuzyejuVpO2bhKUIKXzF_A4Q0O5CYXultdigG3c_g9AC7SxS8U7QcMibkmFOf6Kme3k5Dku7zigC5XNTB2bwjQHASEdvpv0DCuRf8PZv0v653XbZcdaKZ-mVql85cyHs2mT-A7_WLILNBwLqf7aGNfbuhvoQWG5l9nAMPN4niNFmx3hwt7klFXT2bxoBCHFS64gcFn-c_fHiR3mUSzBtOyAqpQbX9HqL6k9F7BTBazEK45AAWUuqzj5QvsQi_WUTBUu9UYQEccQ"
        },
        {
          name: "Liam Rodriguez",
          quote: "I hesitated because of the investment, but it was worth every penny. The depth of knowledge, from advanced coloring to business skills, is unmatched. My confidence and client base have soared.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW-JpZVE6hCITMnoCWGAQPtTCSSteVvcy1oL5ULfRYGAPUS8aW7XLyArJhQ5QQbM1wSgT8pM1tMBaDs3Yp2puqTxNPPuIsNlZy3IbOxF-QTvdUufMfzTVErOgqvzLrvzGi2W5ZUGdNiqy0xX-cTi9R9hxD-h7iRoyds9ewbtQYVL53Cesm0C_GO1R9yPpgztVTLxs-_YsmECGi2vviiRuKIVgCqmIEukaUdndfUCAU4sM9sm4k9FPTvPXReT5jcAVTifwifNIuD1A"
        }
      ]
    },
    'hair-trichology': {
      title: "Diploma in Hair Trichology & Styling",
      description: "A specialized program blending the medical science of scalp health with the art of modern hairdressing. Designed for aspiring professionals who want to diagnose, treat, and style with authority.",
      image: "https://cdn.shopify.com/s/files/1/0532/0998/9283/files/Exploring_the_Science_of_Trichology__A_Deep_Dive_into_Scalp_Health_480x480.jpg?v=1717157983",
      duration: "4 Months",
      originalPrice: 45000,
      discountedPrice: 35000,
      focus: "Science & Artistry",
      certification: "Included",
      overview: "Our Hair Trichology Course offers a clear and practical understanding of hair and scalp science. Students learn to analyze hair health using professional methods, identifying the root causes of issues like hair fall, dandruff, and thinning. Uniquely, this course also bridges the gap to styling, teaching you how to perform chemical treatments (Coloring, Highlights) safely without compromising scalp health.",
      curriculum: [
        {
          title: "Module 1: The Science of Trichology",
          description: "Understanding hair growth cycles, why problems occur, and identifying common scalp conditions."
        },
        {
          title: "Module 2: Diagnosis & Therapeutics",
          description: "Professional analysis methods for hair fall, thinning, and scalp infections. recommending effective treatment solutions."
        },
        {
          title: "Module 3: Advanced Styling & Chemical Work",
          description: "Trendy Haircuts, Coloring, and Highlights techniques integrated with scalp safety."
        },
        {
          title: "Module 4: Modern Therapies & Care",
          description: "Product knowledge, modern hair therapies, and creating personalized care routines for clients."
        }
      ],
      outcomes: [
        "Master professional hair and scalp analysis methods.",
        "Treat complex conditions like dandruff, alopecia, and infections.",
        "Execute trendy cuts and colors while maintaining hair integrity.",
        "Work confidently in clinical and salon environments."
      ],
      instructors: [
        {
          name: "Dr. Evelyn Reed",
          role: "Lead Trichologist",
          description: "A certified trichologist with a decade of experience in clinical and cosmetic hair science.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqz111SVF5pGnnXwHKKYkl83Nkcr7-V9dpDian2-59Bt1RSfrL_oojCPVAVP2mAzVzTzDMtGOdpINfBK727d0R2n5bYk6HzUYNB1BpCG2kW8O-jQeZ7uZtzrmgAoG0bqDqk07tkYBCCmBSXzKqu_C-TIOaG5IukBnKTG8SWI255GrVdJe4z91oef-7i-wpNvs2BC18XMPeSB5SgdqnZI41as9iVpSmdWvm1W9T8kJfaz1ppiiXPMw0JhoCuQLAMrQIeM0PziwXHmg"
        },
        {
          name: "Marco Rossi",
          role: "Creative Director",
          description: "An award-winning hairstylist known for his cutting-edge techniques and focus on hair health.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0tU4iIE2Ctv0gdD9ph3VjAYRRDbtfZp0d5yJcqgZh6rdK_5aErkdhSPdZebbmWSAdYuiCnscoQNEs4b0wAw9e8OsAgdoc1Mf0TwoQnRC-un_3ecJRCf4GbINyaK_XY_X_W5VPAyTiTIqXnVsCBh1lyEb1a-LhMPf9vSIMMFJogOtCbMYc8qZk-7i2IQE2O_HsdJzsgadSOyHsJcAxTKPrH6Mzi-efrm84F3p75fCPB8qxxILp90jMGBEZFVNERVdEPWKfdAHA0XI"
        }
      ],
      testimonials: [
        {
          name: "Jasmine Kaur",
          quote: "This program was a game-changer. I can now confidently address my clients' scalp concerns while still delivering beautiful, creative styles. The dual focus is brilliant and so needed in our industry.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4iuzyejuVpO2bhKUIKXzF_A4Q0O5CYXultdigG3c_g9AC7SxS8U7QcMibkmFOf6Kme3k5Dku7zigC5XNTB2bwjQHASEdvpv0DCuRf8PZv0v653XbZcdaKZ-mVql85cyHs2mT-A7_WLILNBwLqf7aGNfbuhvoQWG5l9nAMPN4niNFmx3hwt7klFXT2bxoBCHFS64gcFn-c_fHiR3mUSzBtOyAqpQbX9HqL6k9F7BTBazEK45AAWUuqzj5QvsQi_WUTBUu9UYQEccQ"
        }
      ]
    },
    'beauty-cosmetology': {
      title: "Diploma in Skin Cosmetology",
image: "https://www.neodermaskinclinic.com/treatments/skintherapy1.jpg",
      duration: "6 Months",
      originalPrice: 50000,
      discountedPrice: 40000,
      focus: "Clinical & Aesthetic",
      certification: "Included",
      overview: "Our Beauty & Cosmetology course provides a holistic education in professional beauty services. Students will learn the science behind skin and hair care, master a wide range of makeup application techniques, and understand the principles of client consultation and salon management.",
      curriculum: [
        {
          title: "Module 1: Advanced Skincare Science",
          description: "Understanding skin anatomy, physiology, and common skin conditions. Advanced facial techniques and product knowledge."
        },
        {
          title: "Module 2: Professional Makeup Artistry",
          description: "Techniques for bridal, editorial, and special effects makeup. Color theory and product selection."
        },
        {
          title: "Module 3: Hair Styling and Treatments",
          description: "Fundamental hair styling techniques, including updos, braiding, and thermal styling. Introduction to hair treatments."
        },
        {
          title: "Module 4: Salon Management & Client Relations",
          description: "Business operations, marketing, and building a loyal clientele."
        }
      ],
      outcomes: [
        "Perform a variety of professional skincare treatments.",
        "Create stunning makeup looks for various occasions.",
        "Provide expert hair styling and treatment services.",
        "Develop the skills to manage a salon and build a client base."
      ],
      instructors: [
        {
          name: "Isabella Rossi",
          role: "Lead Esthetician",
          description: "A master esthetician with 20 years of experience in luxury spa environments.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClmLQew2qnzSi5xaQslkfHt6FMLUGVJuKLdjr1fMiK0mdvT12zxM9ZvVo8_iX93j3w4QKzfjjFDybbn_TgQX991tkeb-jYEcwmNqdBmlWwKWJYRwVJjmJYvZk7QWxSRxfRTUEBPDIt8a0uSv0YCroHOZFYmTEyqPUmOroHyzX1jboyte8eeE_JJpUE0sx9_nQ81SHbNRzbhIcnbaVX-ZKbYPB5g-016Fhly3bUqexhYvFRd7Wz75yQPlTNX7gU-iFr3e6kgGUIWRM"
        },
        {
          name: "David Chen",
          role: "Makeup Artist",
          description: "A celebrity makeup artist with a flair for creating glamorous and timeless looks.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnfyqTe4Fof5j3LpqpxEHdhG-_QDpMkqLU708EwZc3dnoJO1Id9TGufNoZBKS6Bflott4kK3yXD6OiNEdZe664KxoNL0mRBTfRcBIBOTw1hn5hllmfq5kfSadsw_yN7y79YEviNwPwP-KrZGogrHWYaBhnpehdags9bcHkdOxnotPoy-OoKVE62wqPbapLKPqvkZUw7UVhjc6d08FxIe1LVGqr6l33SJu3oTPp2sUvSAz4cMgBwBW1sxWLY9eOka5DtP_-wsCWzAQ"
        }
      ],
      testimonials: [
        {
          name: "Sophia Loren",
          quote: "I learned so much in this program! The instructors are amazing and I feel ready to start my career.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrR4gKHbvRnUvAiRHmgc8d_hczMgplltr5juI1cc73Bbga28wEUw8OHnpt5btQMufoNTzHmPowdjzthNpyltbB0eX2wAv_G1RoA0mOBDsZlw4alwVCxkQYYSKv6cXBp8vyI-mEJEBvbnU4zThYqNEDqmd2jLMPCfWR5cHO-B_PH6a6EgtUhpUcS5QMDkVrrtoGoCzyL1_wW13xULK42isU9VTSf7bPd_lLWlAye7PD04wiD-NSpXIzWn0tQvIoSCDk9GkR1QXiA9w"
        }
      ]
    },
    'tattoos-piercing': {
      title: "Diploma in Tattoo Art & Body Piercing",
      description: "Designed for creative individuals who want to master the art and science of permanent body art. Learn to blend artistic vision with medical-grade safety standards.",
      image: "https://media.istockphoto.com/id/1162623180/photo/process-of-creating-tattoo-in-form-of-black-flower.jpg?s=612x612&w=0&k=20&c=79iUS8RSYKXAmLfHkf9S3DgsKXUaj2-jEksKAWMerNA=",
      duration: "6 Months",
      originalPrice: 60000,
      discountedPrice: 48000,
      focus: "Art & Safety",
      certification: "Dual Certificate",
      overview: "This program covers everything from tattoo design principles to advanced machine handling. You will learn how to create custom designs, understand skin structure, and work with different needles and pigments. Uniquely, this course includes complete training in body piercing, ensuring you graduate as a versatile artist ready for studio work or your own practice.",
      curriculum: [
        {
          title: "Module 1: Health, Hygiene & Skin Science",
          description: "Skin structure, infection control, sterilization protocols, and medical safety standards."
        },
        {
          title: "Module 2: Advanced Tattoo Techniques",
          description: "Machine handling, shading techniques, color packing, lining, and custom design creation."
        },
        {
          title: "Module 3: Professional Body Piercing",
          description: "Safe piercing methods, jewelry types, placement techniques, and complication management."
        },
        {
          title: "Module 4: The Studio Professional",
          description: "Client consultation, legalities, aftercare instructions, and building a portfolio."
        }
      ],
      outcomes: [
        "Master tattoo machine handling and needle configurations.",
        "Perform safe, sterile body piercings with confidence.",
        "Design custom artwork tailored to client physiology.",
        "Manage a professional, hygienic studio environment."
      ],
      instructors: [
        {
          name: "Alex 'Inksmith' Rodriguez",
          role: "Head Tattoo Artist",
          description: "A world-renowned tattoo artist with a unique and recognizable style.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvqek5J5oUjZL96nq0gA_pcIwCVtHYjbMFMUOF5ANOXmB-NPBtsAzd_fzOQLmxLNjtKA77vdabL3KNJVLO3X2KpER_DCYJBrO7QWXhPDu_-KE7jTbDhx8Ntb58DstMG3aBZQuaE108NpuckN0Z6HxLAXWu7qid6v0C_MdAN9nM3PmhsRuT8BHuGgz669AjVxwY_XIemGIOtkm5ake4YXNWh0nAo7sNtjJAgLuqSPfANuXbdO9GyLjk9Yb2rHblHkK_VkNsgPmx5RU"
        },
        {
          name: "Samantha 'Sam' Jones",
          role: "Senior Piercer",
          description: "A highly experienced and certified piercer with a passion for safety and precision.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcausY1RJ7Wy0cFjPvEb0KpiOTv_1NBjY_62RZXzQ66LMbJhG8Gznma1GDoPW3bjWdepoZDlVkFxTZ2lye3QA2vdupNqNKc_dX3xu72vtn0LVhw2bSsxU4WMpYEu-we2bzUr6Mbvp5eUYNMEmiZ37ff_sAVg4hbs-q8nZc7Fyzl2hey9TGr1-H-oVizenNpjjsdFIyVJVUFbCbE1hP0k77bWrv4wFvuAtIN71GwjH4yYYFJOYu_lZty-U572UugaQc5qwVNC19oVg"
        }
      ],
      testimonials: [
        {
          name: "'Rook'",
          quote: "This course gave me the confidence to pursue my passion. The instructors are true artists.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4iuzyejuVpO2bhKUIKXzF_A4Q0O5CYXultdigG3c_g9AC7SxS8U7QcMibkmFOf6Kme3k5Dku7zigC5XNTB2bwjQHASEdvpv0DCuRf8PZv0v653XbZcdaKZ-mVql85cyHs2mT-A7_WLILNBwLqf7aGNfbuhvoQWG5l9nAMPN4niNFmx3hwt7klFXT2bxoBCHFS64gcFn-c_fHiR3mUSzBtOyAqpQbX9HqL6k9F7BTBazEK45AAWUuqzj5QvsQi_WUTBUu9UYQEccQ"
        }
      ]
    },
    'nail-art-diploma': {
      title: "Professional Diploma in Nail Art",
      description: "A comprehensive program designed to build professional skills in creative nail design and modern nail care techniques. Master both classic elegance and trending avant-garde styles.",
      image: "https://nailboo.com/cdn/shop/articles/Manicure_2248b30f-65fd-4fb4-bd4b-296644a709e3.jpg?v=1754502555&width=1100",
      duration: "3 Months",
      originalPrice: 30000,
      discountedPrice: 25000,
      focus: "Art & Extensions",
      certification: "Included",
      overview: "This course goes beyond basic manicures. Students get hands-on practice with trending tools and products, learning salon-level finishing techniques. We cover the full spectrum of nail artistry—from the health and anatomy of the nail to complex 3D designs and long-lasting acrylic extensions.",
      curriculum: [
        {
          title: "Module 1: Fundamentals & Safety",
          description: "Nail anatomy, hygiene protocols, safety standards, and professional nail preparation."
        },
        {
          title: "Module 2: Extensions & Gel Systems",
          description: "Mastering Gel polish application, Acrylic extensions, and long-lasting application methods."
        },
        {
          title: "Module 3: Advanced Artistry",
          description: "3D nail art, French designs, glitter work, ombré effects, and color theory."
        },
        {
          title: "Module 4: The Professional Artist",
          description: "Client consultation, nail health assessment, and salon-level finishing techniques."
        }
      ],
      outcomes: [
        "Master acrylics, gels, and 3D art techniques.",
        "Perform hygienic and safe nail services.",
        "Create custom designs based on client consultation.",
        "Work independently as a certified Nail Expert."
      ],
      instructors: [
        {
          name: "'Madame' Butterfly",
          role: "Lead Nail Artist",
          description: "An internationally recognized nail artist with a passion for creative expression.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvqek5J5oUjZL96nq0gA_pcIwCVtHYjbMFMUOF5ANOXmB-NPBtsAzd_fzOQLmxLNjtKA77vdabL3KNJVLO3X2KpER_DCYJBrO7QWXhPDu_-KE7jTbDhx8Ntb58DstMG3aBZQuaE108NpuckN0Z6HxLAXWu7qid6v0C_MdAN9nM3PmhsRuT8BHuGgz669AjVxwY_XIemGIOtkm5ake4YXNWh0nAo7sNtjJAgLuqSPfANuXbdO9GyLjk9Yb2rHblHkK_VkNsgPmx5RU"
        },
        {
          name: "Jenny 'Gels' Kim",
          role: "Nail Technician",
          description: "A certified nail technician with a talent for creating flawless and long-lasting nail enhancements.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcausY1RJ7Wy0cFjPvEb0KpiOTv_1NBjY_62RZXzQ66LMbJhG8Gznma1GDoPW3bjWdepoZDlVkFxTZ2lye3QA2vdupNqNKc_dX3xu72vtn0LVhw2bSsxU4WMpYEu-we2bzUr6Mbvp5eUYNMEmiZ37ff_sAVg4hbs-q8nZc7Fyzl2hey9TGr1-H-oVizenNpjjsdFIyVJVUFbCbE1hP0k77bWrv4wFvuAtIN71GwjH4yYYFJOYu_lZty-U572UugaQc5qwVNC19oVg"
        }
      ],
      testimonials: [
        {
          name: "Sparkle",
          quote: "I can't believe how much I learned in just 3 months. I'm already getting clients!",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4iuzyejuVpO2bhKUIKXzF_A4Q0O5CYXultdigG3c_g9AC7SxS8U7QcMibkmFOf6Kme3k5Dku7zigC5XNTB2bwjQHASEdvpv0DCuRf8PZv0v653XbZcdaKZ-mVql85cyHs2mT-A7_WLILNBwLqf7aGNfbuhvoQWG5l9nAMPN4niNFmx3hwt7klFXT2bxoBCHFS64gcFn-c_fHiR3mUSzBtOyAqpQbX9HqL6k9F7BTBazEK45AAWUuqzj5QvsQi_WUTBUu9UYQEccQ"
        }
      ]
    },
    'painting-crafting': {
      title: "Certificate in Painting & Creative Crafts",
      description: "Designed to unlock creativity and develop strong artistic fundamentals. Whether you are a beginner or building a portfolio, this course explores the endless possibilities of color and texture.",
      image: "https://www.thesprucecrafts.com/thmb/fRiKQLuNA2JLZalLQwzxc50upto=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-922707682-5b90467bc9e77c0025931eef.jpg",
      duration: "3 Months",
      originalPrice: 25000,
      discountedPrice: 20000,
      focus: "Fine Art & DIY",
      certification: "Certificate of Completion",
      overview: "This program is a journey through artistic expression. We teach a variety of painting techniques—watercolor, acrylic, and shading—along with hands-on crafting skills. You will learn material handling and composition while exploring your own unique style through fun, skill-building sessions.",
      curriculum: [
        {
          title: "Module 1: Art Fundamentals",
          description: "Mastering sketching, shading techniques, color theory, and understanding composition."
        },
        {
          title: "Module 2: Painting Mastery",
          description: "Hands-on practice with Watercolors and Acrylics. Learning brush techniques and material handling."
        },
        {
          title: "Module 3: Creative Crafting",
          description: "DIY art projects, decorative pieces, paper crafts, and texture work."
        },
        {
          title: "Module 4: Design & Portfolio",
          description: "Mixed media projects, creative design principles, and building a portfolio for future opportunities."
        }
      ],
      outcomes: [
        "Master essential painting techniques in multiple mediums.",
        "Create professional-grade DIY crafts and decor.",
        "Understand color theory and visual composition.",
        "Build a diverse artistic portfolio."
      ],
      instructors: [
        {
          name: "Bob Ross Jr.",
          role: "Lead Painting Instructor",
          description: "A certified Bob Ross instructor who will teach you how to paint happy little trees.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvqek5J5oUjZL96nq0gA_pcIwCVtHYjbMFMUOF5ANOXmB-NPBtsAzd_fzOQLmxLNjtKA77vdabL3KNJVLO3X2KpER_DCYJBrO7QWXhPDu_-KE7jTbDhx8Ntb58DstMG3aBZQuaE108NpuckN0Z6HxLAXWu7qid6v0C_MdAN9nM3PmhsRuT8BHuGgz669AjVxwY_XIemGIOtkm5ake4YXNWh0nAo7sNtjJAgLuqSPfANuXbdO9GyLjk9Yb2rHblHkK_VkNsgPmx5RU"
        },
        {
          name: "Martha Stewart's cousin",
          role: "Crafting Guru",
          description: "A crafting expert who can turn anything into a work of art.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcausY1RJ7Wy0cFjPvEb0KpiOTv_1NBjY_62RZXzQ66LMbJhG8Gznma1GDoPW3bjWdepoZDlVkFxTZ2lye3QA2vdupNqNKc_dX3xu72vtn0LVhw2bSsxU4WMpYEu-we2bzUr6Mbvp5eUYNMEmiZ37ff_sAVg4hbs-q8nZc7Fyzl2hey9TGr1-H-oVizenNpjjsdFIyVJVUFbCbE1hP0k77bWrv4wFvuAtIN71GwjH4yYYFJOYu_lZty-U572UugaQc5qwVNC19oVg"
        }
      ],
      testimonials: [
        {
          name: "A Happy Little Cloud",
          quote: "This class was so much fun! I made a lot of happy accidents.",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4iuzyejuVpO2bhKUIKXzF_A4Q0O5CYXultdigG3c_g9AC7SxS8U7QcMibkmFOf6Kme3k5Dku7zigC5XNTB2bwjQHASEdvpv0DCuRf8PZv0v653XbZcdaKZ-mVql85cyHs2mT-A7_WLILNBwLqf7aGNfbuhvoQWG5l9nAMPN4niNFmx3hwt7klFXT2bxoBCHFS64gcFn-c_fHiR3mUSzBtOyAqpQbX9HqL6k9F7BTBazEK45AAWUuqzj5QvsQi_WUTBUu9UYQEccQ"
        }
      ]
    }
  }

  const program = programDetails[programId] || programDetails['hair-artistry']
  const displayPrice = finalPrice !== null ? finalPrice : (program.discountedPrice || null)
  const showPrice = program.originalPrice && program.discountedPrice

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow pt-20 sm:pt-24">
        {/* Hero Section */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full">
            <div className="flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl shadow-xl" style={{backgroundSize: '120%', backgroundPosition: 'center', backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("${program.image}")`}}>
              <div className="p-8 md:p-12">
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{program.title}</h1>
                <p className="mt-2 max-w-2xl text-lg text-gray-200">{program.description}</p>
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white/50 p-6 shadow-xl">
              <p className="text-base font-medium text-text-color">Duration</p>
              <p className="text-3xl font-bold tracking-tight text-text-color">{program.duration}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white/50 p-6 shadow-xl">
              <p className="text-base font-medium text-text-color">Focus</p>
              <p className="text-lg font-bold tracking-tight text-text-color">{program.focus}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-black/10 bg-white/50 p-6 shadow-xl">
              <p className="text-base font-medium text-text-color">Certification</p>
              <p className="text-2xl font-bold tracking-tight text-text-color">{program.certification}</p>
            </div>
            <button 
              onClick={handleEnroll}
              className="flex items-center justify-center rounded-xl bg-accent px-6 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-accent/90"
            >
              Enroll Now
            </button>
          </div>

          {/* Price Section */}
          {showPrice && (
            <div className="mt-8 rounded-xl border border-black/10 bg-white/50 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-primary mb-4">Course Pricing</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-text-color/70 mb-1">Original Price</p>
                    <p className="text-2xl font-bold text-text-color line-through">₹{program.originalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-color/70 mb-1">Discounted Price</p>
                    <p className="text-2xl font-bold text-primary">₹{program.discountedPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-text-color/70 mb-1">You Save</p>
                    <p className="text-xl font-bold text-accent">
                      ₹{(program.originalPrice - program.discountedPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mt-4 pt-4 border-t border-black/10">
                  <p className="text-sm font-medium text-text-color mb-2">Have a coupon code?</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {validatingCoupon ? 'Validating...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Coupon Applied:</span> {appliedCoupon.code} - 
                        {appliedCoupon.discountType === 'percentage' 
                          ? ` ${appliedCoupon.discountValue}% off`
                          : ` ₹${appliedCoupon.discountValue} off`}
                      </p>
                      <p className="text-lg font-bold text-green-800 mt-2">
                        Final Price: ₹{displayPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Overview */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Program Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-text-color">{program.overview}</p>
          </div>

          {/* Curriculum & Outcomes */}
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-primary">Curriculum Breakdown</h3>
              <div className="mt-4 space-y-4">
                {program.curriculum.map((module, index) => (
                  <details key={index} className="group rounded-xl border border-black/10 bg-white/50 p-4 shadow-xl" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-text-color">
                      {module.title}
                      <span className="transition-transform group-open:rotate-180">
                        <span className="material-symbols-outlined text-accent">expand_more</span>
                      </span>
                    </summary>
                    <p className="mt-2 text-sm text-text-color">{module.description}</p>
                  </details>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">Learning Outcomes</h3>
              <ul className="mt-4 space-y-3">
                {program.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-symbols-outlined mr-2 text-accent">check_circle</span>
                    <span className="text-text-color">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
        
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProgramDetailPage

