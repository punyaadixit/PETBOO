export const groomers = [
  {
    id: "g1",
    name: "Priya Sharma",
    bio: "Certified pet stylist with 8+ years of experience in Bhilai. Specializes in anxious dogs and cats with a gentle, stress-free approach.",
    profileImage: "https://images.unsplash.com/photo-1595085610896-1d16a695c0dc?w=400",
    experienceYears: 8,
    rating: 4.9,
    location: "Sector 6, Bhilai, Chhattisgarh",
    services: [
      { id: "s1", title: "Bath & Dry", price: 350, durationMins: 60, description: "Premium shampoo, blow dry, and thorough brushing." },
      { id: "s2", title: "Full Groom Package", price: 699, durationMins: 120, description: "Bath, haircut, nail trim, and ear cleaning." }
    ],
    reviews: [
      { id: "r1", userName: "Anita Verma", rating: 5, comment: "Priya was so gentle with my nervous Labrador!" },
      { id: "r2", userName: "Rajesh Patel", rating: 4, comment: "Great haircut, very professional service in Bhilai." }
    ]
  },
  {
    id: "g2",
    name: "Arjun Tiwari",
    bio: "Expert in large breeds and double-coated dogs. Born and raised in Bhilai with a lifelong love for animals.",
    profileImage: "https://images.unsplash.com/photo-1537151625747-768b6fc40db5?w=400",
    experienceYears: 5,
    rating: 4.7,
    location: "Supela, Bhilai, Chhattisgarh",
    services: [
      { id: "s3", title: "Deshedding Treatment", price: 499, durationMins: 90, description: "Specialized treatment to reduce shedding up to 90%." },
      { id: "s4", title: "Nail Clipping & Filing", price: 120, durationMins: 20, description: "Gentle nail trimming and smoothing." }
    ],
    reviews: [
      { id: "r3", userName: "Meena Dubey", rating: 5, comment: "Arjun handled my German Shepherd brilliantly!" }
    ]
  },
  {
    id: "g3",
    name: "Kavita Deshmukh",
    bio: "Cat grooming specialist and fear-free certified professional. Runs a popular mobile grooming van across Bhilai and Durg.",
    profileImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
    experienceYears: 12,
    rating: 5.0,
    location: "Mobile Grooming — Bhilai, Chhattisgarh",
    services: [
      { id: "s5", title: "Feline Spa Day", price: 450, durationMins: 60, description: "Waterless bath, gentle brushing, and nail trim for cats." },
      { id: "s6", title: "Flea & Tick Treatment", price: 599, durationMins: 60, description: "Safe and effective parasite removal bath." }
    ],
    reviews: [
      { id: "r4", userName: "Sunita Agarwal", rating: 5, comment: "Best cat groomer in Bhilai, hands down!" },
      { id: "r5", userName: "Deepak Sahu", rating: 5, comment: "Came to our home, very convenient and professional." }
    ]
  }
];

export const getGroomers = (locationFilter, minRating) => {
  return groomers.filter(g => {
    let match = true;
    if (locationFilter && !g.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      match = false;
    }
    if (minRating && g.rating < minRating) {
      match = false;
    }
    return match;
  });
};

export const getGroomerById = (id) => groomers.find(g => g.id === id);
