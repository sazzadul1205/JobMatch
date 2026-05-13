// resources/js/layouts/PublicLayout.jsx

// React
import React from 'react';

// Components
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Dumbbell } from 'lucide-react';

const PublicLayout = ({ children }) => {
  return (
    <div className='bg-white' >
      <TopBar />
      <Navbar />
      <main className=" mx-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;