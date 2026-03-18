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
  Soup,
  Trash2,
  Star,
  ChevronRight,
  Filter,
  ChefHat,
  User,
  Award,
  Gift,
  QrCode,
  TrendingUp,
  IdCard,
  ShieldAlert,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { Category, MenuItem, OrderItem, RoomSettings, RoomMode, EntertainmentMode, Language } from './types';
import { MENU_ITEMS, STARTER_SET, PROMOTION_BASE_PRICE } from './constants';

const MAX_ITEMS_PER_ROUND = 10;

const translations = {
  en: {
    menu: 'Menu',
    service: 'Service',
    room: 'Membership',
    bill: 'Bill',
    onBelt: 'On Belt',
    digitalMenu: 'Digital Menu',
    selectIngredients: 'Select your premium ingredients - Starting at 299 THB/person',
    starterSet: 'Starter Set Quick-Launch',
    seasonal: 'Drinks',
    included: 'Included',
    addon: 'Add-on',
    addToCart: 'Add to Cart',
    serviceAutomation: 'Service & Automation',
    needAssistance: 'Need assistance? Tap a button below.',
    sosCall: 'SOS / Staff Call',
    sosDesc: 'Direct human assistance for emergencies or special requests.',
    staffAlert: 'Staff notified. Please wait a moment.',
    refillSoup: 'Refill Soup',
    napkins: 'Napkins',
    roomControls: 'Membership Dashboard',
    personalize: 'Exclusive benefits for our premium members',
    memberTier: 'Gold Member',
    memberPoints: 'Points Balance',
    memberId: 'Member ID',
    redeemRewards: 'Redeem Rewards',
    exclusiveOffers: 'Exclusive Offers',
    pointsToNextTier: '250 points to Platinum',
    referFriend: 'Refer a Friend',
    referDesc: 'Get 100 points for each referral',
    birthdayGift: 'Birthday Month Gift',
    birthdayDesc: 'Free premium Wagyu platter',
    foodAllergy: 'Food Allergy Info',
    allergyNotice: 'Please inform our staff if you have any food allergies.',
    commonAllergens: 'Common Allergens',
    peanuts: 'Peanuts',
    shellfish: 'Shellfish',
    gluten: 'Gluten',
    dairy: 'Dairy',
    soy: 'Soy',
    eggs: 'Eggs',
    allergyDisclaimer: 'While we take precautions, cross-contamination may occur.',
    moodLighting: 'Mood Lighting',
    climateControl: 'Climate Control',
    entertainment: 'Entertainment',
    karaokeMode: 'Karaoke Mode',
    karaokeDesc: 'Search songs & queue',
    gamingMode: 'Gaming Mode',
    gamingDesc: 'Nintendo Switch titles',
    billCheckout: 'Bill & Checkout',
    totalAmount: 'Total Amount',
    orderHistory: 'Order History',
    itemsOrdered: 'items ordered',
    noOrders: 'No orders yet',
    splitBill: 'Split Bill Calculator',
    numPeople: 'Number of People',
    eachPays: 'Each Person Pays',
    selfCheckout: 'Self-Checkout (QR Pay)',
    smartCart: 'Smart Cart',
    cartEmpty: 'Your cart is empty',
    roundTotal: 'Round Total',
    foodWasteAlert: 'Prevent food waste: Max {max} items per order round.',
    confirmOrder: 'Confirm Order',
    howWasMeal: 'How was your meal?',
    rateService: 'Rate your food and robot service',
    submitPay: 'Submit & Pay',
    feedbackAlert: 'Thank you for your feedback! Payment QR generated.',
    tapToSummon: 'Tap to summon',
    all: 'All',
    soup: 'Soup',
    meat: 'Meat',
    vegetable: 'Vegetable',
    appetizer: 'Appetizer',
    riceNoodle: 'Rice/Noodle',
    dessert: 'Dessert',
    veg: 'Veg',
    promotion: 'Promotion',
    normal: 'Normal',
    party: 'Party',
    romantic: 'Romantic',
    chill: 'Chill',
    dnd: 'DND',
    ready: 'Ready',
    maxItemsAlert: 'Max limit of {max} items reached for this round!',
    people: 'people',
    new: 'NEW'
  },
  th: {
    menu: 'เมนู',
    service: 'บริการ',
    room: 'สมาชิก',
    bill: 'บิล',
    onBelt: 'บนสายพาน',
    digitalMenu: 'เมนูดิจิทัล',
    selectIngredients: 'เลือกวัตถุดิบพรีเมียมของคุณ - เริ่มต้นเพียง 299 บาท/ท่าน',
    starterSet: 'สั่งชุดเริ่มต้นด่วน',
    seasonal: 'เครื่องดื่ม',
    included: 'รวมในบุฟเฟต์',
    addon: 'สั่งเพิ่มพิเศษ',
    addToCart: 'เพิ่มลงตะกร้า',
    serviceAutomation: 'บริการและระบบอัตโนมัติ',
    needAssistance: 'ต้องการความช่วยเหลือ? กดปุ่มด้านล่าง',
    sosCall: 'เรียกพนักงาน / SOS',
    sosDesc: 'ความช่วยเหลือจากพนักงานสำหรับกรณีฉุกเฉินหรือคำขอพิเศษ',
    staffAlert: 'แจ้งพนักงานแล้ว กรุณารอสักครู่',
    refillSoup: 'เติมน้ำซุป',
    napkins: 'กระดาษทิชชู่',
    roomControls: 'แดชบอร์ดสมาชิก',
    personalize: 'สิทธิประโยชน์พิเศษสำหรับสมาชิกพรีเมียมของเรา',
    memberTier: 'สมาชิกทอง (Gold)',
    memberPoints: 'คะแนนสะสม',
    memberId: 'รหัสสมาชิก',
    redeemRewards: 'แลกของรางวัล',
    exclusiveOffers: 'ข้อเสนอพิเศษ',
    pointsToNextTier: 'อีก 250 คะแนนเพื่อเป็นระดับ Platinum',
    referFriend: 'แนะนำเพื่อน',
    referDesc: 'รับ 100 คะแนนสำหรับการแนะนำแต่ละครั้ง',
    birthdayGift: 'ของขวัญเดือนเกิด',
    birthdayDesc: 'ฟรี เซ็ตเนื้อวากิวพรีเมียม',
    foodAllergy: 'ข้อมูลการแพ้อาหาร',
    allergyNotice: 'โปรดแจ้งพนักงานหากคุณมีอาการแพ้อาหาร',
    commonAllergens: 'สารก่อภูมิแพ้ทั่วไป',
    peanuts: 'ถั่วลิสง',
    shellfish: 'อาหารทะเลเปลือกแข็ง',
    gluten: 'กลูเตน',
    dairy: 'ผลิตภัณฑ์จากนม',
    soy: 'ถั่วเหลือง',
    eggs: 'ไข่',
    allergyDisclaimer: 'แม้ว่าเราจะระมัดระวัง แต่อาจมีการปนเปื้อนข้ามได้',
    moodLighting: 'ไฟสร้างบรรยากาศ',
    climateControl: 'ควบคุมอุณหภูมิ',
    entertainment: 'ความบันเทิง',
    karaokeMode: 'โหมดคาราโอเกะ',
    karaokeDesc: 'ค้นหาเพลงและคิวเพลง',
    gamingMode: 'โหมดเกม',
    gamingDesc: 'เกม Nintendo Switch',
    billCheckout: 'บิลและชำระเงิน',
    totalAmount: 'ยอดรวมทั้งหมด',
    orderHistory: 'ประวัติการสั่งซื้อ',
    itemsOrdered: 'รายการที่สั่ง',
    noOrders: 'ยังไม่มีคำสั่งซื้อ',
    splitBill: 'เครื่องคิดเลขหารบิล',
    numPeople: 'จำนวนคน',
    eachPays: 'จ่ายคนละ',
    selfCheckout: 'ชำระเงินด้วยตัวเอง (QR Pay)',
    smartCart: 'ตะกร้าอัจฉริยะ',
    cartEmpty: 'ตะกร้าของคุณว่างเปล่า',
    roundTotal: 'ยอดรวมรอบนี้',
    foodWasteAlert: 'ป้องกันอาหารเหลือ: สั่งได้สูงสุด {max} รายการต่อรอบ',
    confirmOrder: 'ยืนยันการสั่งซื้อ',
    howWasMeal: 'อาหารเป็นอย่างไรบ้าง?',
    rateService: 'ให้คะแนนอาหารและบริการหุ่นยนต์',
    submitPay: 'ส่งและชำระเงิน',
    feedbackAlert: 'ขอบคุณสำหรับความคิดเห็น! สร้าง QR สำหรับชำระเงินแล้ว',
    tapToSummon: 'แตะเพื่อเรียก',
    all: 'ทั้งหมด',
    soup: 'ซุป',
    meat: 'เนื้อ',
    vegetable: 'ผัก',
    appetizer: 'ของว่าง',
    riceNoodle: 'ข้าว/เส้น',
    dessert: 'ของหวาน',
    veg: 'มัง',
    promotion: 'โปรโมชั่น',
    normal: 'ปกติ',
    party: 'ปาร์ตี้',
    romantic: 'โรแมนติก',
    chill: 'ชิลล์',
    dnd: 'ห้ามรบกวน',
    ready: 'พร้อมบริการ',
    maxItemsAlert: 'สั่งได้สูงสุด {max} รายการต่อรอบ!',
    people: 'คน',
    new: 'ใหม่'
  }
};

