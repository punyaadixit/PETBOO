  {
    id: 'vet-001',
    name: 'Dr. Hannah Lee',
    specialization: 'Canine Medicine',
    clinic: 'Greenwood Veterinary Clinic',
    rating: 4.8,
    reviews: 124,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
}

/* ───────────────────────── Users ───────────────────────── */

const users = [
  {
    id: 'demo-user-001',
    email: 'demo@petsphere.app',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  },
];

/* ───────────────────────── Pets ────────────────────────── */

const pets = [
  {
    id: uuid(),
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    weight: 30.5,
    userId: 'demo-user-001',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Milo',
    breed: 'Persian Cat',
    age: 2,
    weight: 4.2,
    userId: 'demo-user-001',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Luna',
    breed: 'Labrador',
    age: 5,
    weight: 28.0,
    userId: 'demo-user-001',
    createdAt: new Date().toISOString(),
  },
];

/* ───────────────────────── Products ────────────────────── */

const products = [
  // Packaged Food
  {
    id: uuid(),
    name: 'Premium Chicken Kibble',
    description: 'High-protein dry dog food made with real chicken. Grain-free formula for all breeds.',
    price: 1299,
    category: 'Packaged Food',
    imageUrl: 'https://images.unsplash.com/photo-1566241076210-3a6f6c0b6d3b?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Salmon & Rice Dog Food',
    description: 'Omega-rich salmon recipe with brown rice for healthy skin and coat.',
    price: 1499,
    category: 'Packaged Food',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Tuna Delight Cat Food',
    description: 'Gourmet wet cat food with real tuna chunks in gravy.',
    price: 199,
    category: 'Packaged Food',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Puppy Growth Formula',
    description: 'Specially formulated for puppies with DHA for brain development.',
    price: 999,
    category: 'Packaged Food',
    imageUrl: 'https://images.unsplash.com/photo-1556228453-2f4c5f9f7d0a?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },

  // Toys
  {
    id: uuid(),
    name: 'Rope Tug Toy',
    description: 'Durable cotton rope toy perfect for fetch and tug-of-war.',
    price: 349,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Squeaky Ball Set (3 pack)',
    description: 'Colorful bouncy balls that squeak. Great for indoor and outdoor play.',
    price: 499,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1507149833265-60c372daea22?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Interactive Puzzle Feeder',
    description: 'Mental stimulation toy that dispenses treats as your pet solves the puzzle.',
    price: 799,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Catnip Mouse Toy',
    description: 'Soft plush mouse filled with premium catnip. Irresistible for cats!',
    price: 249,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },

  // Accessories
  {
    id: uuid(),
    name: 'Adjustable Dog Harness',
    description: 'Breathable mesh harness with reflective strips for night walks.',
    price: 899,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Stainless Steel Pet Bowl',
    description: 'Non-slip, rust-resistant bowl. Dishwasher safe. 500ml capacity.',
    price: 399,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Pet Grooming Kit',
    description: 'Complete grooming set with brush, nail clipper, and comb.',
    price: 1199,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1582719478171-7b3b3a1f6b2b?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Cozy Pet Bed (Medium)',
    description: 'Ultra-soft orthopedic pet bed with removable, washable cover.',
    price: 2499,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1543349684-6f6e6b5a7a2f?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },

  // Fresh Food
  {
    id: uuid(),
    name: 'Fresh Chicken & Veggie Bowl',
    description: 'Freshly prepared chicken breast with sweet potato and green beans.',
    price: 349,
    category: 'Fresh Food',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Beef & Brown Rice Meal',
    description: 'Lean ground beef with brown rice and carrots. Vet-approved recipe.',
    price: 399,
    category: 'Fresh Food',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Fish & Quinoa Dinner',
    description: 'Wild-caught fish with quinoa and spinach. Rich in Omega-3.',
    price: 449,
    category: 'Fresh Food',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Turkey & Pumpkin Stew',
    description: 'Slow-cooked turkey with pumpkin puree. Easy on sensitive tummies.',
    price: 379,
    category: 'Fresh Food',
    imageUrl: 'https://images.unsplash.com/photo-1516685304081-de7947d419d0?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Grain-Free Salmon Kibble',
    description: 'Grain-free dry food with salmon, sweet potato, and superfoods.',
    price: 1599,
    category: 'Packaged Food',
    imageUrl: 'https://images.unsplash.com/photo-1484981184820-2e84ea0e9f3a?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Plush Squeaker Bone',
    description: 'Soft toy with hidden squeaker designed for gentle play.',
    price: 299,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'LED Safety Collar',
    description: 'Rechargeable LED collar for night walks and visibility.',
    price: 499,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1519183071298-a2962be90b0a?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Travel Water Bottle',
    description: 'Leak-proof water bottle with attached dish for walks and travel.',
    price: 699,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Veggie Chicken Mash',
    description: 'Fresh chicken mash with pumpkin and peas for picky eaters.',
    price: 329,
    category: 'Fresh Food',
    imageUrl: 'https://images.unsplash.com/photo-1604909053156-0c7c4a4c4f98?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuid(),
    name: 'Mutton & Brown Rice Bowl',
    description: 'Fresh mutton with brown rice and vegetables. High protein.',
    price: 409,
    category: 'Fresh Food',
    imageUrl: 'https://images.unsplash.com/photo-1606756790081-77f9e0b7b4c6?w=800&q=80',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

/* ───────────────────── Chat History ───────────────────── */

const chatHistory = [];

/* ──────────────────── Knowledge Docs ──────────────────── */

const knowledgeDocs = [];

/* ───────────────────── Veterinarians ───────────────────── */

const veterinarians = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@petvet.com',
    phone: '+91-9876543210',
    specialization: 'General Veterinary',
    experience: 12,
    clinic: 'PawCare Animal Hospital',
    address: '45, MG Road, Koramangala',
    city: 'Bangalore',
    imageUrl: 'https://images.unsplash.com/photo-1551601651-5c8b0df1d7f2?w=800&q=80',
    lng: 77.6245,
    consultationFee: 800,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-002',
    name: 'Dr. Arjun Patel',
    email: 'arjun.patel@petvet.com',
    phone: '+91-9876543211',
    specialization: 'Orthopedic Surgery',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    clinic: 'VetLife Specialty Clinic',
    address: '12, Indiranagar 100ft Road',
    city: 'Bangalore',
    lat: 12.9784,
    lng: 77.6408,
    consultationFee: 1500,
    rating: 4.9,
    reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimeStart: '10:00',
    availableTimeEnd: '16:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-003',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    email: 'sneha.reddy@petvet.com',
    phone: '+91-9876543212',
    specialization: 'Dermatology',
    experience: 8,
    clinic: 'SkinPaw Dermatology Center',
    address: '78, Whitefield Main Road',
    city: 'Bangalore',
    lat: 12.9698,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    consultationFee: 1000,
    rating: 4.6,
    reviewCount: 67,
    imageUrl: null,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80',
  },
  {
    id: 'vet-004',
    name: 'Dr. Rahul Mehta',
    email: 'rahul.mehta@petvet.com',
    phone: '+91-9876543213',
    specialization: 'Cardiology',
    experience: 20,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    address: '23, Bandra West',
    city: 'Mumbai',
    lat: 19.0596,
    lng: 72.8295,
    consultationFee: 2000,
    rating: 4.9,
    reviewCount: 203,
    imageUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80',
    availableTimeStart: '08:00',
    availableTimeEnd: '20:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-005',
    name: 'Dr. Ananya Iyer',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    phone: '+91-9876543214',
    specialization: 'Dental Care',
    experience: 6,
    clinic: 'BrightSmile Pet Dental',
    address: '56, Anna Nagar',
    city: 'Chennai',
    lat: 13.0850,
    lng: 80.2101,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    rating: 4.5,
    reviewCount: 45,
    imageUrl: null,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availableTimeStart: '10:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80',
  {
    id: 'vet-006',
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@petvet.com',
    phone: '+91-9876543215',
    specialization: 'Emergency & Critical Care',
    experience: 18,
    clinic: 'PetER 24x7 Hospital',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    city: 'Delhi',
    lat: 28.6315,
    lng: 77.2167,
    consultationFee: 1200,
    rating: 4.7,
    reviewCount: 156,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    imageUrl: 'https://images.unsplash.com/photo-1545996124-1b06d5f1b2b1?w=800&q=80',
    availableTimeEnd: '23:59',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-007',
    name: 'Dr. Meera Nair',
    email: 'meera.nair@petvet.com',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    specialization: 'Nutrition & Wellness',
    experience: 10,
    clinic: 'NutriPet Wellness Clinic',
    address: '34, Jubilee Hills',
    city: 'Hyderabad',
    lat: 17.4325,
    lng: 78.4073,
    consultationFee: 600,
    rating: 4.4,
    reviewCount: 78,
    imageUrl: null,
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '09:00',
    availableTimeEnd: '15:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-008',
    name: 'Dr. Kabir Das',
    email: 'kabir.das@petvet.com',
    phone: '+91-9876543217',
    specialization: 'Ophthalmology',
    experience: 14,
    clinic: 'ClearEye Vet Vision',
    address: '67, Salt Lake Sector V',
    city: 'Kolkata',
    lat: 22.5726,
    lng: 88.4372,
    consultationFee: 900,
    rating: 4.6,
    reviewCount: 92,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    availableTimeStart: '10:00',
    availableTimeEnd: '17:00',
    isAvailable: false,
    createdAt: new Date().toISOString(),
  },

  /* ── Durg / Bhilai / Raipur (Chhattisgarh) ── */
  {
    id: 'vet-009',
    name: 'Dr. Rakesh Tiwari',
    email: 'rakesh.tiwari@petvet.com',
    phone: '+91-9301234567',
    specialization: 'General Veterinary',
    experience: 14,
    clinic: 'Durg Pet Care Hospital',
    address: 'Near Rajendra Chowk, Station Road',
    city: 'Durg',
    lat: 21.1904,
    lng: 81.2849,
    consultationFee: 500,
    rating: 4.7,
    reviewCount: 98,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '19:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-010',
    name: 'Dr. Suman Verma',
    email: 'suman.verma@petvet.com',
    phone: '+91-9302345678',
    specialization: 'Dermatology',
    experience: 9,
    clinic: 'PawSkin Veterinary Clinic',
    address: 'Padmanabhpur, Main Road',
    city: 'Durg',
    lat: 21.1950,
    lng: 81.2800,
    consultationFee: 600,
    rating: 4.5,
    reviewCount: 64,
    imageUrl: null,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availableTimeStart: '10:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-011',
    name: 'Dr. Neha Sahu',
    email: 'neha.sahu@petvet.com',
    phone: '+91-9303456789',
    specialization: 'Emergency & Critical Care',
    experience: 11,
    clinic: 'Durg Animal Emergency Center',
    address: 'Nehru Nagar, Near Bus Stand',
    city: 'Durg',
    lat: 21.1880,
    lng: 81.2870,
    consultationFee: 800,
    rating: 4.8,
    reviewCount: 112,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availableTimeStart: '00:00',
    availableTimeEnd: '23:59',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-012',
    name: 'Dr. Anil Jaiswal',
    email: 'anil.jaiswal@petvet.com',
    phone: '+91-9304567890',
    specialization: 'Orthopedic Surgery',
    experience: 16,
    clinic: 'Bhilai Veterinary Orthopedic Center',
    address: 'Sector 6, Near Nehru Park',
    city: 'Bhilai',
    lat: 21.2094,
    lng: 81.3297,
    consultationFee: 1000,
    rating: 4.6,
    reviewCount: 73,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-013',
    name: 'Dr. Kavita Pandey',
    email: 'kavita.pandey@petvet.com',
    phone: '+91-9305678901',
    specialization: 'Nutrition & Wellness',
    experience: 7,
    clinic: 'Healthy Paws Nutrition Clinic',
    address: 'Supela Chowk, Main Road',
    city: 'Bhilai',
    lat: 21.2150,
    lng: 81.3350,
    consultationFee: 450,
    rating: 4.4,
    reviewCount: 55,
    imageUrl: null,
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '10:00',
    availableTimeEnd: '16:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-014',
    name: 'Dr. Pradeep Sharma',
    email: 'pradeep.sharma@petvet.com',
    phone: '+91-9306789012',
    specialization: 'Cardiology',
    experience: 19,
    clinic: 'Raipur Pet Heart Care',
    address: 'Pandri, Near Bus Stand',
    city: 'Raipur',
    lat: 21.2363,
    lng: 81.6296,
    consultationFee: 1200,
    rating: 4.9,
    reviewCount: 145,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeStart: '08:00',
    availableTimeEnd: '20:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-015',
    name: 'Dr. Anjali Dewangan',
    email: 'anjali.dewangan@petvet.com',
    phone: '+91-9307890123',
    specialization: 'Dental Care',
    experience: 8,
    clinic: 'SmilePet Dental Clinic',
    address: 'Tatibandh, Raipur',
    city: 'Raipur',
    lat: 21.2500,
    lng: 81.6100,
    consultationFee: 550,
    rating: 4.5,
    reviewCount: 41,
    imageUrl: null,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availableTimeStart: '10:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-016',
    name: 'Dr. Ravi Soni',
    email: 'ravi.soni@petvet.com',
    phone: '+91-9308901234',
    specialization: 'General Veterinary',
    experience: 10,
    clinic: 'Soni Veterinary Hospital',
    address: 'Power House Road, Durg',
    city: 'Durg',
    lat: 21.1920,
    lng: 81.2900,
    consultationFee: 400,
    rating: 4.3,
    reviewCount: 87,
    imageUrl: null,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimeStart: '08:00',
    availableTimeEnd: '20:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
];

/* ───────────────────── Appointments ───────────────────── */

const appointments = [
  {
    id: 'appt-001',
    userId: 'demo-user-001',
    petId: pets[0]?.id || 'pet-demo-1',
    vetId: 'vet-001',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    time: '10:00',
    type: 'in-person',
    status: 'upcoming',
    notes: 'Annual checkup for Buddy',
    prescription: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-002',
    name: 'Dr. Miguel Alvarez',
    specialization: 'Feline Internal Medicine',
    clinic: 'Harborview Animal Hospital',
    rating: 4.7,
    reviews: 98,
    imageUrl: 'https://images.unsplash.com/photo-1551601651-5c8b0df1d7f2?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
    prescription: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vet-003',
    name: 'Dr. Priya Nair',
    specialization: 'Surgery',
    clinic: 'Maple Street Veterinary Center',
    rating: 4.9,
    reviews: 210,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
    prescription: 'Rest for 2 weeks. Administer Meloxicam 0.1mg/kg once daily with food. Follow-up in 14 days.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

/* ───────────────────── Reviews ──────────────────────── */

const reviews = [
  {
    id: uuid(),
    userId: 'demo-user-001',
    vetId: 'vet-001',
    appointmentId: null,
    rating: 5,
    comment: 'Dr. Priya is fantastic! She took great care of Buddy and explained everything clearly.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: uuid(),
    userId: 'demo-user-001',
    vetId: 'vet-002',
    appointmentId: 'appt-003',
    rating: 5,
    comment: 'Excellent orthopedic specialist. Buddy is recovering well thanks to Dr. Arjun.',
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

/* ───────────────────── Consultations ────────────────── */

const consultations = [];

/* ──────────────────────── Groomers ──────────────────────── */

const groomers = [
  {
    id: 'groomer-001',
    name: 'Priya Sharma',
    email: 'priya.s@groomers.com',
    phone: '+91-9998887771',
    bio: 'Certified pet stylist specializing in anxious dogs and cats.',
    profileImage: 'https://images.unsplash.com/photo-1595085610896-1d16a695c0dc?w=400',
    experienceYears: 8,
    address: 'Sector 6, Near Central Park',
    city: 'Bhilai',
    location: 'Sector 6, Bhilai',
    rating: 4.9,
    reviewCount: 15,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-002',
    name: 'Aarav Patel',
    email: 'aarav.p@groomers.com',
    phone: '+91-9998887772',
    bio: 'Expert in large breeds and double-coated dogs.',
    profileImage: 'https://images.unsplash.com/photo-1537151625747-768b6fc40db5?w=400',
    experienceYears: 5,
    address: 'Supela Market Area',
    city: 'Bhilai',
    location: 'Supela, Bhilai',
    rating: 4.7,
    reviewCount: 8,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-003',
    name: 'Ananya Iyer',
    email: 'ananya.i@groomers.com',
    phone: '+91-9998887773',
    bio: 'Cat grooming specialist. Fear-free certified.',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
    experienceYears: 12,
    address: 'Nehru Nagar West',
    city: 'Bhilai',
    location: 'Nehru Nagar, Bhilai',
    rating: 5.0,
    reviewCount: 24,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-004',
    name: 'Vikram Singh',
    email: 'vikram.s@groomers.com',
    phone: '+91-9998887774',
    bio: 'All-breed grooming expert with a passion for creative cuts.',
    profileImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    experienceYears: 6,
    address: '45 Green Glen Layout',
    city: 'Bangalore',
    location: 'Koramangala, Bangalore',
    rating: 4.8,
    reviewCount: 12,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-005',
    name: 'Rohan Das',
    email: 'rohan.d@groomers.com',
    phone: '+91-9998887775',
    bio: 'Professional groomer focusing on dog safety and clean styling.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    experienceYears: 10,
    address: 'Shankar Nagar, VIP Road',
    city: 'Raipur',
    location: 'VIP Road, Raipur',
    rating: 4.6,
    reviewCount: 9,
    availableDays: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-006',
    name: 'Maya Rao',
    email: 'maya.r@groomers.com',
    phone: '+91-9998887776',
    bio: 'Specializes in breed-specific styling with a calm, mobile grooming service.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    experienceYears: 9,
    address: 'Sector 9 Market',
    city: 'Raipur',
    location: 'Sector 9, Raipur',
    rating: 4.7,
    reviewCount: 10,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    availableTimeStart: '10:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-007',
    name: 'Sahil Khanna',
    email: 'sahil.k@groomers.com',
    phone: '+91-9998887777',
    bio: 'Skilled in precision trims and sensitive coat handling for small breeds.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    experienceYears: 7,
    address: 'Indiranagar',
    city: 'Bangalore',
    location: 'Indiranagar, Bangalore',
    rating: 4.8,
    reviewCount: 14,
    availableDays: ['Tue', 'Wed', 'Fri', 'Sat'],
    availableTimeStart: '09:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-008',
    name: 'Nisha Kapoor',
    email: 'nisha.k@groomers.com',
    phone: '+91-9998887778',
    bio: 'Delhi-based stylist for show-quality cuts and calming grooming experiences.',
    profileImage: 'https://images.unsplash.com/photo-1556228724-4f6e81bb9d64?w=400',
    experienceYears: 11,
    address: 'South Delhi',
    city: 'Delhi',
    location: 'South Delhi, Delhi',
    rating: 4.6,
    reviewCount: 18,
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    availableTimeStart: '10:00',
    availableTimeEnd: '19:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groomer-009',
    name: 'Ritika Mehra',
    email: 'ritika.m@groomers.com',
    phone: '+91-9998887779',
    bio: 'Mobile grooming specialist known for gentle baths and full-service styling.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    experienceYears: 8,
    address: 'Banjara Hills',
    city: 'Hyderabad',
    location: 'Banjara Hills, Hyderabad',
    rating: 4.7,
    reviewCount: 13,
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    availableTimeStart: '10:00',
    availableTimeEnd: '18:00',
    isAvailable: true,
    createdAt: new Date().toISOString(),
  }
];

const groomingServices = [
  { id: 'service-001', groomerId: 'groomer-001', title: 'Bath & Dry', description: 'Premium shampoo, blow dry, and thorough brushing.', price: 45.00, durationMins: 60 },
  { id: 'service-002', groomerId: 'groomer-001', title: 'Full Groom Package', description: 'Bath, haircut, nail trim, and ear cleaning.', price: 85.00, durationMins: 120 },
  { id: 'service-003', groomerId: 'groomer-002', title: 'Deshedding Treatment', description: 'Specialized treatment to reduce shedding up to 90%.', price: 65.00, durationMins: 90 },
  { id: 'service-004', groomerId: 'groomer-002', title: 'Nail Clipping & Filing', description: 'Gentle nail trimming and smoothing.', price: 15.00, durationMins: 20 },
  { id: 'service-005', groomerId: 'groomer-003', title: 'Feline Spa Day', description: 'Waterless bath, gentle brushing, and nail trim for cats.', price: 55.00, durationMins: 60 },
  { id: 'service-006', groomerId: 'groomer-003', title: 'Flea & Tick Treatment', description: 'Safe and effective parasite removal bath.', price: 75.00, durationMins: 60 },
  { id: 'service-007', groomerId: 'groomer-004', title: 'Puppy Grooming', description: 'Introduces puppies to grooming with a gentle bath and blow dry.', price: 40.00, durationMins: 45 },
  { id: 'service-008', groomerId: 'groomer-004', title: 'Full Groom Package', description: 'Standard bath, customized haircut, and hygiene clipping.', price: 80.00, durationMins: 100 },
  { id: 'service-009', groomerId: 'groomer-005', title: 'Deodorizing Bath', description: 'Removes tough odors with deep-cleaning organic shampoo.', price: 50.00, durationMins: 50 },
  { id: 'service-010', groomerId: 'groomer-005', title: 'Ear & Eye Cleaning', description: 'Safe cleaning of tear stains and ear canals.', price: 20.00, durationMins: 30 },
  { id: 'service-011', groomerId: 'groomer-006', title: 'Mobile Spa & Groom', description: 'Comprehensive mobile grooming with calming techniques and home service.', price: 90.00, durationMins: 100 },
  { id: 'service-012', groomerId: 'groomer-006', title: 'Precision Breed Trim', description: 'Breed-specific styling and coat finishing for show-ready looks.', price: 110.00, durationMins: 140 },
  { id: 'service-013', groomerId: 'groomer-007', title: 'Small Breed Style', description: 'Trims and styling tailored for small dog breeds.', price: 70.00, durationMins: 80 },
  { id: 'service-014', groomerId: 'groomer-007', title: 'Deluxe Paw Care', description: 'Paw pad trim, nail trim, and moisturizing balm application.', price: 35.00, durationMins: 30 },
  { id: 'service-015', groomerId: 'groomer-008', title: 'Show Cut Groom', description: 'Specialized show-cut service for premium dog coats.', price: 130.00, durationMins: 150 },
  { id: 'service-016', groomerId: 'groomer-008', title: 'Calming Bath', description: 'Gentle oat milk bath for stressed pets.', price: 55.00, durationMins: 45 },
  { id: 'service-017', groomerId: 'groomer-009', title: 'Home Comfort Groom', description: 'At-home grooming service with soothing handling.', price: 95.00, durationMins: 110 },
  { id: 'service-018', groomerId: 'groomer-009', title: 'Nail Trim & Paw Care', description: 'Safe nail trim and paw pad tidy up.', price: 25.00, durationMins: 25 }
];

const groomingBookings = [
  {
    id: 'gbook-001',
    userId: 'demo-user-001',
    groomerId: 'groomer-001',
    petId: 'mock-pet-buddy',
    serviceId: 'service-001',
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'pending',
    notes: 'Please be gentle around ears.',
    createdAt: new Date().toISOString()
  }
];

const groomingReviews = [
  { id: 'greview-001', userId: 'demo-user-001', groomerId: 'groomer-001', rating: 5, comment: 'Priya did an amazing job with Buddy!', createdAt: new Date().toISOString() }
];

const vaccinations = [];
const medicalRecords = [];
const activityLogs = [];

function seedActivityLogs() {
  const buddyPetId = pets[0]?.id || 'pet-demo-buddy';
  const miloPetId = pets[1]?.id || 'pet-demo-milo';
  const lunaPetId = pets[2]?.id || 'pet-demo-luna';

  // Seed some vaccinations and medical records for Buddy so he has a health score!
  vaccinations.push({
    id: uuid(),
    petId: buddyPetId,
    vaccineName: 'Rabies vaccine',
    vaccinationDate: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
    nextDueDate: new Date(Date.now() + 300 * 86400000).toISOString().split('T')[0],
    doctorName: 'Dr. Priya Sharma',
    clinicName: 'PawCare Animal Hospital',
    createdAt: new Date().toISOString()
  });
  medicalRecords.push({
    id: uuid(),
    petId: buddyPetId,
    visitDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    doctorName: 'Dr. Priya Sharma',
    clinicName: 'PawCare Animal Hospital',
    symptoms: 'Mild lethargy',
    diagnosis: 'Healthy checkup',
    prescriptionNotes: 'None',
    medicines: 'None',
    createdAt: new Date().toISOString()
  });

  // Seed activities for last 7 days
  for (let i = 0; i < 7; i++) {
    const dateStr = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    
    // Buddy
    activityLogs.push({ id: uuid(), petId: buddyPetId, type: 'exercise', value: Math.floor(Math.random() * 30) + 30, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: buddyPetId, type: 'nutrition', value: Math.floor(Math.random() * 100) + 450, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: buddyPetId, type: 'hydration', value: Math.floor(Math.random() * 200) + 700, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: buddyPetId, type: 'sleep', value: Math.round((Math.random() * 2 + 8) * 10) / 10, date: dateStr, createdAt: new Date().toISOString() });

    // Milo
    activityLogs.push({ id: uuid(), petId: miloPetId, type: 'exercise', value: Math.floor(Math.random() * 15) + 15, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: miloPetId, type: 'nutrition', value: Math.floor(Math.random() * 30) + 200, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: miloPetId, type: 'hydration', value: Math.floor(Math.random() * 50) + 220, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: miloPetId, type: 'sleep', value: Math.round((Math.random() * 3 + 11) * 10) / 10, date: dateStr, createdAt: new Date().toISOString() });

    // Luna
    activityLogs.push({ id: uuid(), petId: lunaPetId, type: 'exercise', value: Math.floor(Math.random() * 20) + 25, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: lunaPetId, type: 'nutrition', value: Math.floor(Math.random() * 80) + 400, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: lunaPetId, type: 'hydration', value: Math.floor(Math.random() * 150) + 600, date: dateStr, createdAt: new Date().toISOString() });
    activityLogs.push({ id: uuid(), petId: lunaPetId, type: 'sleep', value: Math.round((Math.random() * 2 + 9) * 10) / 10, date: dateStr, createdAt: new Date().toISOString() });
  }
}
seedActivityLogs();

/* ──────────────────── Helper Methods ──────────────────── */

const mockDB = {
  /* --- Users --- */
  findUser(id) {
    return users.find((u) => u.id === id || u.email.toLowerCase() === id.toLowerCase()) || null;
  },
  findUserByEmail(email) {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  upsertUser({ id, email, name, password }) {
    const existing = users.find((u) => u.id === id || u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (password) existing.password = password;
      if (name) existing.name = name;
      return existing;
    }
    const user = { id, email, name, password, createdAt: new Date().toISOString() };
    users.push(user);
    return user;
  },
  updateUserPassword(idOrEmail, hashedPassword) {
    const user = users.find((u) => u.id === idOrEmail || u.email.toLowerCase() === idOrEmail.toLowerCase());
    if (user) {
      user.password = hashedPassword;
      return true;
    }
    return false;
  },

  /* --- Pets --- */
  getPetsByUser(userId) {
    return pets
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  addPet({ name, breed, age, weight, userId }) {
    const pet = {
      id: uuid(),
      name,
      breed,
      age,
      weight,
      userId,
      createdAt: new Date().toISOString(),
    };
    pets.push(pet);
    return pet;
  },
  updatePet(petId, userId, data) {
    const idx = pets.findIndex((p) => p.id === petId && p.userId === userId);
    if (idx === -1) return null;
    pets[idx] = { ...pets[idx], ...data };
    return pets[idx];
  },
  deletePet(petId, userId) {
    const idx = pets.findIndex((p) => p.id === petId && p.userId === userId);
    if (idx === -1) return false;
    pets.splice(idx, 1);
    return true;
  },

  /* --- Products --- */
  getProducts({ category, excludeCategory } = {}) {
    return products
      .filter((p) => {
        if (!p.inStock) return false;
        if (category) return p.category === category;
        if (excludeCategory) return p.category !== excludeCategory;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getProductById(id) {
    return products.find((p) => p.id === id) || null;
  },

  /* --- Chat --- */
  getChatSessions(userId) {
    const seen = new Set();
    return chatHistory
      .filter((m) => m.userId === userId && m.role === 'user')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((m) => {
        if (seen.has(m.sessionId)) return false;
        seen.add(m.sessionId);
        return true;
      })
      .map((m) => ({ sessionId: m.sessionId, title: m.message }));
  },
  getChatHistory(userId) {
    return chatHistory
      .filter((m) => m.userId === userId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((m) => ({
        sessionId: m.sessionId,
        role: m.role === 'user' ? 'user' : 'bot',
        text: m.message,
      }));
  },
  addChatMessages(messages) {
    for (const msg of messages) {
      chatHistory.push({
        id: uuid(),
        ...msg,
        createdAt: new Date().toISOString(),
      });
    }
  },

  /* --- Knowledge --- */
  addKnowledge(text) {
    const doc = { id: uuid(), text, createdAt: new Date().toISOString() };
    knowledgeDocs.push(doc);
    return doc;
  },
  getKnowledge() {
    return knowledgeDocs;
  },

  /* --- Veterinarians --- */
  getVeterinarians({ city, specialization, available } = {}) {
    return veterinarians.filter((v) => {
      if (city && v.city.toLowerCase() !== city.toLowerCase()) return false;
      if (specialization && !v.specialization.toLowerCase().includes(specialization.toLowerCase())) return false;
      if (available === 'true' && !v.isAvailable) return false;
      return true;
    });
  },
  getVetById(id) {
    return veterinarians.find((v) => v.id === id) || null;
  },
  getVetReviews(vetId) {
    return reviews
      .filter((r) => r.vetId === vetId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  addReview({ userId, vetId, appointmentId, rating, comment }) {
    const review = {
      id: uuid(),
      userId,
      vetId,
      appointmentId: appointmentId || null,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    reviews.push(review);
    // Update vet rating
    const vet = veterinarians.find((v) => v.id === vetId);
    if (vet) {
      const vetReviews = reviews.filter((r) => r.vetId === vetId);
      vet.rating = Math.round((vetReviews.reduce((s, r) => s + r.rating, 0) / vetReviews.length) * 10) / 10;
      vet.reviewCount = vetReviews.length;
    }
    return review;
  },

  /* --- Appointments --- */
  getAppointmentsByUser(userId) {
    return appointments
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((a) => ({
        ...a,
        vet: veterinarians.find((v) => v.id === a.vetId) || null,
        pet: pets.find((p) => p.id === a.petId) || null,
      }));
  },
  getAppointmentsByVet(vetId) {
    return appointments
      .filter((a) => a.vetId === vetId)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((a) => ({
        ...a,
        pet: pets.find((p) => p.id === a.petId) || null,
        user: users.find((u) => u.id === a.userId) || null,
      }));
  },
  getAppointmentById(id) {
    const a = appointments.find((a) => a.id === id);
    if (!a) return null;
    return {
      ...a,
      vet: veterinarians.find((v) => v.id === a.vetId) || null,
      pet: pets.find((p) => p.id === a.petId) || null,
    };
  },
  bookAppointment({ userId, petId, vetId, date, time, type, notes }) {
    const appointment = {
      id: uuid(),
      userId,
      petId,
      vetId,
      date,
      time,
      type: type || 'in-person',
      status: 'upcoming',
      notes: notes || null,
      prescription: null,
      createdAt: new Date().toISOString(),
    };
    appointments.push(appointment);
    return {
      ...appointment,
      vet: veterinarians.find((v) => v.id === vetId) || null,
      pet: pets.find((p) => p.id === petId) || null,
    };
  },
  updateAppointment(id, userId, data) {
    const idx = appointments.findIndex((a) => a.id === id && a.userId === userId);
    if (idx === -1) return null;
    appointments[idx] = { ...appointments[idx], ...data };
    return {
      ...appointments[idx],
      vet: veterinarians.find((v) => v.id === appointments[idx].vetId) || null,
      pet: pets.find((p) => p.id === appointments[idx].petId) || null,
    };
  },
  cancelAppointment(id, userId) {
    const idx = appointments.findIndex((a) => a.id === id && a.userId === userId);
    if (idx === -1) return null;
    appointments[idx].status = 'cancelled';
    return appointments[idx];
  },
  addPrescription(id, prescription) {
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    appointments[idx].prescription = prescription;
    appointments[idx].status = 'completed';
    return appointments[idx];
  },

  /* --- Consultations --- */
  startConsultation({ appointmentId, type }) {
    const consultation = {
      id: uuid(),
      appointmentId,
      type,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: null,
      chatLog: [],
      createdAt: new Date().toISOString(),
    };
    consultations.push(consultation);
    return consultation;
  },
  endConsultation(id) {
    const idx = consultations.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const now = new Date();
    const start = new Date(consultations[idx].startTime);
    consultations[idx].endTime = now.toISOString();
    consultations[idx].duration = Math.round((now - start) / 60000);
    return consultations[idx];
  },
  getConsultationByAppointment(appointmentId) {
    return consultations.find((c) => c.appointmentId === appointmentId) || null;
  },
  getUserAppointmentCount(userId) {
    return appointments.filter((a) => a.userId === userId && a.status === 'upcoming').length;
  },
  
  /* --- Grooming --- */
  getGroomers({ city, rating } = {}) {
    return groomers.filter((g) => {
      if (city && g.city.toLowerCase() !== city.toLowerCase()) return false;
      if (rating && g.rating < parseFloat(rating)) return false;
      return true;
    }).map(g => ({
      ...g,
      services: groomingServices.filter(s => s.groomerId === g.id),
      reviews: groomingReviews.filter(r => r.groomerId === g.id).map(r => ({
        ...r,
        userName: users.find(u => u.id === r.userId)?.name || 'Demo User'
      }))
    }));
  },
  getGroomerById(id) {
    const g = groomers.find((g) => g.id === id);
    if (!g) return null;
    return {
      ...g,
      services: groomingServices.filter(s => s.groomerId === g.id),
      reviews: groomingReviews.filter(r => r.groomerId === g.id).map(r => ({
        ...r,
        userName: users.find(u => u.id === r.userId)?.name || 'Demo User'
      }))
    };
  },
  createGroomingBooking({ userId, groomerId, petId, serviceId, appointmentDate, notes }) {
    const booking = {
      id: uuid(),
      userId,
      groomerId,
      petId: petId || null,
      serviceId,
      appointmentDate,
      status: 'pending',
      notes: notes || null,
      createdAt: new Date().toISOString()
    };
    groomingBookings.push(booking);
    return {
      ...booking,
      groomer: groomers.find(g => g.id === groomerId) || null,
      service: groomingServices.find(s => s.id === serviceId) || null,
      pet: pets.find(p => p.id === petId) || null
    };
  },
  getGroomingBookingsByUser(userId) {
    return groomingBookings
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((b) => ({
        ...b,
        groomer: groomers.find(g => g.id === b.groomerId) || null,
        service: groomingServices.find(s => s.id === b.serviceId) || null,
        pet: pets.find(p => p.id === b.petId) || null
      }));
  },
  cancelGroomingBooking(id, userId) {
    const idx = groomingBookings.findIndex((b) => b.id === id && b.userId === userId);
    if (idx === -1) return null;
    groomingBookings[idx].status = 'cancelled';
    return groomingBookings[idx];
  },

  /* --- In-memory activities, vaccines, medical records --- */
  getActivityLogsForPet(petId) {
    return activityLogs.filter(a => a.petId === petId).sort((a, b) => new Date(a.date) - new Date(b.date));
  },
  addActivityLog({ petId, type, value, date }) {
    const log = {
      id: uuid(),
      petId,
      type,
      value: Number(value),
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    activityLogs.push(log);
    return log;
  },
  getVaccinations(petId) {
    return vaccinations.filter(v => v.petId === petId).sort((a, b) => new Date(b.vaccinationDate) - new Date(a.vaccinationDate));
  },
  addVaccination(data) {
    const v = {
      id: uuid(),
      ...data,
      createdAt: new Date().toISOString()
    };
    vaccinations.push(v);
    return v;
  },
  getMedicalRecords(petId) {
    return medicalRecords.filter(m => m.petId === petId).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  },
  addMedicalRecord(data) {
    const m = {
      id: uuid(),
      ...data,
      files: [],
      createdAt: new Date().toISOString()
    };
    medicalRecords.push(m);
    return m;
  }
};

module.exports = { mockDB, uuid };
