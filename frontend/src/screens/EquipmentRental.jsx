import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tractor,
  Star,
  CheckCircle2,
  Search,
  Calendar,
  Clock,
  MapPin,
  X,
  ShieldCheck,
  Phone,
  MessageSquare,
  CreditCard,
  QrCode,
  DollarSign,
  UserCheck,
  Navigation,
  ChevronRight,
  Sparkles,
  PlusCircle,
  Plus,
  Upload,
  BadgeCheck,
  Wrench
} from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { useAuth } from '../lib/auth.jsx';
import { equipment as initialEquipment } from '../lib/data.js';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const PRESET_IMAGES = [
  { name: 'John Deere Tractor', url: '/equipment/john_deere_5050d.jpg' },
  { name: 'Mahindra Heavy Tractor', url: '/equipment/mahindra_arjun_novo.jpg' },
  { name: 'Kubota Harvester', url: '/equipment/kubota_harvester.jpg' },
  { name: 'Claas Grain Harvester', url: '/equipment/class_harvester.jpg' },
  { name: 'DJI Agriculture Drone', url: '/equipment/dajiang_drone_t30.jpg' },
  { name: 'Aspee Boom Sprayer', url: '/equipment/aspee_boom_sprayer.jpg' },
  { name: 'Mahindra Disc Harrow', url: '/equipment/mahindra_disc_harrow.jpg' },
  { name: 'Shaktiman Rotavator', url: '/equipment/shaktiman_rotavator.jpg' },
  { name: 'Fieldking Land Leveler', url: '/equipment/fieldking_leveler.jpg' },
  { name: 'Pneumatic Precision Seeder', url: '/equipment/pneumatic_seeder.jpg' },
];

