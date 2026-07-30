export const seasons = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

export const soilTypes = [
  'Black Cotton Soil',
  'Red Soil',
  'Alluvial Soil',
  'Laterite Soil',
  'Sandy Loam',
  'Clay Loam',
  'Saline / Alkaline Soil',
  'Peaty Organic Soil',
];

export const cropCategories = {
  'Grains & Cereals': ['Paddy Rice', 'Wheat', 'Maize (Corn)', 'Barley', 'Sorghum (Jowar)', 'Pearl Millet (Bajra)'],
  'Cash & Commercial': ['Cotton', 'Sugarcane', 'Tobacco', 'Tea', 'Coffee', 'Rubber'],
  'Pulses & Oilseeds': ['Soybean', 'Groundnut (Peanut)', 'Chickpea (Gram)', 'Mustard', 'Pigeon Pea (Tur/Arhar)', 'Sunflower'],
  'Vegetables & Spices': ['Tomato', 'Potato', 'Onion', 'Chilli / Pepper', 'Brinjal (Eggplant)', 'Garlic'],
  'Fruits & Orchards': ['Banana', 'Citrus (Orange/Lemon)', 'Mango', 'Grape', 'Apple', 'Papaya']
};

export const cropOptions = Object.values(cropCategories).flat();

export const symptomChecklist = [
  'Yellowing Leaves (Chlorosis)',
  'Brown Spot Lesions',
  'Leaf Curling & Distortion',
  'Stunted Plant Growth',
  'Wilting / Drooping Stems',
  'White Powdery Mold',
  'Rust Pustules / Orange Dots',
  'Black Necrotic Rot',
  'Mosaic / Mottled Leaf Pattern',
  'Gummosis / Stem Bleeding',
  'Premature Leaf Drop',
  'Fruit Pod Spotting'
];

export const weatherNow = {
  temp: 29,
  condition: 'Partly Cloudy',
  humidity: 68,
  wind: 12,
  rainfall: 2.4,
  uv: 'Moderate (5)',
};

export const forecast7 = [
  { day: 'Mon', hi: 30, lo: 22, rain: 20 },
  { day: 'Tue', hi: 31, lo: 23, rain: 10 },
  { day: 'Wed', hi: 28, lo: 21, rain: 70 },
  { day: 'Thu', hi: 27, lo: 20, rain: 85 },
  { day: 'Fri', hi: 29, lo: 22, rain: 40 },
  { day: 'Sat', hi: 30, lo: 23, rain: 15 },
  { day: 'Sun', hi: 32, lo: 24, rain: 5 },
];

