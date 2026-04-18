import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Zap, Loader, Battery } from 'lucide-react';
import VehicleCardInChat from './VehicleCardInChat';
import BookingCardInChat from './BookingCardInChat';
import AlternativeSlotsCard from './AlternativeSlotsCard';
import BookingModal from './BookingModal';
import apiService from '../../services/api';

/**
 * Renders a sleek UI pill for the booking context sentinel.
 */
function ContextPill({ rawContext, darkMode }) {
  // Parse: [BOOKING_CONTEXT: station=...|connector=...|max_power_kw=...|charger_type=...]
  const parts = rawContext.slice(17, -1).split('|');
  const ctx = {};
  parts.forEach(p => {
    const [k, v] = p.split('=');
    if (k) ctx[k.trim()] = v?.trim();
  });

  if (!ctx.station) return null;

  return (
    <div className={`mt-2 flex flex-wrap gap-2 p-3 rounded-xl border ${
      darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-emerald-100 shadow-sm'
    } border-dashed`}>
      <div className="w-full text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">
        Current Selection
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
        darkMode ? 'bg-gray-900 text-gray-300' : 'bg-emerald-50 text-emerald-700'
      }`}>
        <MapPin className="w-3 h-3" /> {ctx.station}
      </div>
      {ctx.connector && (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
          darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
        }`}>
          <Zap className="w-3 h-3 text-amber-500" /> {ctx.connector}
        </div>
      )}
      {ctx.battery && ctx.battery !== 'None' && (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
          darkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <Battery className="w-3 h-3" /> {ctx.battery}%
        </div>
      )}
      {ctx.max_power_kw && (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
          darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'
        }`}>
          <Battery className="w-3 h-3 text-emerald-500" /> {ctx.max_power_kw}kW
        </div>
      )}
      {ctx.charger_type && (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium opacity-70 ${
          darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}>
          {ctx.charger_type}
        </div>
      )}
    </div>
  );
}

/**
 * Renders a chat message content, converting **bold** markdown to <strong>
 * and [BOOKING_CONTEXT] to a visual pill component.
 */
function ChatText({ content, darkMode }) {
  // Split by bold patterns and booking context markers
  const parts = content.split(/(\[BOOKING_CONTEXT:[^\]]+\]|\*\*[^*]+\*\*)/g);
  
  return (
    <div className="leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (!part) return null;
        
        if (part.startsWith('[BOOKING_CONTEXT:')) {
          return <ContextPill key={i} rawContext={part} darkMode={darkMode} />;
        }
        
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-emerald-600 dark:text-emerald-400">{part.slice(2, -2)}</strong>;
        }
        
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

function AgentTab({ userProfile, userProfile: _up, userLocation, stations, vehicles, darkMode }) {
  const firstName = userProfile?.name?.split(' ')[0] ?? 'there';

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${firstName}! I'm your ChargeX Assistant.\nTry: *"Book Central EV at 2pm today"* and I'll handle the rest.`,
      ui_component: null,
      hiddenContent: null,
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Map state driven by the agent
  const [agentStations, setAgentStations] = useState([]);

  // Booking modal state (fallback)
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookingData, setBookingData] = useState({
    stationId: null, vehicleId: null, slotId: null, connectorType: '',
    currentBattery: 50, date: new Date().toISOString().split('T')[0],
    timeSlot: '', duration: 2, estimatedCost: 0
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Build the chat history array for the backend.
   * Each message uses hiddenContent (if set) for what the LLM sees,
   * and content for what the user sees on screen.
   */
  const buildHistory = (msgList) =>
    msgList.map(m => ({
      role: m.role,
      content: m.hiddenContent ?? m.content,
    }));

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const currentHistory = buildHistory(messages);

    setMessages(prev => [...prev, { role: 'user', content: userText, ui_component: null, hiddenContent: null }]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiService.chatWithAgent(userText, currentHistory, vehicles, agentStations);
      console.log('[AgentTab] response:', response);

      // The backend may return a _ctx_cookie that we must embed as a hidden
      // assistant message so that future calls can recover booking context.
      const assistantHidden = response._ctx_cookie
        ? response.text + response._ctx_cookie
        : null;

      const newMsg = {
        role: 'assistant',
        content: response.text,
        hiddenContent: assistantHidden,
        ui_component: response.ui_component ?? null,
      };

      setMessages(prev => [...prev, newMsg]);

      if (response.ui_component?.type === 'station_list') {
        setAgentStations(response.ui_component.data);
      }
    } catch (error) {
      console.error('Error in agent chat:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or use the Manual Booking tab.",
        ui_component: null,
        hiddenContent: null,
      }]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Called when the user clicks a vehicle card.
   * Sends a hidden sentinel + continues the conversation.
   */
  const handleVehicleSelect = async (vehicle) => {
    const hiddenMsg = `[VEHICLE_SELECTED: vehicle_id=${vehicle.id}, connector_type=${vehicle.connector_type}]`;
    const displayMsg = `Selected: ${vehicle.brand} ${vehicle.model}`;

    const currentHistory = buildHistory(messages);

    // Add user message (display ≠ hidden)
    setMessages(prev => [
      ...prev,
      { role: 'user', content: displayMsg, hiddenContent: hiddenMsg, ui_component: null }
    ]);
    setLoading(true);

    try {
      const response = await apiService.chatWithAgent(hiddenMsg, currentHistory, vehicles, agentStations);
      console.log('[AgentTab] vehicle select response:', response);

      const assistantHidden = response._ctx_cookie
        ? response.text + response._ctx_cookie
        : null;

      const newMsg = {
        role: 'assistant',
        content: response.text,
        hiddenContent: assistantHidden,
        ui_component: response.ui_component ?? null,
      };

      setMessages(prev => [...prev, newMsg]);

      if (response.ui_component?.type === 'station_list') {
        setAgentStations(response.ui_component.data);
      }
    } catch (error) {
      console.error('Error after vehicle select:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble booking with this vehicle right now. Please try again.",
        ui_component: null,
        hiddenContent: null,
      }]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Called when user picks an alternative station card.
   * Sends a message to book at that specific station.
   */
  const handleAlternativeSelect = async (station) => {
    let text = `Book at ${station.name}`;
    if (station.is_time_suggestion) {
      // Re-use original name if provided to avoid "Wait for..." string being used as the key
      const displayName = station.original_station_name || station.name;
      text = `Book at ${displayName} at ${station.suggested_time}`;
    }
    setInput(text);
    // Automatically trigger send for smooth UX
    setTimeout(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn && !btn.disabled) btn.click();
    }, 50);
  };

  return (
    <div className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
      <div className="h-full flex flex-col">

        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-emerald-50'} flex items-center gap-3`}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-emerald-900'}`}>ChargeX Agent AI</h3>
            <p className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Smart Booking · Just say "Book [Station] at [Time]"
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl p-4 ${msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-tl-none`
                }`}>

                {msg.content && <ChatText content={msg.content} darkMode={darkMode} />}

                {/* Station list summary */}
                {msg.ui_component?.type === 'station_list' && (
                  <div className="mt-3 text-xs opacity-80 flex gap-2 items-center">
                    <MapPin className="w-3 h-3" />
                    Found {msg.ui_component.data.length} station{msg.ui_component.data.length !== 1 ? 's' : ''} nearby
                  </div>
                )}

                {/* Vehicle selection cards */}
                {msg.ui_component?.type === 'vehicle_selection' && (
                  <VehicleCardInChat
                    vehicles={msg.ui_component.data}
                    darkMode={darkMode}
                    onSelect={handleVehicleSelect}
                  />
                )}

                {/* Booking confirmation card */}
                {msg.ui_component?.type === 'booking_confirmation' && (
                  <BookingCardInChat 
                    booking={msg.ui_component.data} 
                    darkMode={darkMode} 
                  />
                )}

                {/* Alternative slots suggestions */}
                {msg.ui_component?.type === 'alternative_slots' && (
                  <AlternativeSlotsCard
                    stations={msg.ui_component.data}
                    darkMode={darkMode}
                    onSelect={handleAlternativeSelect}
                  />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-2xl rounded-tl-none p-4 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} flex items-center gap-2`}>
                <Loader className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try: "Book Green Charge at 3pm tomorrow"'
              className={`w-full pl-4 pr-12 py-4 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                darkMode ? 'bg-gray-900 text-white border border-gray-700' : 'bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                input.trim() && !loading
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          selectedStation={selectedStation}
          bookingData={bookingData}
          setBookingData={setBookingData}
          setSelectedStation={setSelectedStation}
          setShowBookingModal={setShowBookingModal}
          vehicles={vehicles}
        />
      )}
    </div>
  );
}

export default AgentTab;
