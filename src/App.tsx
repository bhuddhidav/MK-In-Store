/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, 
  ShoppingCart, 
  Settings, 
  CreditCard, 
  Clock, 
  Bell, 
  Flame, 
  Wind, 
  Music, 
  Gamepad2, 
  EyeOff, 
  Eye, 
  Plus, 
  Minus, 
  AlertCircle,
  UtensilsCrossed,
  Bot,
  Soup,
  Trash2,
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from './lib/utils';
import { Category, MenuItem, OrderItem, RoomSettings, RoomMode, EntertainmentMode } from './types';
import { MENU_ITEMS, STARTER_SET } from './constants';

const MAX_ITEMS_PER_ROUND = 10;

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'menu' | 'service' | 'experience' | 'payment'>('menu');
  
  // Menu & Cart State
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [dietaryFilter, setDietaryFilter] = useState<{ vegetarian: boolean; allergens: string[] }>({
    vegetarian: false,
    allergens: []
  });
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([]);
  
  // Room State
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    lighting: 'Normal',
    temperature: 22,
    privacy: 'Ready',
    entertainment: 'None'
  });
  
  // Timer State (100 minutes)
  const [timeLeft, setTimeLeft] = useState(100 * 60);
  
  // UI State
  const [showCart, setShowCart] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timerColor = useMemo(() => {
    if (timeLeft > 30 * 60) return 'text-emerald-500';
    if (timeLeft > 10 * 60) return 'text-yellow-500';
    return 'text-red-500';
  }, [timeLeft]);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    const currentTotal = Object.values(cart).reduce((a, b) => a + b, 0);
    if (currentTotal >= MAX_ITEMS_PER_ROUND) {
      alert(`Max limit of ${MAX_ITEMS_PER_ROUND} items reached for this round!`);
      return;
    }
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const placeOrder = () => {
    const newOrders: OrderItem[] = Object.entries(cart).map(([id, quantity]) => {
      const item = MENU_ITEMS.find(m => m.id === id)!;
      return { ...item, quantity, timestamp: Date.now() };
    });
    setOrderHistory(prev => [...prev, ...newOrders]);
    setCart({});
    setShowCart(false);
  };

  const quickLaunchStarter = () => {
    const starterCart: Record<string, number> = {};
    STARTER_SET.forEach(item => {
      starterCart[item.id] = 1;
    });
    setCart(starterCart);
    setShowCart(true);
  };

  // Filtered Menu
  const filteredMenu = MENU_ITEMS.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (dietaryFilter.vegetarian && !item.isVegetarian) return false;
    if (dietaryFilter.allergens.some(a => item.allergens.includes(a))) return false;
    return true;
  });

  const totalBill = orderHistory.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-24 border-r border-white/10 flex flex-col items-center py-8 gap-8 bg-[#0d0d0d]">
        <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center mb-4">
          <Flame className="w-8 h-8 text-white" />
        </div>
        
        <NavButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={<MenuIcon />} label="Menu" />
        <NavButton active={activeTab === 'service'} onClick={() => setActiveTab('service')} icon={<Bell />} label="Service" />
        <NavButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Settings />} label="Room" />
        <NavButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} icon={<CreditCard />} label="Bill" />

        <div className="mt-auto flex flex-col items-center gap-4">
          <div className={cn("flex flex-col items-center", timerColor)}>
            <Clock className="w-6 h-6" />
            <span className="text-xs font-mono mt-1">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 rounded-full text-[10px] flex items-center justify-center font-bold">
                {Object.values(cart).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Conveyor Tracker */}
        <div className="h-16 border-b border-white/10 bg-[#0d0d0d] flex items-center overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10 flex items-center px-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500">On Belt</span>
          </div>
          <div className="flex gap-8 whitespace-nowrap animate-[conveyor_30s_linear_infinite] px-4">
            {MENU_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <img src={item.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Switcher */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'menu' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Digital Menu</h1>
                  <p className="text-white/50 mt-1">Select your premium ingredients</p>
                </div>
                <button 
                  onClick={quickLaunchStarter}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Starter Set Quick-Launch
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['All', 'Beef', 'Pork', 'Seafood', 'Veggies', 'Appetizers'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedCategory === cat ? "bg-white text-black" : "text-white/60 hover:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <button 
                  onClick={() => setDietaryFilter(prev => ({ ...prev, vegetarian: !prev.vegetarian }))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2",
                    dietaryFilter.vegetarian ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-white/10 text-white/60"
                  )}
                >
                  Vegetarian Only
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenu.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="group bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/50 transition-all"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.isVegetarian && (
                        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Veg</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <span className="font-mono text-rose-500 font-bold">฿{item.price}</span>
                      </div>
                      <p className="text-white/40 text-xs line-clamp-2 mb-4 h-8">{item.description}</p>
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full bg-white/5 hover:bg-rose-600 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold group/btn"
                      >
                        <Plus className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'service' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold">Service & Automation</h1>
                <p className="text-white/50 mt-2">Need assistance? Tap a button below.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ServiceCard 
                  title="Robot Summoner" 
                  desc="Call the serving robot for premium items or large platters." 
                  icon={<Bot className="w-12 h-12 text-rose-500" />}
                  onClick={() => alert("Robot is on its way to your table!")}
                  primary
                />
                <ServiceCard 
                  title="SOS / Staff Call" 
                  desc="Direct human assistance for emergencies or special requests." 
                  icon={<AlertCircle className="w-12 h-12 text-red-500" />}
                  onClick={() => alert("Staff notified. Please wait a moment.")}
                  danger
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <QuickServiceButton icon={<Soup />} label="Refill Soup" onClick={() => alert("Soup refill requested")} />
                <QuickServiceButton icon={<Flame />} label="Change Grill" onClick={() => alert("Grill plate change requested")} />
                <QuickServiceButton icon={<Wind />} label="Napkins" onClick={() => alert("Napkins requested")} />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold">Room Controls</h1>
                  <p className="text-white/50 mt-2">Personalize your private dining experience</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setRoomSettings(s => ({ ...s, privacy: 'DND' }))}
                    className={cn("px-6 py-2 rounded-xl flex items-center gap-2 transition-all", roomSettings.privacy === 'DND' ? "bg-red-600 text-white" : "text-white/40")}
                  >
                    <EyeOff className="w-4 h-4" /> DND
                  </button>
                  <button 
                    onClick={() => setRoomSettings(s => ({ ...s, privacy: 'Ready' }))}
                    className={cn("px-6 py-2 rounded-xl flex items-center gap-2 transition-all", roomSettings.privacy === 'Ready' ? "bg-emerald-600 text-white" : "text-white/40")}
                  >
                    <Eye className="w-4 h-4" /> Ready
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lighting */}
                <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-500" /> Mood Lighting
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(['Normal', 'Party', 'Romantic', 'Chill'] as RoomMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setRoomSettings(s => ({ ...s, lighting: mode }))}
                        className={cn(
                          "p-4 rounded-2xl border transition-all text-sm font-bold",
                          roomSettings.lighting === mode ? "border-rose-500 bg-rose-500/10 text-rose-500" : "border-white/5 bg-white/5 text-white/40"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Climate */}
                <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Wind className="w-5 h-5 text-blue-500" /> Climate Control
                  </h3>
                  <div className="flex flex-col items-center justify-center gap-4 py-4">
                    <span className="text-6xl font-mono font-bold">{roomSettings.temperature}°C</span>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setRoomSettings(s => ({ ...s, temperature: s.temperature - 1 }))}
                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                      >
                        <Minus />
                      </button>
                      <button 
                        onClick={() => setRoomSettings(s => ({ ...s, temperature: s.temperature + 1 }))}
                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Entertainment */}
                <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-purple-500" /> Entertainment
                  </h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setRoomSettings(s => ({ ...s, entertainment: 'Karaoke' }))}
                      className={cn(
                        "w-full p-4 rounded-2xl border flex items-center gap-4 transition-all",
                        roomSettings.entertainment === 'Karaoke' ? "border-purple-500 bg-purple-500/10" : "border-white/5 bg-white/5"
                      )}
                    >
                      <Music className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Karaoke Mode</div>
                        <div className="text-xs text-white/40">Search songs & queue</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => setRoomSettings(s => ({ ...s, entertainment: 'Gaming' }))}
                      className={cn(
                        "w-full p-4 rounded-2xl border flex items-center gap-4 transition-all",
                        roomSettings.entertainment === 'Gaming' ? "border-blue-500 bg-blue-500/10" : "border-white/5 bg-white/5"
                      )}
                    >
                      <Gamepad2 className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Gaming Mode</div>
                        <div className="text-xs text-white/40">Nintendo Switch titles</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Bill & Checkout</h1>
                <div className="text-right">
                  <div className="text-white/50 text-sm">Total Amount</div>
                  <div className="text-4xl font-mono font-bold text-rose-500">฿{totalBill.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order History */}
                <div className="bg-[#151515] rounded-3xl border border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold">Order History</h3>
                    <span className="text-xs text-white/40">{orderHistory.length} items ordered</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
                    {orderHistory.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-white/40">x{item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono text-sm">฿{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                    {orderHistory.length === 0 && (
                      <div className="text-center py-12 text-white/20">No orders yet</div>
                    )}
                  </div>
                </div>

                {/* Checkout Actions */}
                <div className="space-y-6">
                  <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6">
                    <h3 className="font-bold flex items-center gap-2"><Filter className="w-5 h-5" /> Split Bill Calculator</h3>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                      <span className="text-white/60">Number of People</span>
                      <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">-</button>
                        <span className="font-bold">4</span>
                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                      <span className="font-bold text-rose-500">Each Person Pays</span>
                      <span className="text-2xl font-mono font-bold">฿{(totalBill / 4).toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFeedback(true)}
                    className="w-full bg-white text-black py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95"
                  >
                    <CreditCard className="w-6 h-6" />
                    Self-Checkout (QR Pay)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#0d0d0d] border-l border-white/10 z-50 flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-rose-500" /> Smart Cart
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/5 rounded-full"><Minus /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {Object.entries(cart).map(([id, quantity]) => {
                  const item = MENU_ITEMS.find(m => m.id === id)!;
                  return (
                    <div key={id} className="flex gap-4 group">
                      <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold">{item.name}</h4>
                          <button onClick={() => removeFromCart(id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="text-rose-500 font-mono text-sm mt-1">฿{item.price}</div>
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => removeFromCart(id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Minus className="w-3 h-3" /></button>
                          <span className="font-bold font-mono">{quantity}</span>
                          <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(cart).length === 0 && (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingCart className="w-8 h-8 text-white/20" />
                    </div>
                    <p className="text-white/40">Your cart is empty</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-[#111] border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Round Total</span>
                  <span className="text-2xl font-mono font-bold">฿{Object.entries(cart).reduce((sum, [id, q]) => sum + (MENU_ITEMS.find(m => m.id === id)!.price * q), 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-yellow-500 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                  <AlertCircle className="w-3 h-3" />
                  Prevent food waste: Max {MAX_ITEMS_PER_ROUND} items per order round.
                </div>
                <button 
                  disabled={Object.keys(cart).length === 0}
                  onClick={placeOrder}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                >
                  Confirm Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#151515] w-full max-w-lg rounded-[40px] p-12 border border-white/10 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-rose-600/40">
                <Star className="w-12 h-12 text-white fill-current" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">How was your meal?</h2>
                <p className="text-white/50 mt-2">Rate your food and robot service</p>
              </div>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      feedbackRating >= star ? "bg-rose-600 text-white scale-110" : "bg-white/5 text-white/20 hover:bg-white/10"
                    )}
                  >
                    <Star className={cn("w-6 h-6", feedbackRating >= star && "fill-current")} />
                  </button>
                ))}
              </div>
              <div className="pt-4">
                <button 
                  onClick={() => {
                    alert("Thank you for your feedback! Payment QR generated.");
                    setShowFeedback(false);
                  }}
                  className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg"
                >
                  Submit & Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all group",
        active ? "text-rose-500" : "text-white/40 hover:text-white"
      )}
    >
      <div className={cn(
        "p-3 rounded-2xl transition-all",
        active ? "bg-rose-500/10" : "group-hover:bg-white/5"
      )}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

function ServiceCard({ title, desc, icon, onClick, primary, danger }: { title: string; desc: string; icon: React.ReactNode; onClick: () => void; primary?: boolean; danger?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-8 rounded-[32px] border text-left transition-all active:scale-95 group",
        primary ? "bg-rose-600/5 border-rose-600/20 hover:bg-rose-600/10" : 
        danger ? "bg-red-600/5 border-red-600/20 hover:bg-red-600/10" : 
        "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      <div className="mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-white/40 text-sm">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white/60">
        Tap to summon <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}

function QuickServiceButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#151515] border border-white/5 p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-white/5 transition-all active:scale-95"
    >
      <div className="p-4 bg-white/5 rounded-2xl text-white/60">
        {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
      </div>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