export const marketPrices = [
  {
    id: 'mp1',
    commodity: 'Paddy Rice (BPT 5204)',
    category: 'Grains & Cereals',
    unit: 'Quintal',
    today: 2450,
    yesterday: 2380,
    minPrice: 2300,
    maxPrice: 2520,
    arrivals: '1,420 Qtl',
    mandi: 'Medak APMC Mandi',
    trend: [2200, 2250, 2300, 2350, 2380, 2450]
  },
  {
    id: 'mp2',
    commodity: 'Cotton (Kapas Long Staple)',
    category: 'Commercial Crops',
    unit: 'Quintal',
    today: 7120,
    yesterday: 7220,
    minPrice: 6850,
    maxPrice: 7350,
    arrivals: '3,850 Qtl',
    mandi: 'Warangal Grain Market',
    trend: [7400, 7350, 7300, 7250, 7220, 7120]
  },
  {
    id: 'mp3',
    commodity: 'Tomato (Hybrid Red)',
    category: 'Vegetables & Spices',
    unit: 'Quintal',
    today: 1850,
    yesterday: 1620,
    minPrice: 1500,
    maxPrice: 2050,
    arrivals: '840 Qtl',
    mandi: 'Bowenpally APMC Hyderabad',
    trend: [1400, 1500, 1550, 1600, 1620, 1850]
  },
  {
    id: 'mp4',
    commodity: 'Maize / Corn (Yellow Grade A)',
    category: 'Grains & Cereals',
    unit: 'Quintal',
    today: 2080,
    yesterday: 2050,
    minPrice: 1980,
    maxPrice: 2150,
    arrivals: '2,100 Qtl',
    mandi: 'Nizamabad APMC',
    trend: [1950, 1980, 2000, 2020, 2050, 2080]
  },
  {
    id: 'mp5',
    commodity: 'Chilli (Red Teja Grade)',
    category: 'Vegetables & Spices',
    unit: 'Quintal',
    today: 14200,
    yesterday: 13900,
    minPrice: 13500,
    maxPrice: 14800,
    arrivals: '4,120 Qtl',
    mandi: 'Guntur APMC Yard',
    trend: [13000, 13400, 13700, 13900, 14200]
  },
  {
    id: 'mp6',
    commodity: 'Wheat (Sharbati HD 2967)',
    category: 'Grains & Cereals',
    unit: 'Quintal',
    today: 2680,
    yesterday: 2610,
    minPrice: 2500,
    maxPrice: 2750,
    arrivals: '1,950 Qtl',
    mandi: 'Tupran APMC Yard',
    trend: [2480, 2520, 2560, 2600, 2610, 2680]
  },
  {
    id: 'mp7',
    commodity: 'Soybean (Yellow Grade A)',
    category: 'Pulses & Oilseeds',
    unit: 'Quintal',
    today: 4850,
    yesterday: 4920,
    minPrice: 4700,
    maxPrice: 5050,
    arrivals: '2,640 Qtl',
    mandi: 'Khammam Market',
    trend: [5100, 5050, 5000, 4950, 4920, 4850]
  },
  {
    id: 'mp8',
    commodity: 'Groundnut / Peanut (Raw Pods)',
    category: 'Pulses & Oilseeds',
    unit: 'Quintal',
    today: 6420,
    yesterday: 6350,
    minPrice: 6200,
    maxPrice: 6600,
    arrivals: '1,180 Qtl',
    mandi: 'Medak APMC Mandi',
    trend: [6100, 6200, 6250, 6300, 6350, 6420]
  },
  {
    id: 'mp9',
    commodity: 'Red Gram (Tur / Arhar)',
    category: 'Pulses & Oilseeds',
    unit: 'Quintal',
    today: 9850,
    yesterday: 9720,
    minPrice: 9400,
    maxPrice: 10100,
    arrivals: '790 Qtl',
    mandi: 'Suryapet APMC',
    trend: [9200, 9400, 9550, 9650, 9720, 9850]
  },
  {
    id: 'mp10',
    commodity: 'Onion (Red Nashik Quality)',
    category: 'Vegetables & Spices',
    unit: 'Quintal',
    today: 2150,
    yesterday: 2280,
    minPrice: 1950,
    maxPrice: 2400,
    arrivals: '5,300 Qtl',
    mandi: 'Bowenpally APMC Hyderabad',
    trend: [2500, 2450, 2400, 2350, 2280, 2150]
  }
];