export function EquipmentRental() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState(initialEquipment);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPreBooking, setIsPreBooking] = useState(false);

  // Listing Form Modal State (Make Equipment Rentable)
  const [showListModal, setShowListModal] = useState(false);
  const [listSuccessAlert, setListSuccessAlert] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Tractor');
  const [newSpecs, setNewSpecs] = useState('');
  const [newPrice, setNewPrice] = useState(600);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerLocation, setNewOwnerLocation] = useState('');
  const [newImage, setNewImage] = useState('/equipment/john_deere_5050d.jpg');

  // Auto-fill owner info from logged in profile
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setNewOwnerName(profile.full_name);
      if (profile.mobile) setNewOwnerPhone(profile.mobile);
      if (profile.village) {
        setNewOwnerLocation(`${profile.village}${profile.district ? ', ' + profile.district : ''}`);
      }
    }
  }, [profile]);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState(4);
  const [equipmentQuantity, setEquipmentQuantity] = useState(1);
  const [includeDriver, setIncludeDriver] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('Chandapur Village, Medak');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [upiId, setUpiId] = useState('farmer@upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Status & Receipts
  const [submitting, setSubmitting] = useState(false);
  const [bookedReceipt, setBookedReceipt] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  const categories = ['All', 'Tractor', 'Harvester', 'Seeder', 'Sprayer', 'Tillage', 'Drone'];

  // Fetch Database Storable User Equipment Listings & Bookings
  const fetchDatabaseData = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    // Fetch user bookings
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/equipment-bookings/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMyBookings(data);
        }
      } catch {}
    }

    // Fetch user listed equipment from DB
    try {
      const res = await fetch(`${API_BASE_URL}/equipment-listings/`);
      if (res.ok) {
        const dbListings = await res.json();
        if (dbListings && dbListings.length > 0) {
          const formattedDbListings = dbListings.map((l) => ({
            id: l.id,
            name: l.name,
            category: l.category,
            specs: l.specs,
            price: parseFloat(l.price),
            unit: l.unit || 'hour',
            rating: parseFloat(l.rating || 5.0),
            available: l.available,
            isUserOwned: true,
            image: l.image || '/equipment/john_deere_5050d.jpg',
            owner: {
              name: l.owner_name,
              phone: l.owner_phone,
              location: l.owner_location,
              verified: true
            }
          }));

          setItems((prevItems) => {
            const existingIds = new Set(prevItems.map((i) => i.id));
            const newToAdd = formattedDbListings.filter((l) => !existingIds.has(l.id));
            return [...newToAdd, ...prevItems];
          });
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.specs.toLowerCase().includes(search.toLowerCase()) ||
      item.owner?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenBooking = (item, preBook = false) => {
    setSelectedItem(item);
    setIsPreBooking(preBook);
    setEquipmentQuantity(1);
    if (preBook && item.nextAvailableDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(tomorrow.toISOString().slice(0, 10));
    } else {
      setBookingDate(new Date().toISOString().slice(0, 10));
    }
  };

  // Submit New Equipment Listing (Make Equipment Rentable)
  const handleMakeEquipmentRentable = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newSpecs.trim()) return;

    setSubmitting(true);
    const ownerName = newOwnerName || profile?.full_name || user?.email?.split('@')[0] || 'Farmer Owner';
    const ownerPhone = newOwnerPhone || profile?.mobile || '+91 98450 12345';
    const ownerLocation = newOwnerLocation || (profile?.village ? `${profile.village}, ${profile.district}` : 'Chandapur Village, Medak');

    const newListingObj = {
      id: `eq-user-${Date.now()}`,
      name: newName,
      category: newCategory,
      specs: newSpecs,
      price: parseFloat(newPrice) || 500,
      unit: 'hour',
      rating: 5.0,
      available: true,
      isUserOwned: true,
      image: newImage,
      owner: {
        name: ownerName,
        phone: ownerPhone,
        location: ownerLocation,
        verified: true
      }
    };

    // Update real-time state immediately
    setItems((prev) => [newListingObj, ...prev]);

    // Send to Django REST API Database
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    try {
      await fetch(`${API_BASE_URL}/equipment-listings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: newName,
          category: newCategory,
          specs: newSpecs,
          price: newPrice,
          unit: 'hour',
          rating: 5.0,
          available: true,
          image: newImage,
          owner_name: ownerName,
          owner_phone: ownerPhone,
          owner_location: ownerLocation
        })
      });
    } catch {}

    setSubmitting(false);
    setShowListModal(false);
    setListSuccessAlert(newName);

    // Reset Form
    setNewName('');
    setNewSpecs('');
  };

  const confirmBookingAndPayment = async () => {
    if (!selectedItem) return;
    setSubmitting(true);

    const qty = Math.max(1, parseInt(equipmentQuantity) || 1);
    const baseAmount = selectedItem.price * hours * qty;
    const driverFee = includeDriver ? 150 * hours * qty : 0;
    const totalAmount = baseAmount + driverFee;
    const refId = `URV-RENT-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBookingObj = {
      refId,
      equipmentName: selectedItem.name,
      category: selectedItem.category,
      date: bookingDate,
      hours,
      quantity: qty,
      totalAmount,
      deliveryAddress,
      owner: selectedItem.owner,
      paymentMethod: paymentMethod.toUpperCase(),
      status: isPreBooking ? 'pre-booked' : 'confirmed'
    };

    setBookedReceipt(newBookingObj);
    setMyBookings((prev) => [newBookingObj, ...prev]);

    if (!isPreBooking) {
      setItems(items.map((i) => (i.id === selectedItem.id ? { ...i, available: false, nextAvailableDate: `Pre-Booked for ${bookingDate}` } : i)));
    }

    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/equipment-bookings/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            equipment: selectedItem.name,
            booking_date: bookingDate,
            duration_hours: hours,
            price: totalAmount,
            status: isPreBooking ? 'pre-booked' : 'confirmed'
          })
        });
      } catch {}
    }

    setSubmitting(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Farm Equipment Rental Marketplace"
          subtitle="Real-time machinery dispatch, instant owner contacts, pre-booking & secure digital payments."
        />

        {/* Action Button to Make Own Equipment Rentable */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowListModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#15803D] to-[#0284C7] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer transition-all shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Make Your Equipment Rentable</span>
        </motion.button>
      </div>

      {/* Success Banner when User Lists Equipment */}
      <AnimatePresence>
        {listSuccessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between relative shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Equipment Published Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>{listSuccessAlert}</strong> is now live on the Urvixa Marketplace for nearby farmers to rent.
                </p>
              </div>
            </div>
            <button
              onClick={() => setListSuccessAlert(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmed Booking Digital Receipt Alert */}
      <AnimatePresence>
        {bookedReceipt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 shadow-md relative space-y-3"
          >
            <button
              onClick={() => setBookedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-[#15803D] dark:text-[#86E39A] tracking-wider">
                  {bookedReceipt.status === 'pre-booked' ? 'Pre-Booking Confirmed' : 'Instant Rental Confirmed'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Booking Receipt #{bookedReceipt.refId}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <strong>{bookedReceipt.equipmentName}</strong> ({bookedReceipt.quantity || 1} unit{(bookedReceipt.quantity || 1) > 1 ? 's' : ''}) reserved for <strong>{bookedReceipt.hours} hrs</strong> on <strong>{bookedReceipt.date}</strong>. Total Paid ({bookedReceipt.paymentMethod}): <strong>₹{bookedReceipt.totalAmount.toLocaleString()}</strong>.
                </p>
                {bookedReceipt.owner && (
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span>Owner: {bookedReceipt.owner.name}</span>
                    <a
                      href={`tel:${bookedReceipt.owner.phone}`}
                      className="inline-flex items-center gap-1 text-[#15803D] hover:underline font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call {bookedReceipt.owner.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Control Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search machinery, specs, owner..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
          />
        </div>
      </div>

      {/* Machinery Catalog Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id || item.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Preview & Badges Header */}
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = '/equipment/john_deere_5050d.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                    {item.category}
                  </span>
                  {item.isUserOwned && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 backdrop-blur-md text-white text-[11px] font-bold">
                      Your Listing
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                      item.available
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.available ? 'Available Now' : 'Occupied'}
                  </span>
                </div>
              </div>

              {/* Machinery Specs Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {item.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal line-clamp-2">
                  {item.specs}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{item.rating} Rating</span>
                </div>

                {/* Owner & Real-Time Contact Box */}
                {item.owner && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#15803D]" /> {item.owner.name}
                      </span>
                      {item.owner.verified && (
                        <span className="text-[10px] font-semibold text-[#15803D] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {item.owner.location}
                    </p>

                    {/* Real-time Call & WhatsApp Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`tel:${item.owner.phone}`}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#15803D] dark:text-[#86E39A] font-semibold text-[11px] flex items-center justify-center gap-1 hover:bg-[#15803D] hover:text-white transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Call Owner
                      </a>
                      <a
                        href={`https://wa.me/${item.owner.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-[11px] flex items-center justify-center gap-1 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Action Button Footer */}
            <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-900/40">
              <div>
                <span className="text-xs text-slate-400">Rate</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  ₹{item.price}<span className="text-xs font-normal text-slate-500">/{item.unit}</span>
                </p>
              </div>

              {item.available ? (
                <button
                  type="button"
                  onClick={() => handleOpenBooking(item, false)}
                  className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Book Equipment
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenBooking(item, true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                  title="Equipment currently rented. Click to pre-book next slot."
                >
                  Pre-Book Next Slot
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Database Storable User Bookings Section */}
      {myBookings.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#15803D]" /> My Active & Pre-Booked Machinery Orders
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {myBookings.map((b, idx) => (
              <div
                key={b.refId || idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">{b.equipmentName}</span>
                  <span className="text-emerald-700 dark:text-emerald-300 uppercase text-[10px] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {b.status}
                  </span>
                </div>
                <p className="text-slate-500">Ref: {b.refId} • Date: {b.date}</p>
                <p className="font-bold text-slate-900 dark:text-white">Qty: {b.quantity || 1} unit(s) • Duration: {b.hours} hrs | Total: ₹{b.totalAmount}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make Equipment Rentable Modal */}
      <AnimatePresence>
        {showListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#15803D] to-[#0284C7] text-white flex items-center justify-center">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Make Your Equipment Rentable
                    </h3>
                    <p className="text-xs text-slate-500">List your tractor, harvester or implement to earn hourly income.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowListModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleMakeEquipmentRentable} className="space-y-4 text-xs">
                <div>
                  <label className="block mb-1 font-bold text-slate-700 dark:text-slate-300">
                    Equipment Model & Name *
                  </label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Sonalika DI 750 III Tractor (55 HP)"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-bold text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      {categories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-bold text-slate-700 dark:text-slate-300">
                      Hourly Rent Rate (₹/hr) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={10000}
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700 dark:text-slate-300">
                    Technical Specifications & Features *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newSpecs}
                    onChange={(e) => setNewSpecs(e.target.value)}
                    placeholder="e.g. 55 HP, Heavy Duty PTO, Multi Speed Shuttle, 4WD Axle, Excellent condition"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Owner Information (Pre-filled) */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="block font-bold text-slate-900 dark:text-white">
                    Owner & Contact Information
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-400">
                        Owner Name
                      </label>
                      <input
                        value={newOwnerName}
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        placeholder="Ramesh Kumar"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-400">
                        Contact Phone
                      </label>
                      <input
                        value={newOwnerPhone}
                        onChange={(e) => setNewOwnerPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-400">
                      Location / Village Hub
                    </label>
                    <input
                      value={newOwnerLocation}
                      onChange={(e) => setNewOwnerLocation(e.target.value)}
                      placeholder="Chandapur Village, Medak"
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    />
                  </div>
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block mb-1.5 font-bold text-slate-700 dark:text-slate-300">
                    Select Equipment Photo Preset
                  </label>
                  <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {PRESET_IMAGES.map((img) => (
                      <div
                        key={img.url}
                        onClick={() => setNewImage(img.url)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all relative ${
                          newImage === img.url ? 'border-[#15803D] ring-2 ring-[#15803D]/40' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-12 object-cover" />
                        <span className="block text-[9px] truncate p-0.5 text-center bg-black/60 text-white font-semibold">
                          {img.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-11 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    {submitting ? 'Publishing Listing...' : 'Publish Equipment for Rent'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowListModal(false)}
                    className="h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Multi-Step Booking & Payment Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
                    <Tractor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {isPreBooking ? 'Pre-Book Next Slot' : 'Instant Rental Booking'}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedItem.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step 1: Rental Configuration */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rental Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rental Duration
                    </label>
                    <select
                      value={hours}
                      onChange={(e) => setHours(+e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value={2}>2 Hours</option>
                      <option value={4}>4 Hours (Half Day)</option>
                      <option value={8}>8 Hours (Full Day)</option>
                      <option value={12}>12 Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Quantity (Units)
                    </label>
                    <select
                      value={equipmentQuantity}
                      onChange={(e) => setEquipmentQuantity(+e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value={1}>1 Unit</option>
                      <option value={2}>2 Units</option>
                      <option value={3}>3 Units</option>
                      <option value={4}>4 Units</option>
                      <option value={5}>5 Units</option>
                    </select>
                  </div>
                </div>

                {/* Driver / Operator Preference */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Operator / Driver Option
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="driver"
                        checked={includeDriver}
                        onChange={() => setIncludeDriver(true)}
                        className="accent-[#15803D]"
                      />
                      Include Certified Driver (+₹150/hr per unit)
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-700 dark:text-slate-300">
                      <input
                        type="radio"
                        name="driver"
                        checked={!includeDriver}
                        onChange={() => setIncludeDriver(false)}
                        className="accent-[#15803D]"
                      />
                      Self-Drive / Own Operator
                    </label>
                  </div>
                </div>

                {/* Delivery Location */}
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Delivery Address / Field Location
                  </label>
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Chandapur Village, Survey No. 104"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Step 2: Payment Method Selection */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Select Digital Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-[#15803D] bg-[#15803D]/10 text-[#15803D] dark:text-[#86E39A]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4" /> UPI Instant
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#15803D] bg-[#15803D]/10 text-[#15803D] dark:text-[#86E39A]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-[#15803D] bg-[#15803D]/10 text-[#15803D] dark:text-[#86E39A]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" /> Pay on Delivery
                    </button>
                  </div>

                  {/* Payment Inputs */}
                  {paymentMethod === 'upi' && (
                    <div className="pt-2">
                      <label className="block mb-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        VPA / UPI ID (Google Pay / PhonePe / BHIM)
                      </label>
                      <input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="pt-2 space-y-2">
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (4532 •••• •••• 8890)"
                        className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                        />
                        <input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          type="password"
                          className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Price Breakdown */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 space-y-1.5 text-xs border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Hourly Rate (₹{selectedItem.price}/hr × {hours}h × {equipmentQuantity} unit{equipmentQuantity > 1 ? 's' : ''}):</span>
                    <span>₹{selectedItem.price * hours * equipmentQuantity}</span>
                  </div>
                  {includeDriver && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Certified Driver Fee (₹150/hr × {hours}h × {equipmentQuantity} unit{equipmentQuantity > 1 ? 's' : ''}):</span>
                      <span>+₹{150 * hours * equipmentQuantity}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#15803D] dark:text-[#86E39A] pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Amount Payable:</span>
                    <span>₹{(selectedItem.price * hours * equipmentQuantity + (includeDriver ? 150 * hours * equipmentQuantity : 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  disabled={submitting}
                  onClick={confirmBookingAndPayment}
                  className="flex-1 h-11 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  {submitting ? (
                    'Processing Payment...'
                  ) : (
                    <>
                      <span>Pay & {isPreBooking ? 'Pre-Book Slot' : 'Confirm Order'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
