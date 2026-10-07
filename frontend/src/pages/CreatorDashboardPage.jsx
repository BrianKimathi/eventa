import React, { useState } from 'react';
import { MOCK_EVENTS } from '../services/mockData';
import { Plus, BarChart3, Scan, Calendar, Ticket, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreatorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [validateCode, setValidateCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const creatorEvents = MOCK_EVENTS.filter(e => e.creatorId === 2);

  const handleValidate = (e) => {
    e.preventDefault();
    if (validateCode.trim().toUpperCase().startsWith('TKT-')) {
      setValidationResult({
        valid: true,
        code: validateCode.toUpperCase(),
        attendee: 'John Doe',
        ticketType: 'General Admission',
        eventTitle: 'Global Tech Summit 2026'
      });
    } else {
      setValidationResult({
        valid: false,
        message: 'Invalid Purchase Code. Code must start with TKT-'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Creator Studio</h1>
          <p className="text-slate-400 text-sm mt-1">Manage events, track ticket sales, and scan gate entry passes.</p>
        </div>

        <Link to="/creator/create-event" className="btn-primary">
          <Plus size={18} /> Create New Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
            activeTab === 'events' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Calendar size={16} /> My Events
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
            activeTab === 'scanner' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Scan size={16} /> Gate Entry Scanner
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creatorEvents.map(evt => (
            <div key={evt.id} className="card-solid space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  evt.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {evt.status}
                </span>

                <span className="text-xs text-slate-500 font-semibold">{evt.category}</span>
              </div>

              <h3 className="text-lg font-bold text-white">{evt.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Total Capacity</span>
                  <span className="font-bold text-white">{evt.totalCapacity}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tickets Available</span>
                  <span className="font-bold text-white">{evt.availableTickets}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tickets Sold</span>
                  <span className="font-bold text-indigo-400">{evt.totalCapacity - evt.availableTickets}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gate Entry Scanner Tab */}
      {activeTab === 'scanner' && (
        <div className="max-w-xl mx-auto card-solid space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scan className="text-indigo-400" size={20} /> Gate Ticket Validator
          </h2>

          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block uppercase mb-1">Enter Purchase Code</label>
              <input
                type="text"
                placeholder="e.g. TKT-8F39A1B2"
                value={validateCode}
                onChange={(e) => setValidateCode(e.target.value)}
                className="input-solid uppercase font-mono tracking-wider"
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center">
              Validate Pass
            </button>
          </form>

          {validationResult && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              validationResult.valid ? 'bg-emerald-950 border-emerald-800 text-emerald-200' : 'bg-rose-950 border-rose-800 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {validationResult.valid ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{validationResult.valid ? 'VALID PASS — ENTRY ALLOWED' : 'VALIDATION FAILED'}</span>
              </div>

              {validationResult.valid ? (
                <div className="text-xs space-y-1 text-slate-300 border-t border-emerald-800/60 pt-2">
                  <p><strong>Code:</strong> {validationResult.code}</p>
                  <p><strong>Attendee:</strong> {validationResult.attendee}</p>
                  <p><strong>Tier:</strong> {validationResult.ticketType}</p>
                </div>
              ) : (
                <p className="text-xs text-rose-300">{validationResult.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