export const equipment = [
  {
    id: 'eq1',
    name: 'John Deere 5050D Tractor (50 HP)',
    category: 'Tractor',
    specs: 'Dual Clutch, Power Steering, Multi-speed PTO, 4WD Heavy Axle',
    price: 650,
    unit: 'hour',
    rating: 4.9,
    available: true,
    image: '/equipment/john_deere_5050d.jpg',
    owner: { name: 'Rajesh Patel', phone: '+91 98450 12345', location: 'Chandapur Hub, Medak District (2.4 km away)', verified: true }
  },
  {
    id: 'eq2',
    name: 'Mahindra Arjun Novo 605 DI (60 HP)',
    category: 'Tractor',
    specs: 'Synchro Shuttle Transmission, High Torque, 2200 kg Lift Capacity',
    price: 750,
    unit: 'hour',
    rating: 4.8,
    available: true,
    image: '/equipment/mahindra_arjun_novo.jpg',
    owner: { name: 'Suresh Verma', phone: '+91 98761 23456', location: 'Ramayanpet Village, Medak (5.1 km away)', verified: true }
  },
  {
    id: 'eq3',
    name: 'Kubota Combine Harvester PRO688Q',
    category: 'Harvester',
    specs: '68 HP Turbocharged Diesel Engine, Rubber Track, High Yield Grain Collector',
    price: 1800,
    unit: 'hour',
    rating: 4.8,
    available: true,
    image: '/equipment/kubota_harvester.jpg',
    owner: { name: 'Venkatesh Rao (AgriMachinery)', phone: '+91 94402 88112', location: 'Mandi Road, Medak District (3.8 km away)', verified: true }
  },
  {
    id: 'eq4',
    name: 'Class Crop Tiger 30 Grain Harvester',
    category: 'Harvester',
    specs: '76 HP Engine, Multi-crop cutter bar, High Grain Cleaner & Straw Straw Slicer',
    price: 2100,
    unit: 'hour',
    rating: 4.7,
    available: false,
    nextAvailableDate: 'Tomorrow at 08:00 AM',
    image: '/equipment/class_harvester.jpg',
    owner: { name: 'Kishan Farmers Co-op', phone: '+91 98112 33445', location: 'Tupran APMC Yard, Medak (8.2 km away)', verified: true }
  },
  {
    id: 'eq5',
    name: 'Precision Dajiang Agriculture Drone T30',
    category: 'Drone',
    specs: '30L Spray Tank, Radar Obstacle Avoidance, Automated RTK Precision Mapping',
    price: 950,
    unit: 'hour',
    rating: 5.0,
    available: false,
    nextAvailableDate: 'Today at 04:00 PM',
    image: '/equipment/dajiang_drone_t30.jpg',
    owner: { name: 'Urvixa Tech Drone Ops', phone: '+91 1800 900 2020', location: 'Hyderabad AgriTech Hub (12 km away)', verified: true }
  },
  {
    id: 'eq6',
    name: 'Aspee Motorized Boom Sprayer (500L)',
    category: 'Sprayer',
    specs: '500L Chemical Tank, 12 Meter Folding Boom, Italian Diaphragm Pump',
    price: 450,
    unit: 'hour',
    rating: 4.6,
    available: true,
    image: '/equipment/aspee_boom_sprayer.jpg',
    owner: { name: 'Anil Kumar Reddy', phone: '+91 97003 44556', location: 'Chandapur North, Medak (1.8 km away)', verified: true }
  },
  {
    id: 'eq7',
    name: 'Mahindra Heavy Duty Disc Harrow (16 Disc)',
    category: 'Tillage',
    specs: 'Heavy Duty Boron Steel Discs, Sealed Bearings, 7.5 Feet Tillage Width',
    price: 350,
    unit: 'hour',
    rating: 4.6,
    available: true,
    image: '/equipment/mahindra_disc_harrow.jpg',
    owner: { name: 'Srinivas Goud', phone: '+91 99890 55667', location: 'Medak Rural Service Station (4.0 km away)', verified: true }
  },
  {
    id: 'eq8',
    name: 'Shaktiman Semi Champion Rotavator (7 Feet)',
    category: 'Tillage',
    specs: 'Helical Blade Arrangement, Heavy Multi-Speed Gearbox, Depth Control Skids',
    price: 400,
    unit: 'hour',
    rating: 4.9,
    available: true,
    image: '/equipment/shaktiman_rotavator.jpg',
    owner: { name: 'Mahesh Farmer Tools', phone: '+91 98480 77889', location: 'Sangareddy Highway Junction (6.5 km away)', verified: true }
  },
  {
    id: 'eq9',
    name: 'Fieldking Laser Land Leveler (Dual Slope)',
    category: 'Tillage',
    specs: 'Rotary Transmitter Receiver, 7 Feet Bucket, High Precision Grade Control',
    price: 850,
    unit: 'hour',
    rating: 4.9,
    available: true,
    image: '/equipment/fieldking_leveler.jpg',
    owner: { name: 'Pradeep Agro Rentals', phone: '+91 91212 66778', location: 'Medak Town Center (3.0 km away)', verified: true }
  },
  {
    id: 'eq10',
    name: 'Pneumatic Precision Seeder (4 Row Cotton & Corn)',
    category: 'Seeder',
    specs: 'Vacuum Metering System, Fertilizer Applicator, Adjustable Row Spacing',
    price: 550,
    unit: 'hour',
    rating: 4.7,
    available: true,
    image: '/equipment/pneumatic_seeder.jpg',
    owner: { name: 'Ramesh Patel', phone: '+91 98450 12345', location: 'Chandapur Hub, Medak District (2.4 km away)', verified: true }
  }
];

