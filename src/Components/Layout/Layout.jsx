import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import GlobalChat from '../Chat/GlobalChat';

export default function Layout() {
  return (
    <div className="app-root d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <GlobalChat />
    </div>
  );
}
