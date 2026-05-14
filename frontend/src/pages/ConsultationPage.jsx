import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Phone, MessageCircle, Mic, MicOff, VideoOff, Monitor, PhoneOff, Send, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import './ConsultationPage.css';

export default function ConsultationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consultationType, setConsultationType] = useState('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', text: 'Consultation started. The doctor will join shortly.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchAppointment();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [appointmentId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchAppointment = async () => {
    try {
      const res = await api.get('/appointments');
      const appt = (res.appointments || []).find(a => a.id === appointmentId);
      if (appt) {
        setAppointment(appt);
        setConsultationType(appt.type === 'in-person' ? 'video' : appt.type);
      }
    } catch (err) {
      console.error('Failed to load appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async () => {
    setIsActive(true);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    try {
      await api.post(`/appointments/${appointmentId}/consultation`, { type: consultationType });
    } catch { /* mock mode */ }
    setChatMessages(prev => [...prev, { role: 'system', text: 'Connected! You can now speak with the doctor.' }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'doctor', text: `Hello! I'm ${appointment?.vet?.name || 'your doctor'}. How can I help you today?` }]);
    }, 2000);
  };

  const endConsultation = async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      await api.patch(`/appointments/${appointmentId}/consultation`);
    } catch { /* mock mode */ }
    setChatMessages(prev => [...prev, { role: 'system', text: `Consultation ended. Duration: ${formatTime(elapsed)}.` }]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput.trim() }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'doctor', text: 'I understand. Let me review the details and get back to you with my recommendation.' }]);
    }, 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return <div className="consultation-page"><div className="spinner spinner-lg" /></div>;
  }

  return (
    <div className="consultation-page">
      <button className="btn btn-secondary consultation-page__back" onClick={() => navigate('/appointments')}>
        <ArrowLeft size={16} /> Back to Appointments
      </button>

      <div className="consultation-page__layout">
        {/* Main Video/Audio Area */}
        <div className="consultation-page__main">
          <div className={`consultation-page__video-area ${consultationType}`}>
            {(consultationType === 'video' || consultationType === 'audio') ? (
              <>
                <div className="consultation-page__remote">
                  <div className="consultation-page__avatar-large">
                    {appointment?.vet?.name?.replace('Dr. ', '').split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                  <p>{appointment?.vet?.name || 'Doctor'}</p>
                  <span>{appointment?.vet?.specialization}</span>
                  {isActive && <div className="consultation-page__pulse" />}
                </div>
                {consultationType === 'video' && !isVideoOff && (
                  <div className="consultation-page__self">
                    <span>You</span>
                  </div>
                )}
              </>
            ) : (
              <div className="consultation-page__chat-only">
                <MessageCircle size={48} />
                <p>Chat Consultation</p>
              </div>
            )}

            {/* Timer */}
            {isActive && (
              <div className="consultation-page__timer">{formatTime(elapsed)}</div>
            )}
          </div>

          {/* Controls */}
          <div className="consultation-page__controls">
            {!isActive ? (
              <button className="btn btn-primary btn-lg" onClick={startConsultation}>
                {consultationType === 'video' ? <Video size={18} /> : consultationType === 'audio' ? <Phone size={18} /> : <MessageCircle size={18} />}
                Start {consultationType === 'video' ? 'Video' : consultationType === 'audio' ? 'Audio' : 'Chat'} Consultation
              </button>
            ) : (
              <>
                <button className={`control-btn ${isMuted ? 'active' : ''}`} onClick={() => setIsMuted(m => !m)} title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                {consultationType === 'video' && (
                  <button className={`control-btn ${isVideoOff ? 'active' : ''}`} onClick={() => setIsVideoOff(v => !v)} title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                  </button>
                )}
                <button className="control-btn" title="Share Screen">
                  <Monitor size={20} />
                </button>
                <button className="control-btn end" onClick={endConsultation} title="End Consultation">
                  <PhoneOff size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="consultation-page__chat">
          <h4>Chat</h4>
          <div className="consultation-page__chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                {msg.role === 'doctor' && <strong>Doctor</strong>}
                {msg.role === 'user' && <strong>You</strong>}
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="consultation-page__chat-input">
            <input
              type="text"
              className="input-field"
              placeholder="Type a message..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={!isActive}
            />
            <button className="btn btn-primary btn-sm" onClick={sendMessage} disabled={!isActive || !chatInput.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
