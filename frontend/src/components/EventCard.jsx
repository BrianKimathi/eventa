import React from 'react';
import { Calendar, MapPin, Ticket, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventCard = ({ event }) => {
  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const minPrice = event.ticketTypes && event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : 0;

  return (
    <div className="card-solid flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Cover Image */}
        <div className="relative h-44 -mx-5 -mt-5 mb-4 overflow-hidden bg-slate-950">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 right-3 bg-slate-900/90 text-sky-400 border border-slate-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Tag size={12} /> {event.category}
          </span>
        </div>

        {/* Info */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 text-xs text-slate-300 mb-5">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-indigo-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-indigo-400" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 block">Starting from</span>
          <span className="text-base font-extrabold text-white">${minPrice.toFixed(2)}</span>
        </div>

        <Link to={`/events/${event.id}`} className="btn-primary text-xs px-3 py-1.5">
          <Ticket size={14} /> Get Tickets
        </Link>
      </div>
    </div>
  );
};
