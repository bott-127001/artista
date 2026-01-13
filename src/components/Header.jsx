import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between whitespace-nowrap bg-white px-3 sm:px-4 md:px-6 lg:px-10 pt-3 pb-2 sm:pt-3 sm:pb-2.5 md:pt-1.5 md:pb-1.5 shadow-md">
      <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0">
        <Logo />
      </Link>
      <nav className="hidden md:flex flex-1 justify-center gap-9">
        <Link 
          to="/" 
          className={`text-sm font-medium hover:text-primary transition-colors ${
            isActive('/') ? 'text-primary' : 'text-text-color/70'
          }`}
        >
          Home
        </Link>
        <Link 
          to="/services" 
          className={`text-sm font-medium hover:text-primary transition-colors ${
            isActive('/services') ? 'text-primary font-bold' : 'text-text-color/70'
          }`}
        >
          Services
        </Link>
        <Link 
          to="/staff" 
          className={`text-sm font-medium hover:text-primary transition-colors ${
            isActive('/staff') ? 'text-primary font-bold' : 'text-text-color/70'
          }`}
        >
          Staff
        </Link>
        <Link 
          to="/academics" 
          className={`text-sm font-medium hover:text-primary transition-colors ${
            isActive('/academics') ? 'text-primary font-bold' : 'text-text-color/70'
          }`}
        >
          Academics
        </Link>
      </nav>
      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/booking" className="hidden md:block" onClick={closeMobileMenu}>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-accent text-white text-sm font-bold shadow-lg transition-transform hover:scale-105">
            <span className="truncate">Book Appointment</span>
          </button>
        </Link>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-text-color hover:bg-primary/10 transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-text-color/10 md:hidden">
          <nav className="flex flex-col p-4">
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              className={`py-3 px-4 text-base font-medium hover:text-primary transition-colors rounded-xl ${
                isActive('/') ? 'text-primary bg-primary/10' : 'text-text-color/70'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              onClick={closeMobileMenu}
              className={`py-3 px-4 text-base font-medium hover:text-primary transition-colors rounded-xl ${
                isActive('/services') ? 'text-primary bg-primary/10 font-bold' : 'text-text-color/70'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/staff" 
              onClick={closeMobileMenu}
              className={`py-3 px-4 text-base font-medium hover:text-primary transition-colors rounded-xl ${
                isActive('/staff') ? 'text-primary bg-primary/10 font-bold' : 'text-text-color/70'
              }`}
            >
              Staff
            </Link>
            <Link 
              to="/academics" 
              onClick={closeMobileMenu}
              className={`py-3 px-4 text-base font-medium hover:text-primary transition-colors rounded-xl ${
                isActive('/academics') ? 'text-primary bg-primary/10 font-bold' : 'text-text-color/70'
              }`}
            >
              Academics
            </Link>
            <Link 
              to="/booking" 
              onClick={closeMobileMenu}
              className="mt-2"
            >
              <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-accent text-white text-sm font-bold shadow-lg transition-transform hover:scale-105">
                <span>Book Appointment</span>
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

