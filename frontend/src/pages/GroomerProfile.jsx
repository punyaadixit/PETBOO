import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';
import BookingModal from '../components/BookingModal';
import StarRating from '../components/StarRating';
import LoadingSkeleton from '../components/LoadingSkeleton';

const getAvatarGradient = (name) => {
  if (!name) return 'linear-gradient(135deg, #059669, #0d9488)';
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'linear-gradient(135deg, #059669, #0d9488)', // Emerald to Teal
    'linear-gradient(135deg, #0ea5e9, #2563eb)', // Sky to Blue
    'linear-gradient(135deg, #8b5cf6, #d946ef)', // Violet to Fuchsia
    'linear-gradient(135deg, #f97316, #e11d48)', // Orange to Rose
    'linear-gradient(135deg, #10b981, #047857)', // Green to Dark Green
  ];
  return gradients[hash % gradients.length];
};

export default function GroomerProfile() {
  const { id } = useParams();
  const [groomer, setGroomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchGroomer = async () => {
      try {
        const res = await api.get(`/groomers/${id}`);
        setGroomer(res.groomer);
      } catch (err) {
        console.error('Failed to fetch groomer details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroomer();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <LoadingSkeleton variant="profile" />
      </div>
    );
  }

  if (!groomer) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-slate-500 gap-4">
        <p className="text-lg font-semibold">Groomer not found.</p>
        <Link to="/grooming" className="btn btn-primary">Back to Marketplace</Link>
      </div>
    );
  }

  const handleBook = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const initials = groomer.name ? groomer.name.split(' ').map(n => n[0]).join('') : 'G';
  const avatarGradient = getAvatarGradient(groomer.name);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Link to="/grooming" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-50 mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto flex items-center justify-center text-white font-extrabold text-7xl select-none" style={{
            background: avatarGradient,
            minHeight: '250px'
          }}>
            {initials}
          </div>
          <div className="p-8 md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{groomer.name}</h1>
                <p className="text-emerald-600 flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" /> {groomer.location}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <StarRating rating={groomer.rating} size={18} />
                  <span className="text-lg font-bold text-slate-800 ml-1">{groomer.rating}</span>
                </div>
                <span className="text-sm text-slate-500 mt-1">{groomer.reviews?.length || 0} reviews</span>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-6">
              {groomer.bio}
            </p>

            <div className="flex gap-4">
              <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-semibold">
                {groomer.experienceYears}+ Years Experience
              </div>
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Certified Professional
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Services</h2>
          {groomer.services?.map(service => (
            <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{service.title}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-2 max-w-md">{service.description}</p>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.durationMins} mins</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                <span className="text-2xl font-bold text-emerald-600">₹{service.price}</span>
                <button 
                  onClick={() => handleBook(service)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Reviews</h2>
          <div className="space-y-4">
            {groomer.reviews?.length > 0 ? (
              groomer.reviews.map(review => (
                <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800">{review.userName}</span>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold ml-1 text-slate-700">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        groomer={groomer}
        service={selectedService}
        onBooked={() => {
          setIsModalOpen(false);
          alert('Grooming appointment booked successfully! Check your bookings history.');
        }}
      />
    </div>
  );
}
