import React, { useState } from 'react';
import { MOCK_EVENTS } from '../services/mockData';
import { EventCard } from '../components/EventCard';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

export const HomePage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tech', 'Music', 'Business', 'Arts'];

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory && event.status === 'PUBLISHED';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Banner (Solid Colors) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-950 text-indigo-400 border border-indigo-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <Sparkles size={14} /> Live Event Ticketing Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Discover & Book Extraordinary Events
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            From tech summits to live music festivals — secure your spot with instant digital QR passes.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search events by keyword, category, or venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-solid pl-10 py-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <SlidersHorizontal size={14} /> Showing {filteredEvents.length} Events
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <p className="text-slate-400 font-medium">No published events found matching your search filters.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('All'); }} className="btn-secondary text-xs">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
