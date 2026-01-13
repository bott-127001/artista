import { Link } from 'react-router-dom'
import Logo from './Logo'

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background-light py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:text-left">
          <div>
            <h3 className="text-lg font-bold text-text-color">Salon Artista</h3>
            <p className="mt-2 text-sm text-text-color/80"> Where Beauty Meets Artistry</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-color">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/services" className="text-sm text-text-color/80 hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/staff" className="text-sm text-text-color/80 hover:text-primary">
                  Our Staff
                </Link>
              </li>
              <li>
                <Link to="/academics" className="text-sm text-text-color/80 hover:text-primary">
                  Academics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-color">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="mailto:info@salonartista.com" className="text-sm text-text-color/80 hover:text-primary">
                  artistabysupriya@gmail.com
                </a>
              </li>
              <li>
                <p className="text-sm text-text-color/80">Office no. 01, A-Wing, Nirmiti Elite, Law College Rd, beside Starbucks, Shanti Sheela Society, Apex Colony, Erandwane, Pune, Maharashtra 411004</p>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-sm text-text-color/80 hover:text-primary">
                  +91 7066110033
                </a>
              </li>
              
              <li>
                <p className="text-sm text-text-color/80">ARTISTA House Of Beauty, Shop No.4, New DP Road, Yashada Epic Commercials, Vishal Nagar, Pimple Nilakh, Pimpri-Chinchwad, Pune- 411027</p>
              </li>
              <li>
              <a href="tel:+1234567890" className="text-sm text-text-color/80 hover:text-primary">
                  +91 7038873333
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-color">Follow Us</h3>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <a className="text-text-color/80 hover:text-primary" href="https://www.facebook.com/p/ARTISTA-100063905115709/" aria-label="Facebook">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
                </svg>
              </a>
              <a className="text-text-color/80 hover:text-primary" href="https://www.instagram.com/artistahouseofbeauty/?hl=en" aria-label="Instagram">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363.416 2.427.465C9.795 2.013 10.148 2 12.315 2zm-1.118 4.869A5.235 5.235 0 0012 17.5a5.235 5.235 0 005.23-5.631A5.235 5.235 0 0012 6.237a5.235 5.235 0 00-5.23 5.632zM12 15.655A3.59 3.59 0 018.41 12a3.59 3.59 0 013.59-3.59 3.59 3.59 0 013.59 3.59A3.59 3.59 0 0112 15.655zM18.485 5.756a1.182 1.182 0 100 2.364 1.182 1.182 0 000-2.364z" fillRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-text-color/10 pt-8 text-center text-sm text-text-color/60">
          <p>© {currentYear} Salon Artista. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