export const tutorials = [
  {
    id: 't1',
    title: 'Modern Drip Irrigation Setup & Field Automation',
    category: 'Irrigation',
    duration: '12:45',
    views: 42800,
    youtubeId: 'W98pXFwH760',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-checking-drip-irrigation-in-a-greenhouse-41551-large.mp4',
    instructor: 'ICAR Senior Agronomist',
    thumbnail: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'Selecting main line lateral pipes (16mm) and drip emitters based on soil type.',
      'Integrating venturi injectors for fertigation without clogging.',
      'Automating valve schedules based on daily crop evapotranspiration.'
    ]
  },
  {
    id: 't2',
    title: 'Organic Neem Oil & Bio-Pesticide Preparation',
    category: 'Pest & Disease',
    duration: '08:20',
    views: 89400,
    youtubeId: '2g6u_Lh7K00',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spraying-crops-with-a-pesticide-tractor-41549-large.mp4',
    instructor: 'Natural Farming Institute',
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'Extracting pure cold-pressed Neem seed kernel solution (NSKE 5%).',
      'Emulsifying with organic liquid soap to ensure uniform foliar coverage.',
      'Optimal morning & evening spray timings to prevent beneficial insect harm.'
    ]
  },
  {
    id: 't3',
    title: 'Identifying & Treating Rice Blast Disease Early',
    category: 'Pest & Disease',
    duration: '15:10',
    views: 63200,
    youtubeId: 'zV2x3K4gB0w',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-in-a-field-inspecting-crops-41547-large.mp4',
    instructor: 'Paddy Research Center',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'Spotting early diamond-shaped lesions on leaf laminae before neck rot occurs.',
      'Foliar spray ratios of Tricyclazole WP vs Trichoderma harzianum bio-control.',
      'Managing paddy field water levels to inhibit fungal spore germination.'
    ]
  },
  {
    id: 't4',
    title: 'Soil NPK Testing & Fertilizer Dosing Masterclass',
    category: 'Soil & Fertilizer',
    duration: '10:30',
    views: 31500,
    youtubeId: 'mN2CqQvQ1_k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-fresh-soil-and-wheat-41546-large.mp4',
    instructor: 'Soil Science Bureau',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'Core soil sample extraction procedure at 15cm and 30cm depths.',
      'Interpreting Soil Passport pH, Nitrogen, Phosphorus & Potassium values.',
      'Calculating exact urea and DAP bag quantities per acre.'
    ]
  },
  {
    id: 't5',
    title: 'Agriculture Drone Flight & Precision Spraying Guide',
    category: 'Precision Tech',
    duration: '14:15',
    views: 52100,
    youtubeId: 'q69N8YtYy4k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-green-fields-41550-large.mp4',
    instructor: 'Urvixa Tech Drone Academy',
    thumbnail: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'RTK satellite boundary mapping and flight altitude calibration.',
      'Micro-droplet spray nozzle selection for uniform canopy penetration.',
      'Battery safety, payload balancing, and return-to-home protocols.'
    ]
  },
  {
    id: 't6',
    title: 'Jeevamrut & Panchagavya Bio-Fertilizer Preparation',
    category: 'Soil & Fertilizer',
    duration: '11:45',
    views: 74200,
    youtubeId: 'b4-Zf_gG8Jk',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-watering-green-plants-in-a-farm-41548-large.mp4',
    instructor: 'Organic Agri Krishi Kendra',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'Fermenting cow dung, urine, jaggery & pulse flour for 48 hours.',
      'Activating beneficial soil microbes to enhance humus formation.',
      'Application through drip irrigation or direct soil drenching.'
    ]
  },
  {
    id: 't7',
    title: 'Laser Land Leveler Operation & Field Setup',
    category: 'Precision Tech',
    duration: '09:50',
    views: 28900,
    youtubeId: 'f9D4JqY_7Kw',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tractor-plowing-a-field-41545-large.mp4',
    instructor: 'Farm Machinery Training Institute',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'Setting up the laser transmitter tripod on field elevated points.',
      'Calibrating hydraulic receiver control valves on tractor bucket.',
      'Saving up to 30% irrigation water through zero-grade field slopes.'
    ]
  },
  {
    id: 't8',
    title: 'Solar Water Pump Controller & Submersible Care',
    category: 'Irrigation',
    duration: '13:20',
    views: 39100,
    youtubeId: 'n43f8jMvhDk',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-water-flowing-through-an-irrigation-canal-41552-large.mp4',
    instructor: 'Solar Energy Agri Cell',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    takeaways: [
      'MPPT solar controller wiring and VFD frequency adjustment.',
      'Cleaning solar PV panel arrays for maximum power output.',
      'Preventing dry-run motor damage using auto-float sensors.'
    ]
  }
];

