import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AuthModalPage } from './pages/AuthModalPage';
import { ContactPage, AboutPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ClientProfilePage } from './pages/ClientProfilePage';
import * as api from './services/api';

export default function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getPlatformSettings()
      .then(res => setSettings(res))
      .catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f7f7fc] text-[#1f1f39] flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/profile" element={<ClientProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/auth" element={<AuthModalPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer settings={settings} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
