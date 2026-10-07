import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Trash2, Image, MapPin, Calendar, Upload, CheckCircle2 } from 'lucide-react';
import * as api from '../services/api';

export const CreateEventPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('Tech');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80');
  const [totalCapacity, setTotalCapacity] = useState(500);

  const [ticketTypes, setTicketTypes] = useState([
    { name: 'General Admission', price: 100, availableQuantity: 350 },
    { name: 'VIP All-Access', price: 300, availableQuantity: 150 }
  ]);

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: 0, availableQuantity: 50 }]);
  };

  const removeTicketType = (index) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent({
        title,
        description,
        venue,
        category,
        imageUrl,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalCapacity: Number(totalCapacity),
        availableTickets: Number(totalCapacity),
        ticketTypes: ticketTypes.map(t => ({
          name: t.name || 'Standard Pass',
          price: Number(t.price),
          capacity: Number(t.availableQuantity),
          availableQuantity: Number(t.availableQuantity)
        }))
      });
      alert('Event published successfully!');
      navigate('/admin/events');
    } catch {
      alert('Failed to publish event. Please check required fields and dates.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button onClick={() => navigate('/admin/events')} className="inline-flex items-center gap-2 text-xs font-bold text-[#6e7191] hover:text-[#f23e14] transition-colors">
        <ArrowLeft size={16} /> Back to Events Directory
      </button>

      {/* ShopKing Styled Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Multi-Step Form */}
        <div className="lg:col-span-3 card-solid space-y-6">
          <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#1f1f39] flex items-center gap-2">
                <PlusCircle className="text-[#f23e14]" size={22} /> Create & Publish Event
              </h1>
              <p className="text-xs text-[#6e7191] mt-0.5 font-medium">Professional organizer publishing wizard</p>
            </div>

            {/* Stepper Pill */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full font-bold transition-all ${step === 1 ? 'bg-[#f23e14] text-white shadow-sm' : 'bg-gray-100 text-[#6e7191]'}`}>1. Info</span>
              <span className={`px-3 py-1 rounded-full font-bold transition-all ${step === 2 ? 'bg-[#f23e14] text-white shadow-sm' : 'bg-gray-100 text-[#6e7191]'}`}>2. Tickets</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Global Tech Summit 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-solid"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Event overview, agenda, keynote speakers..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-solid"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6e7191] uppercase">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-solid">
                      <option value="Tech">Tech</option>
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6e7191] uppercase">Venue Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Convention Center"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="input-solid"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6e7191] uppercase">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-solid text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6e7191] uppercase">End Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-solid text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#6e7191] uppercase">Event Poster Image URL</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-[#fff4f1]/50 text-center space-y-2">
                    <Upload className="mx-auto text-[#f23e14]" size={26} />
                    <input
                      type="url"
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="input-solid text-xs text-center"
                    />
                    <span className="text-[11px] text-[#6e7191] block font-medium">Supported formats: JPG, PNG, WebP</span>
                  </div>
                </div>

                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full justify-center py-3 text-xs">
                  Continue to Ticket Setup →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#1f1f39] uppercase tracking-wide">Ticket Tiers Configuration</h3>
                  <button type="button" onClick={addTicketType} className="btn-secondary text-xs">
                    + Add Ticket Tier
                  </button>
                </div>

                {ticketTypes.map((tier, idx) => (
                  <div key={idx} className="bg-[#f7f7fc] p-4 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Tier Name (e.g. VIP Pass)"
                        value={tier.name}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[idx].name = e.target.value;
                          setTicketTypes(updated);
                        }}
                        className="input-solid flex-1"
                      />

                      <input
                        type="number"
                        placeholder="Price ($)"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[idx].price = Number(e.target.value);
                          setTicketTypes(updated);
                        }}
                        className="input-solid w-28"
                      />

                      {ticketTypes.length > 1 && (
                        <button type="button" onClick={() => removeTicketType(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3 text-xs">
                    ← Back to Info
                  </button>
                  <button type="submit" className="btn-primary flex-1 justify-center py-3 text-xs">
                    Publish Event Now
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Live Event Card Preview */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-xs font-extrabold text-[#6e7191] uppercase tracking-wider block">Live Public Preview</span>
          <div className="card-solid space-y-4">
            <div className="h-48 -mx-6 -mt-6 overflow-hidden bg-gray-100 rounded-t-2xl relative">
              <img src={imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'} alt="Preview" className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 bg-white/90 text-[#f23e14] border border-gray-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                {category}
              </span>
            </div>

            <h3 className="font-extrabold text-[#1f1f39] text-xl">{title || 'Event Title Preview'}</h3>
            <p className="text-xs text-[#6e7191] line-clamp-2 leading-relaxed">{description || 'Event description will appear here...'}</p>

            <div className="space-y-2.5 text-xs text-[#6e7191] font-semibold pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#f23e14]" />
                <span>{startDate ? new Date(startDate).toLocaleDateString() : 'Date TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#f23e14]" />
                <span>{venue || 'Venue Location TBD'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
