import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';

export const EventCard = ({ event }) => {
  if (!event) return null;

  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Upcoming';

  const lowestPrice = event.ticketTypes && event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map(t => t.price || 0))
    : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-[#f23e14]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group shadow-sm">
      <div className="relative overflow-hidden h-52 bg-gray-100">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur border border-gray-200 text-[#1f1f39] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {event.category || 'General'}
        </div>
        <div className="absolute bottom-3 right-3 bg-[#f23e14] text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
          {lowestPrice > 0 ? `$${lowestPrice.toFixed(2)}` : 'Free / Paid'}
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-bold text-[#1f1f39] text-base line-clamp-1 group-hover:text-[#f23e14] transition-colors">
            {event.title}
          </h3>
          <p className="text-[#6e7191] text-xs line-clamp-2 leading-relaxed font-normal">
            {event.description || 'Join us for this live event experience.'}
          </p>
        </div>

        <div className="space-y-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between text-xs text-[#6e7191] gap-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Calendar size={14} className="text-[#f23e14]" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 font-semibold truncate max-w-[140px]">
              <MapPin size={14} className="text-[#f23e14] shrink-0" />
              <span className="truncate">{event.venue || 'TBA'}</span>
            </span>
          </div>

          <Link
            to={`/events/${event.id}`}
            className="btn-secondary w-full justify-center text-xs py-2.5 font-bold group-hover:bg-[#f23e14] group-hover:text-white group-hover:border-[#f23e14] transition-all"
          >
            Get Tickets <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
