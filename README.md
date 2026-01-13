# Salon Artista - React Website

A modern, responsive React website for Salon Artista, featuring beautiful designs and smooth navigation.

## Features

- 🎨 **Modern Design** - Beautiful, responsive UI built with Tailwind CSS
- ⚡ **Fast Performance** - Built with Vite for optimal performance
- 🧭 **Navigation** - React Router for seamless page navigation
- 📱 **Responsive** - Mobile-first design that works on all devices
- 🎯 **Multiple Pages**:
  - Homepage with hero section, services overview, products showcase, team highlights, and testimonials
  - Services page with detailed service categories
  - Products page with product listings and filters
  - Staff page with team member profiles
  - Academics page showcasing training programs
  - Program detail page with comprehensive program information

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
salon-artista/
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Navigation header component
│   │   ├── Footer.jsx      # Footer component
│   │   └── Logo.jsx        # Logo component
│   ├── pages/
│   │   ├── HomePage.jsx           # Homepage
│   │   ├── ServicesPage.jsx       # Services listing page
│   │   ├── ProductsPage.jsx       # Products shop page
│   │   ├── StaffPage.jsx          # Team/staff page
│   │   ├── AcademicsPage.jsx      # Academics overview page
│   │   └── ProgramDetailPage.jsx  # Individual program detail page
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles and Tailwind imports
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md             # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **React Router 6** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **Material Symbols** - Icon library

## Color Scheme

The design uses a beautiful color palette:
- **Primary**: `#556B2F` (Rich Olive Green)
- **Accent**: `#D4AF37` (Warm Gold)
- **Background Light**: `#FAF0E6` (Pale Cream)
- **Text Color**: `#38471F` (Dark Olive)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Salon Artista. All Rights Reserved.

