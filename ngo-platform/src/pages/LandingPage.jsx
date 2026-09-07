import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{count.toLocaleString()}+</>;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [initiatives, setInitiatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const fullText = "Where Helping Hands Meet Those In Need";

  useEffect(() => {
    let currentText = '';

    const type = () => {
      if (currentText.length < fullText.length) {
        currentText = fullText.substring(0, currentText.length + 1);
        setTypedText(currentText);
        setTimeout(type, 80); 
      }
    };

    const timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch strictly REAL live campaigns and workshops from backend (NO MOCK DATA)
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoading(true);
      try {
        const [cRes, wRes] = await Promise.all([
          fetch('http://localhost:5000/api/campaigns').then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('http://localhost:5000/api/workshops').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);

        const formattedCamps = (cRes || []).filter(c => c.status === 'active' || !c.status).map(c => ({
          id: `camp-${c.id}`,
          type: 'campaign',
          title: c.name,
          disaster: c.disaster || 'Disaster Relief',
          region: c.region || 'On-ground',
          objective: c.objective || 'Active disaster response operations and community relief.',
          org_name: c.org_name || 'Verified NGO',
          target: `${(c.target_households || c.targetHouseholds || 1000).toLocaleString('en-IN')} Households`,
          progress: c.progress || 50,
          isUrgent: Boolean(c.is_urgent || c.isUrgent),
          actionLabel: 'Volunteer / Donate'
        }));

        const formattedWs = (wRes || []).map(w => ({
          id: `ws-${w.id}`,
          type: 'workshop',
          title: w.title,
          disaster: 'Open Workshop',
          region: w.location ? `${w.location}, ${w.city || ''}`.replace(/,\s*$/, '') : (w.city || 'Patiala'),
          date: w.date,
          time: w.time,
          objective: w.description || 'Community skill development and disaster response training.',
          org_name: w.org_name || 'Verified NGO',
          target: `${w.target_capacity || 50} Seats`,
          progress: Math.min(Math.round(((w.registered_count || 0) / (w.target_capacity || 50)) * 100) || 40, 100),
          isUrgent: false,
          actionLabel: 'Register for Workshop'
        }));

        const combined = [...formattedCamps, ...formattedWs];
        setInitiatives(combined);
      } catch (err) {
        console.error("Could not fetch real initiatives:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const handleActionClick = () => {
    navigate('/register/individual'); 
  };

  return (
    <div>
      {/* IMMERSIVE HERO SECTION */}
      <section 
        className="relative w-full h-screen min-h-[750px] flex flex-col bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('/hero1.jpeg')` }}
      >
        {/* Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-900/70 to-transparent z-0"></div>

        {/* URGENT EMERGENCY TICKER */}
        <div className="relative z-20 pt-24"> 
          <div className="bg-transparent text-yellow-400 overflow-hidden py-2 flex items-center">
            <div className="whitespace-nowrap animate-marquee font-medium text-sm tracking-wide">
              <span 
                onClick={() => navigate('/register/individual')}
                className="mx-8 cursor-pointer hover:text-white hover:underline transition-colors drop-shadow-md"
              >
                URGENT: Flash Floods Relief - Food and Clean Water Donations Required Immediately →
              </span>
              <span 
                onClick={() => navigate('/register/individual')}
                className="mx-8 cursor-pointer hover:text-white hover:underline transition-colors drop-shadow-md"
              >
                EMERGENCY: Landslide in Northern Region - On-ground Medical Volunteers Needed →
              </span>
            </div>
          </div>
        </div>

        {/* Content Container (Tagline & Inline Stats) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center pb-32">
          
          {/* Animated, Interactive Tagline */}
          <div className="min-h-[120px] md:min-h-[140px] flex items-end mb-6">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white cursor-default max-w-3xl">
              {typedText}
            </h1>
          </div>
          
          {/* Inline Impact Metrics */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                <AnimatedCounter target={50} />
              </p>
              <p className="text-green-200 text-xs md:text-sm mt-1 uppercase tracking-wider font-semibold">Certified NGOs</p>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/30"></div> 
            
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                <AnimatedCounter target={10000} duration={2500} />
              </p>
              <p className="text-green-200 text-xs md:text-sm mt-1 uppercase tracking-wider font-semibold">Items Donated</p>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/30"></div> 
            
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                <AnimatedCounter target={5000} duration={2200} />
              </p>
              <p className="text-green-200 text-xs md:text-sm mt-1 uppercase tracking-wider font-semibold">Volunteer Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Traffic Controller Gateways */}
      <section className="pt-8 pb-12 bg-white sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 mt-4 text-center sm:mt-6 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:gap-0">
            
            {/* Volunteer & Donate Column */}
            <div className="md:p-8 lg:p-14 flex flex-col items-center">
              <img 
                src="/png1.png" 
                alt="Volunteer" 
                className="h-20 w-20 mb-2 object-contain" 
              />
              <h3 className="mt-8 text-2xl font-bold text-gray-900">Volunteer & Donate</h3>
              <p className="mt-5 text-base text-gray-600 max-w-sm">
                Make a direct impact. Join our community to donate physical goods, volunteer your time on-ground, or participate in workshops.
              </p>
              <button 
                onClick={() => navigate('/register/individual')} 
                className="mt-8 text-green-600 font-bold hover:text-green-700 hover:underline transition-colors flex items-center gap-1"
              >
                Register as Individual <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Register NGO Column */}
            <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 flex flex-col items-center">
              <img 
                src="/png2.png" 
                alt="NGO" 
                className="h-20 w-20 mb-2 object-contain" 
              />
              <h3 className="mt-8 text-2xl font-bold text-gray-900">Register NGO</h3>
              <p className="mt-5 text-base text-gray-600 max-w-sm">
                Are you a certified NGO? Register your organization to post resource campaigns, organize workshops, and connect with volunteers.
              </p>
              <button 
                onClick={() => navigate('/register/ngo')} 
                className="mt-8 text-green-600 font-bold hover:text-green-700 hover:underline transition-colors flex items-center gap-1"
              >
                Register Organization <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Make A Difference (Real Campaigns & Workshops) Section */}
      <section id="campaigns" className="relative py-12 lg:py-16 bg-cover bg-center" style={{ backgroundImage: `url('/make.jpg')` }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/80 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Make A Difference...
              </h2>
              <p className="text-gray-300 text-xs md:text-sm mt-1.5">
                Real disaster relief initiatives and community workshops organized by registered NGOs on AidLink.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-white font-medium">
              Loading active initiatives...
            </div>
          ) : initiatives.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-white/20 rounded-lg bg-black/40 text-gray-300">
              <p className="text-lg font-semibold">No campaigns or workshops active right now</p>
              <p className="text-xs text-gray-400 mt-1">Freshly published initiatives by verified NGOs will appear here.</p>
            </div>
          ) : (
            /* 3-Column Responsive Grid with Compact Card Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {initiatives.map((item) => {
                const isWorkshop = item.type === 'workshop';
                return (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white p-4 shadow-md flex flex-col justify-between rounded-none hover:shadow-2xl transition-all cursor-pointer border border-gray-200 hover:border-gray-400 group min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-none ${
                          isWorkshop 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.disaster}
                        </span>
                        {item.isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600 text-white animate-pulse">
                            ⚡ URGENT
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-0.5 leading-tight group-hover:text-green-700 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 mb-1 truncate">
                        📍 {item.region}
                      </p>
                      <p className="text-[11px] font-semibold text-green-800 mb-2">
                        By: {item.org_name}
                      </p>

                      <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                        {item.objective}
                      </p>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-[11px] font-bold mb-1 text-gray-800">
                        <span>{isWorkshop ? 'Capacity' : 'Target'}</span>
                        <span>{item.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 mb-3 rounded-none overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-none ${isWorkshop ? 'bg-purple-600' : 'bg-green-600'}`} 
                          style={{ width: `${item.progress || 50}%` }}
                        ></div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className={`w-full font-bold py-1.5 text-xs rounded-none transition-colors ${
                          isWorkshop 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : 'border-2 border-green-600 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {item.actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* "More..." Button */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => navigate('/register/individual')} 
              className="text-white hover:text-green-400 font-bold text-sm md:text-base transition-colors flex items-center gap-1 drop-shadow-md cursor-pointer"
            >
              Explore all &amp; Register <span aria-hidden="true">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* DETAIL INFO MODAL (Clicking Action Leads to Register Page) */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white max-w-lg w-full p-6 shadow-2xl relative border border-gray-200 rounded-lg text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 uppercase tracking-wider rounded ${
                selectedItem.type === 'workshop' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedItem.disaster}
              </span>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
              {selectedItem.title}
            </h3>
            <p className="text-xs text-green-800 font-semibold mb-3">
              Organized by {selectedItem.org_name || 'Verified NGO Partner'}
            </p>

            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4 text-xs space-y-1 text-gray-700">
              <p><strong>📍 Location / Region:</strong> {selectedItem.region}</p>
              {selectedItem.date && <p><strong>📅 Date &amp; Time:</strong> {selectedItem.date} {selectedItem.time ? `(${selectedItem.time})` : ''}</p>}
              <p><strong>🎯 Capacity / Target:</strong> {selectedItem.target}</p>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Overview &amp; Objectives</h4>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {selectedItem.objective}
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 mb-5">
              📌 You must register with AidLink to participate on ground, volunteer, or access NGO workflows.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs md:text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Close
              </button>

              {selectedItem.type === 'workshop' ? (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="w-full sm:flex-1 py-2 text-xs md:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded shadow-md transition-colors"
                >
                  Register for Workshop →
                </button>
              ) : (
                <div className="w-full sm:flex-1 flex gap-2">
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="flex-1 py-2 text-xs md:text-sm font-bold text-green-800 bg-green-100 hover:bg-green-200 border border-green-300 rounded transition-colors"
                  >
                    Volunteer Now →
                  </button>
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="flex-1 py-2 text-xs md:text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-md transition-colors"
                  >
                    Donate Funds →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}