export default function App() {
  // Language State
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  // Navigation State
  const [activeTab, setActiveTab] = useState<'menu' | 'service' | 'experience' | 'payment'>('menu');
  
  // Menu & Cart State
  const [selectedCategory, setSelectedCategory] = useState<Category>('Soup');
  const [selectedType, setSelectedType] = useState<'All' | 'Included' | 'Add-on'>('All');
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
  
  // Timer State (90 minutes)
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  
  // UI State
  const [showCart, setShowCart] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [numPeople, setNumPeople] = useState(4);

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
    const currentTotal = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
    if (currentTotal >= MAX_ITEMS_PER_ROUND) {
      alert(t.maxItemsAlert.replace('{max}', MAX_ITEMS_PER_ROUND.toString()));
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
    const newOrders: OrderItem[] = Object.entries(cart).map(([id, quantity]: [string, number]) => {
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
    if (selectedType !== 'All' && item.type !== selectedType) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (dietaryFilter.vegetarian && !item.isVegetarian) return false;
    if (dietaryFilter.allergens.some(a => item.allergens.includes(a))) return false;
    return true;
  });

  const totalBill = (PROMOTION_BASE_PRICE * numPeople) + orderHistory.reduce((sum, item) => {
    if (item.type === 'Add-on') {
      const price = typeof item.price === 'number' ? item.price : 0;
      return sum + (price * item.quantity);
    }
    return sum;
  }, 0);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-24 border-r border-white/10 flex flex-col items-center py-8 gap-8 bg-[#0d0d0d]">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 overflow-hidden">
          <img 
            src="https://media.licdn.com/dms/image/v2/D560BAQFHiIhWsNEiMw/company-logo_200_200/company-logo_200_200/0/1697789649890/mk_restaurant_group_logo?e=2147483647&v=beta&t=QpbEuw4sGJs2WivLZCijw5_rODvndRoqiLgXrz10dKY" 
            alt="MK Restaurant Logo" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <button 
            onClick={() => setLanguage('en')}
            className={cn(
              "w-10 h-10 rounded-lg text-xs font-bold transition-all",
              language === 'en' ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('th')}
            className={cn(
              "w-10 h-10 rounded-lg text-xs font-bold transition-all",
              language === 'th' ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            TH
          </button>
        </div>
        
        <NavButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={<MenuIcon />} label={t.menu} />
        <NavButton active={activeTab === 'service'} onClick={() => setActiveTab('service')} icon={<Bell />} label={t.service} />
        <NavButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<User />} label={t.room} />
        <NavButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} icon={<CreditCard />} label={t.bill} />

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
                {Object.values(cart).reduce((a: number, b: number) => a + b, 0)}
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
            <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500">{t.onBelt}</span>
          </div>
          <div className="flex gap-8 whitespace-nowrap animate-[conveyor_120s_linear_infinite] px-4">
            {MENU_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <img src={item.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs font-medium">{language === 'en' ? item.name : item.nameTh}</span>
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
                  <h1 className="text-4xl font-bold tracking-tight">{t.digitalMenu}</h1>
                  <p className="text-white/50 mt-1">{t.selectIngredients}</p>
                </div>
                <button 
                  onClick={quickLaunchStarter}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  {t.starterSet}
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['All', 'Included', 'Add-on'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as any)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        selectedType === type ? "bg-rose-600 text-white" : "text-white/60 hover:text-white"
                      )}
                    >
                      {type === 'All' ? t.all : 
                       type === 'Included' ? t.included : 
                       t.addon}
                    </button>
                  ))}
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['Soup', 'Meat', 'Vegetable', 'Appetizer', 'Rice/Noodle', 'Dessert', 'Seasonal'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedCategory === cat ? "bg-white text-black" : "text-white/60 hover:text-white"
                      )}
                    >
                      {cat === 'Soup' ? t.soup : 
                       cat === 'Meat' ? t.meat : 
                       cat === 'Vegetable' ? t.vegetable : 
                       cat === 'Appetizer' ? t.appetizer : 
                       cat === 'Water' ? t.water :
                       cat === 'Rice/Noodle' ? t.riceNoodle :
                       cat === 'Dessert' ? t.dessert :
                       t.seasonal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="space-y-16">
                {selectedType === 'All' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
                    <button 
                      onClick={() => setSelectedType('Included')}
                      className="group relative overflow-hidden p-12 rounded-[48px] bg-[#151515] border border-white/5 hover:border-rose-500/50 transition-all text-left"
                    >
                      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ChefHat className="w-48 h-48" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-rose-500/10 transition-colors">
                          <ChefHat className="w-8 h-8 text-rose-500" />
                        </div>
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{t.included}</h2>
                        <p className="text-white/40 text-lg max-w-xs">{t.selectIngredients}</p>
                        <div className="mt-12 flex items-center gap-3 text-rose-500 font-bold uppercase tracking-widest text-sm">
                          {t.digitalMenu} <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>

                    <button 
                      onClick={() => setSelectedType('Add-on')}
                      className="group relative overflow-hidden p-12 rounded-[48px] bg-[#151515] border border-white/5 hover:border-rose-500/50 transition-all text-left"
                    >
                      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Plus className="w-48 h-48" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-rose-500/10 transition-colors">
                          <Plus className="w-8 h-8 text-rose-500" />
                        </div>
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 text-rose-500">{t.addon}</h2>
                        <p className="text-white/40 text-lg max-w-xs">{t.personalize}</p>
                        <div className="mt-12 flex items-center gap-3 text-rose-500 font-bold uppercase tracking-widest text-sm">
                          {t.digitalMenu} <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Included Section Display */}
                    {selectedType === 'Included' && (
                      <div className="space-y-12">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{t.included}</h2>
                            <div className="h-px w-32 bg-gradient-to-r from-white/20 to-transparent" />
                          </div>
                          <button 
                            onClick={() => setSelectedType('All')}
                            className="text-white/40 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" /> {t.all}
                          </button>
                        </div>
                        
                        {['Seasonal', 'Soup', 'Meat', 'Vegetable', 'Appetizer', 'Rice/Noodle', 'Dessert'].map(cat => {
                          const items = filteredMenu.filter(i => i.type === 'Included' && i.category === cat);
                          if (items.length === 0) return null;
                          return (
                            <div key={cat} className="space-y-6">
                              <h3 className="text-lg font-bold text-rose-500 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                {cat === 'Soup' ? t.soup : 
                                 cat === 'Meat' ? t.meat : 
                                 cat === 'Vegetable' ? t.vegetable : 
                                 cat === 'Appetizer' ? t.appetizer : 
                                 cat === 'Seasonal' ? t.seasonal :
                                 cat === 'Rice/Noodle' ? t.riceNoodle :
                                 t.dessert}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item) => (
                                  <MenuItemCard key={item.id} item={item} language={language} t={t} addToCart={addToCart} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add-on Section Display */}
                    {selectedType === 'Add-on' && (
                      <div className="space-y-12">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-rose-500">{t.addon}</h2>
                            <div className="h-px w-32 bg-gradient-to-r from-rose-500/20 to-transparent" />
                          </div>
                          <button 
                            onClick={() => setSelectedType('All')}
                            className="text-white/40 hover:text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" /> {t.all}
                          </button>
                        </div>
                        
                        {['Soup', 'Meat', 'Vegetable', 'Appetizer', 'Rice/Noodle', 'Dessert', 'Seasonal'].map(cat => {
                          const items = filteredMenu.filter(i => i.type === 'Add-on' && i.category === cat);
                          if (items.length === 0) return null;
                          return (
                            <div key={cat} className="space-y-6">
                              <h3 className="text-lg font-bold text-white/40 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-2 h-2 bg-white/20 rounded-full" />
                                {cat === 'Soup' ? t.soup : 
                                 cat === 'Meat' ? t.meat : 
                                 cat === 'Vegetable' ? t.vegetable : 
                                 cat === 'Appetizer' ? t.appetizer : 
                                 cat === 'Seasonal' ? t.seasonal :
                                 cat === 'Rice/Noodle' ? t.riceNoodle :
                                 t.dessert}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item) => (
                                  <MenuItemCard key={item.id} item={item} language={language} t={t} addToCart={addToCart} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'service' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold">{t.serviceAutomation}</h1>
                <p className="text-white/50 mt-2">{t.needAssistance}</p>
              </div>

              <div className="max-w-md mx-auto">
                <ServiceCard 
                  title={t.sosCall} 
                  desc={t.sosDesc} 
                  icon={<AlertCircle className="w-12 h-12 text-red-500" />}
                  onClick={() => alert(t.staffAlert)}
                  danger
                  tapToSummon={t.tapToSummon}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <QuickServiceButton icon={<Soup />} label={t.refillSoup} onClick={() => alert(t.refillSoup)} />
                <QuickServiceButton icon={<Wind />} label={t.napkins} onClick={() => alert(t.napkins)} />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold">{t.roomControls}</h1>
                  <p className="text-white/50 mt-2">{t.personalize}</p>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-500" />
                  <span className="text-rose-500 font-bold">{t.memberTier}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Member Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-rose-600 to-rose-900 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-rose-900/20">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ChefHat className="w-48 h-48" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white/60 text-sm uppercase tracking-widest mb-1">{t.memberId}</div>
                        <div className="text-2xl font-mono font-bold">SHABU-888-2024</div>
                      </div>
                      <QrCode className="w-12 h-12" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-sm uppercase tracking-widest mb-1">BHUDDHIDAV G.</div>
                        <div className="text-sm opacity-60">Valid thru 12/2026</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm uppercase tracking-widest mb-1">{t.memberPoints}</div>
                        <div className="text-4xl font-bold">1,250</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Points Progress */}
                <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-rose-500" /> {t.exclusiveOffers}
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-2xl">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span className="text-rose-500">80%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 w-[80%]" />
                        </div>
                        <div className="text-[10px] text-white/40 mt-2">{t.pointsToNextTier}</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all mt-6">
                    {t.redeemRewards}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#151515] p-6 rounded-3xl border border-white/5 flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <Gift className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.birthdayGift}</h4>
                    <p className="text-sm text-white/40">{t.birthdayDesc}</p>
                  </div>
                </div>
                <div className="bg-[#151515] p-6 rounded-3xl border border-white/5 flex items-center gap-6">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                    <IdCard className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.referFriend}</h4>
                    <p className="text-sm text-white/40">{t.referDesc}</p>
                  </div>
                </div>
              </div>

              {/* Food Allergy Section */}
              <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-amber-500" />
                  <div>
                    <h3 className="text-xl font-bold">{t.foodAllergy}</h3>
                    <p className="text-white/40 text-sm">{t.allergyNotice}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: t.peanuts, icon: '🥜' },
                    { label: t.shellfish, icon: '🦐' },
                    { label: t.gluten, icon: '🌾' },
                    { label: t.dairy, icon: '🥛' },
                    { label: t.soy, icon: '🫘' },
                    { label: t.eggs, icon: '🥚' }
                  ].map((allergen, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/5">
                      <span className="text-2xl">{allergen.icon}</span>
                      <span className="text-xs font-medium">{allergen.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-500/80 leading-relaxed">
                    {t.allergyDisclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">{t.billCheckout}</h1>
                <div className="text-right">
                  <div className="text-white/50 text-sm">{t.totalAmount}</div>
                  <div className="text-4xl font-mono font-bold text-rose-500">฿{totalBill.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order History */}
                <div className="bg-[#151515] rounded-3xl border border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold">{t.orderHistory}</h3>
                    <span className="text-xs text-white/40">{orderHistory.length} {t.itemsOrdered}</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
                    <div className="flex justify-between items-center text-rose-500 font-bold border-b border-white/5 pb-2">
                      <span>{t.promotion} ({numPeople} {t.people})</span>
                      <span>฿{(PROMOTION_BASE_PRICE * numPeople).toLocaleString()}</span>
                    </div>
                    {orderHistory.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-medium text-sm">
                              {language === 'en' ? item.name : item.nameTh}
                              {item.type === 'Add-on' && <span className="ml-2 text-[10px] bg-rose-500/20 text-rose-500 px-1 rounded">+{t.addon}</span>}
                            </div>
                            <div className="text-xs text-white/40">x{item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono text-sm">
                          {item.type === 'Add-on' ? (
                            typeof item.price === 'number' 
                              ? `฿${(item.price * item.quantity).toLocaleString()}`
                              : `฿${item.price}`
                          ) : 'Included'}
                        </div>
                      </div>
                    ))}
                    {orderHistory.length === 0 && (
                      <div className="text-center py-12 text-white/20">{t.noOrders}</div>
                    )}
                  </div>
                </div>

                {/* Checkout Actions */}
                <div className="space-y-6">
                  <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 space-y-6">
                    <h3 className="font-bold flex items-center gap-2"><Filter className="w-5 h-5" /> {t.splitBill}</h3>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                      <span className="text-white/60">{t.numPeople}</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setNumPeople(p => Math.max(1, p - 1))}
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold font-mono w-4 text-center">{numPeople}</span>
                        <button 
                          onClick={() => setNumPeople(p => p + 1)}
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                      <span className="font-bold text-rose-500">{t.eachPays}</span>
                      <span className="text-2xl font-mono font-bold">฿{(totalBill / numPeople).toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFeedback(true)}
                    className="w-full bg-white text-black py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95"
                  >
                    <CreditCard className="w-6 h-6" />
                    {t.selfCheckout}
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
                  <ShoppingCart className="w-6 h-6 text-rose-500" /> {t.smartCart}
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
                          <h4 className="font-bold">{language === 'en' ? item.name : item.nameTh}</h4>
                          <button onClick={() => removeFromCart(id)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="text-rose-500 font-mono text-sm mt-1">
                          {item.type === 'Add-on' ? `฿${item.price}` : 'Included'}
                        </div>
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
                    <p className="text-white/40">{t.cartEmpty}</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-[#111] border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">{t.roundTotal}</span>
                  <span className="text-2xl font-mono font-bold">฿{Object.entries(cart).reduce((sum: number, [id, q]: [string, number]) => {
                    const item = MENU_ITEMS.find(m => m.id === id)!;
                    if (item.type === 'Add-on') {
                      const price = typeof item.price === 'number' ? item.price : 0;
                      return sum + (price * q);
                    }
                    return sum;
                  }, 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-yellow-500 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                  <AlertCircle className="w-3 h-3" />
                  {t.foodWasteAlert.replace('{max}', MAX_ITEMS_PER_ROUND.toString())}
                </div>
                <button 
                  disabled={Object.keys(cart).length === 0}
                  onClick={placeOrder}
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 py-5 rounded-2xl font-bold text-lg shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                >
                  {t.confirmOrder}
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
                <h2 className="text-3xl font-bold">{t.howWasMeal}</h2>
                <p className="text-white/50 mt-2">{t.rateService}</p>
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
                    alert(t.feedbackAlert);
                    setShowFeedback(false);
                  }}
                  className="w-full bg-white text-black py-5 rounded-2xl font-bold text-lg"
                >
                  {t.submitPay}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItemCard({ item, language, t, addToCart }: { item: MenuItem; language: Language; t: any; addToCart: (item: MenuItem) => void; key?: string }) {
  return (
    <motion.div 
      layout
      className="group bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/50 transition-all"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img src={item.image} alt={language === 'en' ? item.name : item.nameTh} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {item.isVegetarian && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{t.veg}</span>
        )}
        {item.type === 'Add-on' && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">{t.addon}</span>
        )}
        {item.isNew && (
          <span className="absolute top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg shadow-yellow-500/20">
            {t.new}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{language === 'en' ? item.name : item.nameTh}</h3>
          <span className="font-mono text-rose-500 font-bold">
            {item.type === 'Add-on' ? `฿${item.price}` : 'Included'}
          </span>
        </div>
        <p className="text-white/40 text-xs line-clamp-2 mb-4 h-8">{language === 'en' ? item.description : item.descriptionTh}</p>
        <button 
          onClick={() => addToCart(item)}
          className="w-full bg-white/5 hover:bg-rose-600 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold group/btn"
        >
          <Plus className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
          {t.addToCart}
        </button>
      </div>
    </motion.div>
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

function ServiceCard({ title, desc, icon, onClick, primary, danger, tapToSummon }: { title: string; desc: string; icon: React.ReactNode; onClick: () => void; primary?: boolean; danger?: boolean; tapToSummon: string }) {
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
        {tapToSummon} <ChevronRight className="w-4 h-4" />
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
