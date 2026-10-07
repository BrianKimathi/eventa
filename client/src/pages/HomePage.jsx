import React, { useState, useEffect } from 'react';
import { EventCard } from '../components/EventCard';
import * as api from '../services/api';
import { Search, Sparkles, SlidersHorizontal, AlertCircle, ArrowRight, MapPin, Calendar, ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getPublishedEvents()
      .then(eventsData => setEvents(eventsData || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Featured events for auto-sliding hero (up to 5 featured/published events)
  const heroEvents = events.slice(0, 5);

  // Auto-play slider effect every 5 seconds if there are 2 or more events
  useEffect(() => {
    if (heroEvents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroEvents.length]);

  const dynamicCategories = ['All', ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (event.description || '').toLowerCase().includes(search.toLowerCase()) ||
                          (event.venue || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeHeroEvent = heroEvents[currentHeroIndex];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section — ShopKing Clean Light Theme with Auto-Sliding Backend Events */}
      <section className="relative bg-[#fff4f1] border-b border-gray-100 overflow-hidden py-16 sm:py-24">
        {activeHeroEvent && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Hero Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-white text-[#f23e14] border border-[#f23e14]/30 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-sm">
                  <Sparkles size={14} /> FEATURED EVENT #{currentHeroIndex + 1}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1f1f39] tracking-tight leading-tight">
                  {activeHeroEvent.title}
                </h1>

                <p className="text-[#6e7191] text-base sm:text-lg line-clamp-3 leading-relaxed">
                  {activeHeroEvent.description || 'Book your tickets now for this upcoming live event experience.'}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-bold text-[#1f1f39] pt-2">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                    <Calendar size={16} className="text-[#f23e14]" />
                    <span>{new Date(activeHeroEvent.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                    <MapPin size={16} className="text-[#f23e14]" />
                    <span>{activeHeroEvent.venue || 'TBA'}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-4">
                  <Link to={`/events/${activeHeroEvent.id}`} className="btn-primary text-sm px-8 py-3.5 font-extrabold">
                    <Ticket size={18} /> Book Tickets Now <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Hero Event Poster Card */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className="bg-white p-3 rounded-3xl border border-gray-100 shadow-2xl relative group">
                  <img
                    src={activeHeroEvent.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={activeHeroEvent.title}
                    className="w-full h-88 object-cover rounded-2xl"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#f23e14] block uppercase">{activeHeroEvent.category}</span>
                      <span className="text-base font-extrabold text-[#1f1f39] truncate max-w-[220px] block">{activeHeroEvent.title}</span>
                    </div>
                    <Link to={`/events/${activeHeroEvent.id}`} className="btn-primary text-xs px-4 py-2">
                      View Event
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Slide Navigation Controls & Indicators */}
            {heroEvents.length > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-[#f23e14]/10 pt-6">
                <div className="flex items-center gap-2">
                  {heroEvents.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentHeroIndex === idx ? 'w-10 bg-[#f23e14]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentHeroIndex(prev => (prev - 1 + heroEvents.length) % heroEvents.length)}
                    className="p-3 rounded-full bg-white border border-gray-200 text-[#1f1f39] hover:text-[#f23e14] hover:border-[#f23e14] shadow-sm transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentHeroIndex(prev => (prev + 1) % heroEvents.length)}
                    className="p-3 rounded-full bg-white border border-gray-200 text-[#1f1f39] hover:text-[#f23e14] hover:border-[#f23e14] shadow-sm transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Discover Events Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" id="discover-events">
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-5 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events by title, venue or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-solid pl-14 py-4 text-base rounded-full shadow-sm"
          />
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#f23e14] text-white shadow-md'
                    : 'bg-white text-[#6e7191] hover:bg-[#fff4f1] hover:text-[#1f1f39] border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#6e7191] shrink-0">
            <SlidersHorizontal size={16} className="text-[#f23e14]" />
            <span>Showing {filteredEvents.length} Events</span>
          </div>
        </div>

        {/* Tiles Grid */}
        {loading ? (
          <div className="p-20 text-center text-[#6e7191] space-y-3">
            <div className="w-10 h-10 border-3 border-[#f23e14] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold">Loading Live Events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 shadow-sm">
            <AlertCircle className="mx-auto text-gray-400" size={40} />
            <h3 className="text-xl font-extrabold text-[#1f1f39]">No events found</h3>
            <p className="text-[#6e7191] text-xs max-w-sm mx-auto">
              Try selecting a different category or clearing your search filter to discover events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
