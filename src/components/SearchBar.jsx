import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { doctors, clinics, specialties, clinicDoctors } from '../data/dummyData'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState({ doctors: [], clinics: [], specialties: [] })
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length >= 2) {
      const q = query.toLowerCase()
      // Merge doctors and clinicDoctors, deduplicate by name
      const allDoctors = [
        ...doctors,
        ...clinicDoctors.map(cd => ({
          ...cd,
          experience: cd.experience || 5,
          rating: cd.rating || 4.5,
          reviewCount: cd.reviewCount || 0,
          consultationFee: cd.consultationFee || 300,
          location: cd.location || 'Clinic',
          address: cd.address || '',
          image: cd.image || 'https://randomuser.me/api/portraits/med/people/1.jpg',
          clinicName: cd.clinicName || '',
          bookingType: cd.bookingType || '',
        }))
      ];
      // Remove duplicates by name (prefer main doctors array)
      const seen = new Set();
      const mergedDoctors = allDoctors.filter(d => {
        if (seen.has(d.name)) return false;
        seen.add(d.name);
        return true;
      });
      setSuggestions({
        doctors: mergedDoctors.filter(d => 
          d.name.toLowerCase().includes(q) || 
          d.specialty.toLowerCase().includes(q)
        ).slice(0, 3),
        clinics: clinics.filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.specialty.toLowerCase().includes(q)
        ).slice(0, 2),
        specialties: specialties.filter(s => 
          s.name.toLowerCase().includes(q)
        )
      })
    } else {
      setSuggestions({ doctors: [], clinics: [], specialties: [] })
    }
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
    }
  }

  const hasSuggestions = suggestions.doctors.length > 0 || 
                          suggestions.clinics.length > 0 || 
                          suggestions.specialties.length > 0

  const showDropdown = isFocused && query.trim().length > 0

  return (
    <div className="search-wrapper" ref={containerRef}>
      <form onSubmit={handleSearch} className="search-container">
        <motion.div 
          className="search-box"
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ position: 'relative' }}
        >
          <span className="search-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search doctors, clinics, or specialties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            style={{ paddingRight: 40 }}
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="button"
            className="use-location-icon-btn"
            title="Search doctors near your location"
            onClick={async () => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  async (position) => {
                    // In a real app, use a reverse geocoding API to get city from lat/lng
                    // For demo, just use 'Near You' or fallback to 'Kochi'
                    // Example: fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
                    //   .then(res => res.json()).then(data => ...)
                    let city = 'Near You';
                    try {
                      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
                      const data = await res.json();
                      if (data.address && (data.address.city || data.address.town || data.address.village)) {
                        city = data.address.city || data.address.town || data.address.village;
                      }
                    } catch (e) {
                      city = 'Near You';
                    }
                    setQuery(city);
                    setTimeout(() => {
                      inputRef.current?.focus();
                      navigate(`/search?q=${encodeURIComponent(city)}`);
                    }, 0);
                  },
                  (error) => {
                    setQuery('Kochi');
                    setTimeout(() => {
                      inputRef.current?.focus();
                      navigate('/search?q=Kochi');
                    }, 0);
                  }
                );
              } else {
                setQuery('Kochi');
                setTimeout(() => {
                  inputRef.current?.focus();
                  navigate('/search?q=Kochi');
                }, 0);
              }
            }}
            aria-label="Search near me"
          >
            <span className="location-icon" role="img" aria-label="location">📍</span>
            <span className="use-location-label">Near Me</span>
          </button>
        </motion.div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="suggestions-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {suggestions.doctors.length > 0 && (
                <div className="suggestion-group">
                  <div className="suggestion-group-title">
                    <span>👨‍⚕️</span> Doctors
                  </div>
                  {suggestions.doctors.map((doctor) => (
                    <motion.button
                      key={doctor.id}
                      className="suggestion-item"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/doctor/${doctor.id}`);
                        setIsFocused(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                    >
                      <img src={doctor.image} alt={doctor.name} className="suggestion-avatar" />
                      <div className="suggestion-info">
                        <span className="suggestion-name">{doctor.name}</span>
                        <span className="suggestion-meta">{doctor.specialty} • {doctor.experience} yrs</span>
                        <span className="suggestion-location" style={{ color: '#888', fontSize: '0.97em' }}>📍 {doctor.location}</span>
                      </div>
                      <span className="suggestion-arrow">→</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {suggestions.clinics.length > 0 && (
                <div className="suggestion-group">
                  <div className="suggestion-group-title">
                    <span>🏥</span> Clinics
                  </div>
                  {suggestions.clinics.map((clinic) => (
                    <motion.button
                      key={clinic.id}
                      className="suggestion-item"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/clinic/${clinic.id}`);
                        setIsFocused(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="suggestion-icon">🏥</div>
                      <div className="suggestion-info">
                        <span className="suggestion-name">{clinic.name}</span>
                        <span className="suggestion-meta">{clinic.specialty}</span>
                        <span className="suggestion-location" style={{ color: '#888', fontSize: '0.97em' }}>📍 {clinic.location}</span>
                      </div>
                      <span className="suggestion-arrow">→</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {suggestions.specialties.length > 0 && (
                <div className="suggestion-group">
                  <div className="suggestion-group-title">
                    <span>🩺</span> Specialties
                  </div>
                  {suggestions.specialties.map((specialty) => (
                    <motion.button
                      key={specialty.id}
                      className="suggestion-item"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/search?specialty=${specialty.name}`);
                        setIsFocused(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="suggestion-icon">{specialty.icon}</div>
                      <div className="suggestion-info">
                        <span className="suggestion-name">{specialty.name}</span>
                        <span className="suggestion-meta">{specialty.description}</span>
                      </div>
                      <span className="suggestion-arrow">→</span>
                    </motion.button>
                  ))}
                </div>
              )}
              {/* Only show this if there are suggestions in other categories */}
              {suggestions.specialties.length === 0 && suggestions.doctors.length === 0 && suggestions.clinics.length === 0 && (
                <div className="no-suggestion-message" style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No result found with the search term
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