export const diseaseDatabase = {
  'Paddy Rice': {
    name: 'Rice Blast (Magnaporthe oryzae)',
    confidence: 96.5,
    severity: 'High',
    affected: '18% Foliage & Neck Sheath',
    stage: 'Early Lesion Spreading',
    organ: 'Leaves & Stem Nodes',
    symptoms: 'Spindle-shaped gray-white centered lesions with reddish-brown margins.',
    organicTreatment: 'Spray Neem oil 5ml/L + Pseudomonas fluorescens 10g/L during early morning hours.',
    chemicalTreatment: 'Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.',
    prevention: 'Avoid excess nitrogen. Use certified blast-resistant seeds like Swarna or IR64.',
    spraySafety: 'Safe window today between 6:00 AM – 10:00 AM before rain.'
  },
  'Wheat': {
    name: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
    confidence: 94.2,
    severity: 'High',
    affected: '22% Upper Canopy',
    stage: 'Spore Pustule Eruption',
    organ: 'Leaf Blades & Sheaths',
    symptoms: 'Bright yellow urederial pustules arranged in linear stripes on leaves.',
    organicTreatment: 'Apply sulfur dust @ 10kg/acre or bio-control Trichoderma harzianum.',
    chemicalTreatment: 'Propiconazole 25% EC @ 1ml/L or Tebuconazole 50% + Trifloxystrobin 25% WG @ 0.7g/L.',
    prevention: 'Grow rust-tolerant HD-2967 or DBW-187 cultivars. Monitor cooler morning temperatures.',
    spraySafety: 'Low wind conditions permit safe spraying today.'
  },
  'Maize (Corn)': {
    name: 'Fall Armyworm & Northern Corn Leaf Blight',
    confidence: 92.8,
    severity: 'Critical',
    affected: '25% Whorl & Foliage',
    stage: 'Whorl Feeding Stage',
    organ: 'Whorl & Upper Leaf Blades',
    symptoms: 'Long elliptical tan lesions and pinhole damage on young whorl leaves.',
    organicTreatment: 'Release Trichogramma chilonis parasitoids @ 50,000/acre.',
    chemicalTreatment: 'Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.4ml/L.',
    prevention: 'Intercrop with cowpea. Install pheromone traps @ 4 traps/acre.',
    spraySafety: 'Spray directly into central whorl for maximum efficacy.'
  },
  'Cotton': {
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    confidence: 91.5,
    severity: 'High',
    affected: '15% Terminal Shoots',
    stage: 'Systemic Infection',
    organ: 'Young Leaves & Shoots',
    symptoms: 'Upward leaf curling, vein thickening, and cup-like leaf enations.',
    organicTreatment: 'Neem seed kernel extract (NSKE 5%) + Sticky yellow fly traps @ 10/acre.',
    chemicalTreatment: 'Target whitefly vector with Afidopyropen 50g/L ME @ 2ml/L or Diafenthiuron 50% WP @ 1.2g/L.',
    prevention: 'Remove weed hosts like Abutilon along field bunds.',
    spraySafety: 'Apply whitefly spray in early morning before vector activity peak.'
  },
  'Tomato': {
    name: 'Tomato Early Blight (Alternaria solani)',
    confidence: 95.0,
    severity: 'Moderate',
    affected: '12% Lower Foliage',
    stage: 'Target Spot Expansion',
    organ: 'Lower Mature Leaves',
    symptoms: 'Concentric ring target spots with yellow chlorotic halos on lower foliage.',
    organicTreatment: 'Spray copper oxychloride @ 2.5g/L or baking soda + liquid soap solution.',
    chemicalTreatment: 'Azoxystrobin 23% SC @ 1ml/L or Mancozeb 75% WP @ 2g/L.',
    prevention: 'Maintain drip irrigation to keep foliage dry. Stake plants off soil surface.',
    spraySafety: 'Ideal spray condition today.'
  },
  'Potato': {
    name: 'Late Blight (Phytophthora infestans)',
    confidence: 96.0,
    severity: 'Critical',
    affected: '30% Foliage & Stem',
    stage: 'Rapid Sporulation',
    organ: 'Leaves, Stems & Tubers',
    symptoms: 'Water-soaked dark lesions with white cottony fungal growth under humid conditions.',
    organicTreatment: 'Apply Bordeaux mixture (1%) or bio-fungicide Bacillus subtilis.',
    chemicalTreatment: 'Cymoxanil 8% + Mancozeb 64% WP @ 2g/L or Dimethomorph 50% WP @ 1g/L.',
    prevention: 'Earthing up tubers properly to avoid fungal spore wash-down.',
    spraySafety: 'Urgent fungicide application required before humidity increase.'
  },
  'Soybean': {
    name: 'Soybean Rust (Phakopsora pachyrhizi)',
    confidence: 93.0,
    severity: 'Moderate',
    affected: '14% Canopy',
    stage: 'Pustule Formation',
    organ: 'Underside Leaves',
    symptoms: 'Tan to dark brown reddish pustules appearing on lower leaf surfaces.',
    organicTreatment: 'Spray Trichoderma viride @ 5g/L.',
    chemicalTreatment: 'Hexaconazole 5% EC @ 1ml/L or Pyraclostrobin 20% WG @ 1g/L.',
    prevention: 'Use wider row spacing to improve air circulation.',
    spraySafety: 'Favorable spray weather window active.'
  },
  'Chilli / Pepper': {
    name: 'Chilli Anthracnose & Leaf Curl Complex',
    confidence: 94.8,
    severity: 'High',
    affected: '16% Pods & Leaves',
    stage: 'Fruit Rot Phase',
    organ: 'Ripe Fruit & Shoots',
    symptoms: 'Sunken circular lesions with black concentric rings on ripening chilli pods.',
    organicTreatment: 'Panchagavya spray 3% + Neem oil 5ml/L.',
    chemicalTreatment: 'Difenoconazole 25% EC @ 0.5ml/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L.',
    prevention: 'Collect and destroy fallen infected pods. Seed treatment with Thiram.',
    spraySafety: 'Safe window open.'
  },
  'Groundnut (Peanut)': {
    name: 'Tikka Leaf Spot (Cercospora)',
    confidence: 91.0,
    severity: 'Moderate',
    affected: '10% Leaf Area',
    stage: 'Early Leaf Spotting',
    organ: 'Upper Leaf Surface',
    symptoms: 'Small dark brown to black circular spots surrounded by yellow halos.',
    organicTreatment: 'Foliar spray of buttermilk solution (5%) + neem oil.',
    chemicalTreatment: 'Tebuconazole 25.9% m/m EC @ 1.5ml/L or Carbendazim 50% WP @ 1g/L.',
    prevention: 'Adopt 3-year crop rotation with maize or sorghum.',
    spraySafety: 'Clear sky suitable for foliar absorption.'
  },
  'Sugarcane': {
    name: 'Sugarcane Red Rot (Colletotrichum falcatum)',
    confidence: 93.5,
    severity: 'Critical',
    affected: 'Stalk & Canopy',
    stage: 'Internal Stalk Rotting',
    organ: 'Internal Canes & Midribs',
    symptoms: 'Reddening of internal stalk tissue with crosswise white patches and alcoholic odor.',
    organicTreatment: 'Soil drenching with Trichoderma viride culture.',
    chemicalTreatment: 'Set treatment with Carbendazim 50% WP @ 2g/L prior to planting.',
    prevention: 'Plant disease-free setts from nurseries. Avoid ratoon crops in infected fields.',
    spraySafety: 'Soil drenching recommended.'
  },
  'Banana': {
    name: 'Sigatoka Leaf Spot (Mycosphaerella fijiensis)',
    confidence: 95.2,
    severity: 'High',
    affected: '20% Foliage Area',
    stage: 'Streak Expansion',
    organ: '3rd to 5th Mature Leaves',
    symptoms: 'Dark reddish-brown streaks expanding into dry necrotic spots with yellow borders.',
    organicTreatment: 'Mineral oil emulsion spray @ 1% + Neem oil.',
    chemicalTreatment: 'Propiconazole 25% EC @ 1ml/L with 1% mineral oil stickers.',
    prevention: 'Desucker plants regularly to maintain ventilation in orchard.',
    spraySafety: 'Foliar spray effective.'
  },
  'Citrus (Orange/Lemon)': {
    name: 'Citrus Canker (Xanthomonas citri)',
    confidence: 94.0,
    severity: 'Moderate',
    affected: 'Leaves & Fruit Peel',
    stage: 'Corky Lesion Development',
    organ: 'Rind & Leaf Lamina',
    symptoms: 'Raised corky brown spots surrounded by yellow oily water-soaked halos.',
    organicTreatment: 'Copper hydroxide 77% WP @ 2g/L + Streptocycline 100ppm.',
    chemicalTreatment: 'Copper Oxychloride @ 3g/L + Agrimycin @ 0.5g/L.',
    prevention: 'Prune infected twigs before monsoon rains.',
    spraySafety: 'Spray after pruning.'
  }
};

export function getDiseaseDiagnosis(cropName, symptomsList = []) {
  if (diseaseDatabase[cropName]) {
    return diseaseDatabase[cropName];
  }
  // Generic Intelligent Diagnosis Fallback for any of the 24+ crops
  return {
    name: `${cropName} Leaf Spot & Nutrient Chlorosis Complex`,
    confidence: 92.4,
    severity: symptomsList.length > 2 ? 'High' : 'Moderate',
    affected: '15% Plant Foliage',
    stage: 'Foliar Spot Expansion',
    organ: 'Leaves & Terminal Shoots',
    symptoms: symptomsList.length > 0 ? symptomsList.join(', ') : 'Leaf yellowing, marginal necrosis, and minor brown lesions.',
    organicTreatment: `Apply Neem Seed Kernel Extract (5%) + Bio-control Trichoderma viride @ 5g/L water for ${cropName}.`,
    chemicalTreatment: `Foliar spray of Mancozeb 75% WP @ 2g/L or Azoxystrobin 23% SC @ 1ml/L tailored for ${cropName}.`,
    prevention: `Maintain proper plant spacing, balanced NPK nutrition, and avoid waterlogging in ${cropName} field.`,
    spraySafety: 'Clear weather window available for foliar treatment today.'
  };
}

export function recommendCrops(params) {
  const { season } = params;
  if (season.includes('Kharif')) {
    return [
      { crop: 'Paddy Rice (BPT 5204)', confidence: 96, yield: '28-32 q/acre', profit: '₹42,000', fertilizer: 'NPK 120:60:60', irrigation: 'Flood / Alternate Wetting' },
      { crop: 'Cotton (Bt Hybrid)', confidence: 91, yield: '12-15 q/acre', profit: '₹55,000', fertilizer: 'NPK 90:45:45', irrigation: 'Drip Irrigation 3 days/wk' },
      { crop: 'Red Gram (Tur / Arhar)', confidence: 85, yield: '8-10 q/acre', profit: '₹38,000', fertilizer: 'NPK 20:50:20', irrigation: 'Rainfed / Protective Irrigation' },
    ];
  }
  return [
    { crop: 'Wheat (HD 2967)', confidence: 95, yield: '22-26 q/acre', profit: '₹36,000', fertilizer: 'NPK 120:60:40', irrigation: '4-5 Critical Stages' },
    { crop: 'Mustard (Pusa Bold)', confidence: 89, yield: '8-11 q/acre', profit: '₹32,000', fertilizer: 'NPK 80:40:40 + Sulfur', irrigation: '2 Irrigations' },
    { crop: 'Chickpea (Desi Gram)', confidence: 86, yield: '9-12 q/acre', profit: '₹34,000', fertilizer: 'NPK 20:50:20', irrigation: 'Light Pre-flowering' },
  ];
}
