import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, deleteField, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyBK2Js7VrxHw8uI5aK-0-pyA4EBZ5LTezE",
    authDomain: "loggr-2e8d5.firebaseapp.com",
    projectId: "loggr-2e8d5",
    storageBucket: "loggr-2e8d5.firebasestorage.app",
    messagingSenderId: "299955645307",
    appId: "1:299955645307:web:bd90625826f253a5326bde"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const APP_ID = "loggr-prod"; 

// --- Constants ---
const COUNTRY_TIMEZONES = {
    "Philippines": "Asia/Manila",
    "USA (East)": "America/New_York",
    "USA (West)": "America/Los_Angeles",
    "UK": "Europe/London",
    "India": "Asia/Kolkata",
    "Australia (Sydney)": "Australia/Sydney",
    "Japan": "Asia/Tokyo",
    "Singapore": "Asia/Singapore",
    "Canada (Toronto)": "America/Toronto",
    "UAE": "Asia/Dubai"
};

// --- Icons ---
const IconWrapper = ({ children, size = 24, className = "", onClick, ...props }) => (
    <svg onClick={onClick} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

const BarChart2 = (props) => <IconWrapper {...props}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></IconWrapper>;
const Plus = (props) => <IconWrapper {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></IconWrapper>;
const Trash2 = (props) => <IconWrapper {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></IconWrapper>;
const GripVertical = (props) => <IconWrapper {...props}><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></IconWrapper>;
const LogOut = (props) => <IconWrapper {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></IconWrapper>;
const Calendar = (props) => <IconWrapper {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconWrapper>;
const CheckCircle = (props) => <IconWrapper {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></IconWrapper>;
const X = (props) => <IconWrapper {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></IconWrapper>;
const Copy = (props) => <IconWrapper {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></IconWrapper>;
const Lock = (props) => <IconWrapper {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></IconWrapper>;
const Eye = (props) => <IconWrapper {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></IconWrapper>;
const EyeOff = (props) => <IconWrapper {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></IconWrapper>;
const Clock = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></IconWrapper>;
const Globe = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></IconWrapper>;
const Search = (props) => <IconWrapper {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></IconWrapper>;
const ChevronLeft = (props) => <IconWrapper {...props}><polyline points="15 18 9 12 15 6"></polyline></IconWrapper>;
const ChevronRight = (props) => <IconWrapper {...props}><polyline points="9 18 15 12 9 6"></polyline></IconWrapper>;
const Download = (props) => <IconWrapper {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></IconWrapper>;
const Settings = (props) => <IconWrapper {...props}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></IconWrapper>;
const Briefcase = (props) => <IconWrapper {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></IconWrapper>;
const UserIcon = (props) => <IconWrapper {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></IconWrapper>;
const UserMinus = (props) => <IconWrapper {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></IconWrapper>;
const ChevronDown = (props) => <IconWrapper {...props}><polyline points="6 9 12 15 18 9"></polyline></IconWrapper>;
const Archive = (props) => <IconWrapper {...props}><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></IconWrapper>;
const RotateCcw = (props) => <IconWrapper {...props}><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></IconWrapper>;
const AlertTriangle = (props) => <IconWrapper {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></IconWrapper>;

// --- Styling Injection ---
const style = document.createElement('style');
style.innerHTML = `
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
  .toast-enter { transform: translateY(100%); opacity: 0; }
  .toast-enter-active { transform: translateY(0); opacity: 1; transition: all 300ms ease-out; }
  .toast-exit { transform: translateY(0); opacity: 1; }
  .toast-exit-active { transform: translateY(100%); opacity: 0; transition: all 300ms ease-in; }
`;
document.head.appendChild(style);

// --- Utils ---
const formatDate = (date) => date.toISOString().split('T')[0];
const getPreviousDate = (dateString) => { const d = new Date(dateString); d.setDate(d.getDate() - 1); return formatDate(d); };
const getDisplayDate = (dateString) => { const date = new Date(dateString); return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
const getTodayInTimezone = (timezone) => { const options = { timeZone: timezone || undefined, year: 'numeric', month: '2-digit', day: '2-digit' }; const formatter = new Intl.DateTimeFormat('en-CA', options); return formatter.format(new Date()); };
const getTodayFullInTimezone = (timezone) => { const options = { timeZone: timezone || undefined, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }; return new Date().toLocaleDateString('en-US', options); };
const getCurrentTimeInTimezone = (timezone) => { const options = { timeZone: timezone || undefined, hour: '2-digit', minute: '2-digit' }; return new Date().toLocaleTimeString('en-US', options); };
const generateTimeOptions = () => { const times = []; for(let i=0; i<24; i++) { const hour = i < 10 ? `0${i}` : i; times.push(`${hour}:00`); times.push(`${hour}:30`); } return times; };
const TIME_OPTIONS = generateTimeOptions();
const formatHours = (mins) => { const hours = parseFloat(mins) / 60; return Number(hours.toFixed(1)); };
const downloadCSV = (data, filename) => { const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n"); const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", filename); document.body.appendChild(link); link.click(); document.body.removeChild(link); };

// Add Minutes to Time String Helper
const addMinutesToTime = (timeStr, minsToAdd) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + parseInt(minsToAdd || 0));
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

// Calculate Schedule for SOD
const calculateSodSchedule = (items, startTime) => {
    let currentTime = startTime;
    return items.map(item => {
        const start = currentTime;
        const end = addMinutesToTime(currentTime, item.minutes || 0);
        currentTime = end;
        return { ...item, start, end };
    });
};

// --- Components ---
const Toast = ({ message, show, onClose }) => {
    React.useEffect(() => { if (show) { const timer = setTimeout(onClose, 2000); return () => clearTimeout(timer); } }, [show, onClose]);
    if (!show) return null;
    return <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 fade-in"><CheckCircle size={18} className="text-green-400" /><span className="font-medium text-sm">{message}</span></div>;
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
    const baseStyle = "w-full py-3 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
    const variants = { primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200", secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50", danger: "bg-red-50 text-red-600 hover:bg-red-100", ghost: "text-brand-600 hover:bg-brand-50", disabled: "bg-slate-200 text-slate-400 cursor-not-allowed" };
    return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${disabled ? variants.disabled : variants[variant]} ${className}`}>{children}</button>;
};

const Input = ({ label, value, onChange, placeholder, type = "text", error, list, className = "" }) => (
    <div className={`mb-4 ${className}`}>
        {label && <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} list={list} className={`w-full p-3 rounded-lg bg-white border ${error ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`} />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const Select = ({ label, value, onChange, options, error, placeholder = "Select an option" }) => (
    <div className="mb-4">
        {label && <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
        <select value={value} onChange={onChange} className={`w-full p-3 rounded-lg bg-white border ${error ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all`}>
            <option value="">{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

const SearchableSelect = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const wrapperRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredOptions = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="w-full p-2 bg-slate-800 text-white text-sm rounded-lg border-none flex justify-between items-center cursor-pointer h-[38px]" onClick={() => setIsOpen(!isOpen)}>
                <span className={`truncate ${!value ? "text-slate-400" : ""}`}>{value || placeholder}</span>
                <ChevronDown size={14} className="ml-2 text-slate-400 flex-shrink-0" />
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-slate-200">
                    <input type="text" className="w-full p-2 text-sm border-b border-slate-100 focus:outline-none text-slate-800" placeholder="Type to search..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus onClick={(e) => e.stopPropagation()} />
                    <div className="max-h-40 overflow-y-auto">
                        <div className="p-2 text-sm text-slate-600 hover:bg-brand-50 cursor-pointer" onClick={() => { onChange(""); setIsOpen(false); setSearch(""); }}>All Positions</div>
                        {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                            <div key={opt.value} className="p-2 text-sm text-slate-800 hover:bg-brand-50 cursor-pointer" onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(""); }}>{opt.label}</div>
                        )) : <div className="p-2 text-xs text-slate-400 italic">No matches found</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children, allowClose = true }) => {
    if (!isOpen) return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm fade-in"><div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"><div className="p-4 border-b border-slate-100 flex justify-between items-center bg-brand-50"><h3 className="font-bold text-slate-800">{title}</h3>{allowClose && <button onClick={onClose} className="p-1 hover:bg-brand-100 rounded-full text-slate-500"><X size={20} /></button>}</div><div className="p-4 overflow-y-auto">{children}</div></div></div>;
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isDangerous, confirmText = "Confirm", cancelText = "Cancel" }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-4">
            <p className="text-sm text-slate-600">{message}</p>
            <div className="flex gap-3">
                <Button onClick={onClose} variant="secondary">{cancelText}</Button>
                <Button onClick={onConfirm} variant={isDangerous ? "danger" : "primary"}>{confirmText}</Button>
            </div>
        </div>
    </Modal>
);

const AlertModal = ({ isOpen, onClose, title, message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-4">
            <p className="text-sm text-slate-600">{message}</p>
            <Button onClick={onClose}>OK</Button>
        </div>
    </Modal>
);

const CustomDatePicker = ({ selectedDate, onChange, onClose }) => {
    const [viewDate, setViewDate] = React.useState(new Date(selectedDate || new Date()));
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    const handleDayClick = (day) => { const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day); const offset = newDate.getTimezoneOffset(); const adjustedDate = new Date(newDate.getTime() - (offset*60*1000)); onChange(adjustedDate.toISOString().split('T')[0]); onClose(); };
    const currentYear = viewDate.getFullYear(); const currentMonth = viewDate.getMonth(); const days = daysInMonth(currentYear, currentMonth); const startDay = startDayOfMonth(currentYear, currentMonth);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return <div className="p-2"><div className="flex justify-between items-center mb-4"><button onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); setViewDate(d); }} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={20}/></button><span className="font-bold text-slate-700">{monthNames[currentMonth]} {currentYear}</span><button onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); setViewDate(d); }} className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={20}/></button></div><div className="grid grid-cols-7 gap-1 text-center mb-2">{weekDays.map(d => <span key={d} className="text-xs font-bold text-slate-400">{d}</span>)}</div><div className="grid grid-cols-7 gap-1">{Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}{Array.from({ length: days }).map((_, i) => { const day = i + 1; const isSelected = selectedDate.endsWith(`${(currentMonth+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`); return <button key={day} onClick={() => handleDayClick(day)} className={`h-8 w-8 rounded-full text-sm flex items-center justify-center hover:bg-brand-100 ${isSelected ? 'bg-brand-600 text-white' : 'text-slate-700'}`}>{day}</button> })}</div></div>;
};

const DateStrip = ({ selectedDate, onSelect, timezone }) => {
    const dates = []; const today = new Date(); for(let i = -2; i <= 4; i++) { const d = new Date(today); d.setDate(today.getDate() + i); dates.push(d); } const todayStr = getTodayInTimezone(timezone);
    return <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mb-4 -mx-4 px-4 bg-white border-b border-slate-100 sticky top-0 z-10">{dates.map((date, idx) => { const dateStr = formatDate(date); const isSelected = dateStr === selectedDate; const isToday = dateStr === todayStr; return <button key={idx} onClick={() => onSelect(dateStr)} className={`flex flex-col items-center justify-center min-w-[60px] p-2 rounded-xl transition-all border ${isSelected ? 'bg-brand-600 text-white border-brand-600 shadow-md' : 'bg-slate-50 text-slate-500 border-transparent'}`}><span className="text-xs font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span><span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{date.getDate()}</span>{isToday && <span className="text-[10px] mt-1 font-bold">Today</span>}</button> })}</div>;
};

// --- List Item (Swipe + DND) ---
const SwipeableListItem = ({ item, index, view, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => {
    const [offsetX, setOffsetX] = React.useState(0);
    const [isHandleActive, setIsHandleActive] = React.useState(false);
    const startX = React.useRef(null);

    // Unified Pointer Events (Mouse + Touch) for Swipe
    const handlePointerDown = (e) => {
        // If clicking the delete button (which is behind) or the handle, ignore swipe
        if (isHandleActive) return;
        
        startX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (startX.current === null) return;
        
        const currentX = e.clientX;
        const diff = currentX - startX.current;

        // Only allow swiping left (negative diff)
        if (diff < 0) {
            setOffsetX(Math.max(diff, -80)); // Limit to -80px (button width)
        }
    };

    const handlePointerUp = (e) => {
        if (startX.current === null) return;
        
        if (offsetX < -40) {
            setOffsetX(-80); // Snap open
        } else {
            setOffsetX(0); // Snap close
        }
        
        startX.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // Only allow drag if handle is active
    const handleDragStart = (e) => {
        if (!isHandleActive) {
            e.preventDefault();
            return;
        }
        onDragStart(e, index);
    };

    return (
        <div 
            className="relative overflow-hidden rounded-xl select-none"
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
        >
            {/* Delete Background */}
            <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center rounded-r-xl z-0">
                <button 
                    onClick={() => onDelete(view, item.id)} 
                    className="text-white w-full h-full flex items-center justify-center active:bg-red-600"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Foreground Card */}
            <div 
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 relative z-10 transition-transform duration-200"
                style={{ 
                    transform: `translateX(${offsetX}px)`, 
                    touchAction: 'pan-y' // Allow vertical scroll, handle horizontal in JS
                }}
                
                // Pointer Events for Swipe
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                
                // Click to Edit
                onClick={() => {
                    if (offsetX < 0) setOffsetX(0); // Close if open
                    else onEdit(item); // Edit if closed
                }}
                
                // Drag and Drop (Reorder)
                draggable={true} 
                onDragStart={handleDragStart}
            >
                {/* Drag Handle */}
                <div 
                    className="text-slate-300 cursor-grab active:cursor-grabbing p-1 -ml-2" 
                    onPointerDown={(e) => {
                        setIsHandleActive(true);
                        e.stopPropagation(); // Stop swipe from starting
                    }}
                    onPointerUp={() => setIsHandleActive(false)}
                    onMouseLeave={() => setIsHandleActive(false)}
                >
                    <GripVertical size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 pointer-events-none">
                     <div className="mt-1">
                        {view === 'sod' ? ( 
                            <div className="flex flex-col items-center min-w-[50px] bg-slate-50 rounded p-1">
                                <span className="text-[10px] font-bold text-slate-500">{item.start}</span>
                                <div className="w-px h-2 bg-slate-300 my-0.5"></div>
                                <span className="text-[10px] font-bold text-slate-500">{item.end}</span>
                            </div> 
                        ) : ( 
                            <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md inline-block">
                                {formatHours(item.minutes)}h
                            </div> 
                        )}
                    </div>
                </div>
                <div className="flex-[3] pointer-events-none">
                     <p className="text-slate-800 text-sm font-medium">{item.task}</p>
                </div>
            </div>
        </div>
    );
};

// --- Modals for Org Config & Profile ---

const AdminConfigModal = ({ isOpen, onClose }) => {
    const [orgStructure, setOrgStructure] = React.useState({});
    const [newDept, setNewDept] = React.useState("");
    const [newPos, setNewPos] = React.useState("");
    const [selectedDeptForPos, setSelectedDeptForPos] = React.useState("");

    React.useEffect(() => {
        if (!isOpen) return;
        const unsub = onSnapshot(doc(db, "artifacts", APP_ID, "public", "config"), (docSnap) => {
            if (docSnap.exists()) {
                setOrgStructure(docSnap.data().orgStructure || {});
            }
        });
        return () => unsub();
    }, [isOpen]);

    const handleAddDept = async () => {
        if (!newDept.trim()) return;
        const ref = doc(db, "artifacts", APP_ID, "public", "config");
        await setDoc(ref, { orgStructure: { [newDept]: [] } }, { merge: true });
        setNewDept("");
    };

    const handleAddPos = async () => {
        if (!newPos.trim() || !selectedDeptForPos) return;
        const ref = doc(db, "artifacts", APP_ID, "public", "config");
        await updateDoc(ref, { [`orgStructure.${selectedDeptForPos}`]: arrayUnion(newPos) });
        setNewPos("");
    };

    const handleDeleteDept = async (dept) => {
        const ref = doc(db, "artifacts", APP_ID, "public", "config");
        await updateDoc(ref, { [`orgStructure.${dept}`]: deleteField() });
        if (selectedDeptForPos === dept) setSelectedDeptForPos("");
    };

    const handleDeletePos = async (dept, pos) => {
        const ref = doc(db, "artifacts", APP_ID, "public", "config");
        await updateDoc(ref, { [`orgStructure.${dept}`]: arrayRemove(pos) });
    };

    const departments = Object.keys(orgStructure);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Organization">
            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Briefcase size={16}/> Departments</h4>
                    <div className="flex gap-2 mb-2">
                        <input type="text" value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="New Department Name" className="flex-1 p-2 border rounded-lg text-sm" />
                        <button onClick={handleAddDept} className="bg-brand-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {departments.map(d => (
                            <span key={d} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded flex items-center gap-1 border border-slate-200">
                                {d} 
                                <button onClick={() => handleDeleteDept(d)} className="text-slate-400 hover:text-red-500 ml-1"><X size={12}/></button>
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Globe size={16}/> Positions by Dept</h4>
                    <div className="space-y-2 mb-2">
                        <select 
                            value={selectedDeptForPos} 
                            onChange={e => setSelectedDeptForPos(e.target.value)} 
                            className="w-full p-2 border rounded-lg text-sm bg-slate-50"
                        >
                            <option value="">Select Department to Add Position</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newPos} 
                                onChange={e => setNewPos(e.target.value)} 
                                placeholder={selectedDeptForPos ? `New Position for ${selectedDeptForPos}` : "Select Department First"} 
                                disabled={!selectedDeptForPos}
                                className="flex-1 p-2 border rounded-lg text-sm disabled:bg-slate-100" 
                            />
                            <button onClick={handleAddPos} disabled={!selectedDeptForPos} className="bg-brand-600 text-white p-2 rounded-lg disabled:opacity-50"><Plus size={18}/></button>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-40 overflow-y-auto">
                        {selectedDeptForPos ? (
                            (orgStructure[selectedDeptForPos] || []).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {orgStructure[selectedDeptForPos].map(p => (
                                        <span key={p} className="text-xs bg-white text-slate-700 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
                                            {p} 
                                            <button onClick={() => handleDeletePos(selectedDeptForPos, p)} className="text-slate-400 hover:text-red-500 ml-1"><X size={12}/></button>
                                        </span>
                                    ))}
                                </div>
                            ) : <p className="text-xs text-slate-400 italic">No positions added yet.</p>
                        ) : <p className="text-xs text-slate-400 italic">Select a department above to manage positions.</p>}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const ProfileModal = ({ isOpen, onClose, user, userSettings, isMandatory = false }) => {
    const [name, setName] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [dept, setDept] = React.useState("");
    const [pos, setPos] = React.useState("");
    const [orgStructure, setOrgStructure] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!isOpen) return;
        setName(user.displayName || "");
        setCountry(userSettings?.country || "");
        setDept(userSettings?.department || "");
        setPos(userSettings?.position || "");
        
        getDoc(doc(db, "artifacts", APP_ID, "public", "config")).then(snap => {
            if (snap.exists()) setOrgStructure(snap.data().orgStructure || {});
        });
    }, [isOpen, user, userSettings]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const detectedTimezone = COUNTRY_TIMEZONES[country] || Intl.DateTimeFormat().resolvedOptions().timeZone;
            await updateProfile(auth.currentUser, { displayName: name });
            const userRef = doc(db, "artifacts", APP_ID, "users", user.uid, "settings", "profile");
            const employeeRef = doc(db, "artifacts", APP_ID, "public", "data", "employees", user.uid);
            const data = { country, timezone: detectedTimezone, department: dept, position: pos, userName: name, email: user.email, uid: user.uid };
            await setDoc(userRef, data, { merge: true });
            await setDoc(employeeRef, data, { merge: true }); // Sync to public directory
            onClose(); window.location.reload(); 
        } catch (err) {
            alert("Error saving profile: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const countryOptions = Object.keys(COUNTRY_TIMEZONES).map(c => ({ value: c, label: c }));
    const deptOptions = Object.keys(orgStructure).map(d => ({ value: d, label: d }));
    const availablePositions = dept ? (orgStructure[dept] || []) : [];
    const posOptions = availablePositions.map(p => ({ value: p, label: p }));
    const isValid = name && country && dept && pos;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isMandatory ? "Setup Profile" : "Edit Profile"} allowClose={!isMandatory}>
            <div className="space-y-4">
                {isMandatory && <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg border border-blue-200 mb-4">Welcome to Loggr! Please complete your profile to continue.</div>}
                <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                <Select label="Country" value={country} onChange={e => setCountry(e.target.value)} options={countryOptions} />
                <Select label="Department" value={dept} onChange={e => { setDept(e.target.value); setPos(""); }} options={deptOptions} placeholder="Select Department" />
                <Select label="Position" value={pos} onChange={e => setPos(e.target.value)} options={posOptions} placeholder={dept ? "Select Position" : "Select Department First"} />
                <Button onClick={handleSave} disabled={loading || (isMandatory && !isValid)}>{loading ? "Saving..." : "Save & Continue"}</Button>
            </div>
        </Modal>
    );
};

// --- Auth Components ---
const AuthScreen = ({ onLogin }) => {
    const [isLogin, setIsLogin] = React.useState(true);
    const [step, setStep] = React.useState(1);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [dept, setDept] = React.useState("");
    const [pos, setPos] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [email, setEmail] = React.useState(""); 
    const [workConfig, setWorkConfig] = React.useState({ enabled: true, start: "09:00", end: "17:00", lunchMinutes: "60" });
    const [showPass, setShowPass] = React.useState(false);
    const [showConfirmPass, setShowConfirmPass] = React.useState(false);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [orgStructure, setOrgStructure] = React.useState({});
    const [alertModal, setAlertModal] = React.useState({ isOpen: false, title: "", message: "" });

    React.useEffect(() => {
        getDoc(doc(db, "artifacts", APP_ID, "public", "config")).then(snap => {
            if (snap.exists()) setOrgStructure(snap.data().orgStructure || {});
        });
    }, []);

    const toggleMode = () => { setIsLogin(!isLogin); setError(""); setStep(1); setPassword(""); setConfirmPassword(""); };
    const handleLogin = async (e) => {
        e.preventDefault(); setError(""); setLoading(true);
        try { 
            let loginEmail = email; if (email.trim() === 'admin') loginEmail = 'admin@loggr.com'; else if (!email.includes('@')) throw new Error("Please enter full email address."); 
            await signInWithEmailAndPassword(auth, loginEmail, password); 
            // Disabled check is handled in App wrapper
        } catch (err) { setError(err.message.replace("Firebase:", "").trim()); setLoading(false); }
    };
    const handleForgotPassword = async () => {
        if (!email || !email.includes('@')) { setError("Please enter your email address to reset password."); return; }
        try { await sendPasswordResetEmail(auth, email); setAlertModal({ isOpen: true, title: "Reset Link Sent", message: `Password reset link sent to ${email}. Check your inbox.` }); } catch (err) { setError(err.message.replace("Firebase:", "").trim()); }
    };
    const handleNextStep = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !country || !password || !confirmPassword) { setError("All fields in Step 1 are required."); return; }
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
        setError(""); setStep(2);
    };
    const handleRegister = async () => {
        setError(""); setLoading(true);
        try {
            if (workConfig.enabled && (!workConfig.start || !workConfig.end || !workConfig.lunchMinutes)) throw new Error("Please fill out all Work Settings or uncheck 'Enabled'.");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const detectedTimezone = COUNTRY_TIMEZONES[country] || Intl.DateTimeFormat().resolvedOptions().timeZone;
            const displayName = `${firstName} ${lastName}`;
            await updateProfile(user, { displayName });
            const userData = { country, timezone: detectedTimezone, department: dept || "N/A", position: pos || "N/A", workConfig, userName: displayName, email: email, uid: user.uid, disabled: false };
            await setDoc(doc(db, "artifacts", APP_ID, "users", user.uid, "settings", "profile"), userData);
            await setDoc(doc(db, "artifacts", APP_ID, "public", "data", "employees", user.uid), userData); // Sync to directory
            setLoading(false); setShowSuccessModal(true);
        } catch (err) { setError(err.message.replace("Firebase:", "").trim()); setLoading(false); }
    };
    const countryOptions = Object.keys(COUNTRY_TIMEZONES).map(c => ({ value: c, label: c }));
    const deptOptions = Object.keys(orgStructure).map(d => ({ value: d, label: d }));
    const availablePositions = dept ? (orgStructure[dept] || []) : [];
    const posOptions = availablePositions.map(p => ({ value: p, label: p }));

    if (showSuccessModal) { return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900"><div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center fade-in"><div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} /></div><h2 className="text-2xl font-bold text-slate-800 mb-2">Account Created!</h2><p className="text-slate-500 mb-6">Here are your credentials.</p><div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-3 mb-6"><div><p className="text-xs font-bold text-slate-400 uppercase">Name</p><p className="font-medium text-slate-800">{firstName} {lastName}</p></div><div><p className="text-xs font-bold text-slate-400 uppercase">Email</p><p className="font-medium text-slate-800">{email}</p></div><div><p className="text-xs font-bold text-slate-400 uppercase">Password</p><p className="font-mono text-slate-800 bg-white border border-slate-200 p-1 rounded inline-block">{password}</p></div><div><p className="text-xs font-bold text-slate-400 uppercase">Country</p><p className="font-medium text-slate-800">{country}</p></div></div><Button onClick={() => window.location.reload()}>Go to Dashboard</Button></div></div>; }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center p-6"><div className="w-full max-w-md mx-auto"><div className="text-center mb-8"><div className="w-16 h-16 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-200"><BarChart2 className="text-white" size={32} /></div><h1 className="text-3xl font-bold text-slate-800">Loggr</h1><p className="text-slate-500">Daily productivity tracking</p></div>
            {isLogin && <form onSubmit={handleLogin} className="space-y-4"><Input label="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin" /><div className="relative"><Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="••••••••" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-slate-400">{showPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div><div className="text-right"><button type="button" onClick={handleForgotPassword} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot Password?</button></div>{error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}<Button disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button></form>}
            {!isLogin && step === 1 && <form onSubmit={handleNextStep} className="space-y-4 fade-in"><div className="grid grid-cols-2 gap-3"><Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" /><Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" /></div><Input label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" type="email" /><div className="grid grid-cols-2 gap-3"><Select label="Department" value={dept} onChange={e => { setDept(e.target.value); setPos(""); }} options={deptOptions} placeholder="Select (Optional)" /><Select label="Position" value={pos} onChange={e => setPos(e.target.value)} options={posOptions} placeholder={dept ? "Select (Optional)" : "Select Dept First"} /></div><Select label="Country" value={country} onChange={(e) => setCountry(e.target.value)} options={Object.keys(COUNTRY_TIMEZONES).map(c => ({ value: c, label: c }))} /><div className="relative"><Input label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="••••••••" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-slate-400">{showPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div><div className="relative"><Input label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showConfirmPass ? "text" : "password"} placeholder="••••••••" /><button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-9 text-slate-400">{showConfirmPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div>{error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}<Button>Next <span className="ml-2">→</span></Button></form>}
            <Modal isOpen={!isLogin && step === 2} onClose={() => setStep(1)} title="Work Settings"><div className="space-y-4"><p className="text-sm text-slate-500 mb-4">Set up time reporting (dependent on your country's timezone).</p><div className="flex items-center gap-2 mb-4"><input type="checkbox" id="na_check" checked={!workConfig.enabled} onChange={(e) => setWorkConfig({...workConfig, enabled: !e.target.checked})} className="w-5 h-5 text-brand-600 rounded"/><label htmlFor="na_check" className="text-sm font-medium text-slate-700">Not Applicable (Skip)</label></div>{workConfig.enabled && (<div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100 fade-in"><div className="grid grid-cols-2 gap-4"><Input label="Start Time" type="time" value={workConfig.start} onChange={(e) => setWorkConfig({...workConfig, start: e.target.value})} /><Input label="End Time" type="time" value={workConfig.end} onChange={(e) => setWorkConfig({...workConfig, end: e.target.value})} /></div><Input label="Lunch/Breaks (Minutes)" type="number" value={workConfig.lunchMinutes} onChange={(e) => setWorkConfig({...workConfig, lunchMinutes: e.target.value})} placeholder="60" /></div>)}{error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}<Button onClick={handleRegister} disabled={loading}>{loading ? 'Creating Account...' : 'Set Up Account'}</Button><button onClick={() => setStep(1)} className="w-full text-center text-slate-400 text-sm mt-2 hover:text-slate-600">Back</button></div></Modal>
            <div className="mt-6 text-center"><button onClick={toggleMode} className="text-brand-600 font-medium text-sm">{isLogin ? "New to Loggr? Create Account" : "Already have an account? Sign In"}</button></div>
            <AlertModal isOpen={alertModal.isOpen} onClose={() => setAlertModal({ ...alertModal, isOpen: false })} title={alertModal.title} message={alertModal.message} />
        </div></div>
    );
};

// --- User Dashboard ---
const UserDashboard = ({ user }) => {
    const [selectedDate, setSelectedDate] = React.useState(null); 
    const [view, setView] = React.useState('eod'); 
    const [reportData, setReportData] = React.useState({ sod: [], eod: [], sodConfig: { start: "09:00", end: "17:00" } }); 
    const [prevReportData, setPrevReportData] = React.useState({ sod: [], eod: [] });
    const [loading, setLoading] = React.useState(true);
    const [userSettings, setUserSettings] = React.useState(null);
    const [requiredHours, setRequiredHours] = React.useState(0);
    const [newTask, setNewTask] = React.useState(() => { const saved = localStorage.getItem(`loggr_draft_${user.uid}`); return saved ? JSON.parse(saved) : { start: '09:00', end: '10:00', task: '', minutes: '' }; });
    const [showModal, setShowModal] = React.useState(false);
    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const [modalContent, setModalContent] = React.useState({ title: '', body: '' });
    const [linkingTask, setLinkingTask] = React.useState(null);
    const [linkMinutes, setLinkMinutes] = React.useState("");
    const [showToast, setShowToast] = React.useState(false);
    const [isMandatoryProfile, setIsMandatoryProfile] = React.useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);
    const [editForm, setEditForm] = React.useState({ task: "", minutes: "" });
    const [draggedIndex, setDraggedIndex] = React.useState(null);
    const [sodConfig, setSodConfig] = React.useState({ start: "09:00", end: "17:00" });

    React.useEffect(() => {
        const loadSettings = async () => {
            const snap = await getDoc(doc(db, "artifacts", APP_ID, "users", user.uid, "settings", "profile"));
            if (snap.exists()) {
                const data = snap.data();
                setUserSettings(data);
                
                // Set default SOD config from profile
                if (data.workConfig?.enabled) {
                    setSodConfig({ start: data.workConfig.start, end: data.workConfig.end });
                }

                // CHECK IF PROFILE IS INCOMPLETE (Mandatory Setup)
                if (!data.position || !data.department || data.position === "N/A" || data.department === "N/A") {
                    setShowWelcomeModal(true);
                }

                const todayInZone = getTodayInTimezone(data.timezone);
                setSelectedDate(todayInZone);
                if (data.workConfig?.enabled) {
                    const { start, end, lunchMinutes } = data.workConfig;
                    const startD = new Date(`1970-01-01T${start}`);
                    const endD = new Date(`1970-01-01T${end}`);
                    const diffMs = endD - startD;
                    const lunchMs = (parseInt(lunchMinutes) || 0) * 60000;
                    const reqH = (diffMs - lunchMs) / 3600000;
                    setRequiredHours(reqH > 0 ? reqH : 0);
                }
            } else { setSelectedDate(formatDate(new Date())); }
        };
        loadSettings();
    }, [user]);

    React.useEffect(() => {
        if (!user || !selectedDate) return;
        const reportId = `${user.uid}_${selectedDate}`;
        const docRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", reportId);
        const prevDate = getPreviousDate(selectedDate);
        const prevReportId = `${user.uid}_${prevDate}`;
        const prevDocRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", prevReportId);
        const unsub1 = onSnapshot(docRef, (docSnap) => { 
            if (docSnap.exists()) {
                const data = docSnap.data();
                setReportData(data);
                if(data.sodConfig) setSodConfig(data.sodConfig);
                if (userSettings?.department && (!data.department || data.department === "N/A")) {
                    setDoc(docRef, { department: userSettings.department, position: userSettings.position, country: userSettings.country, timezone: userSettings.timezone }, { merge: true });
                }
            } 
            else setReportData({ sod: [], eod: [], date: selectedDate, uid: user.uid, userName: user.displayName }); 
        });
        const unsub2 = onSnapshot(prevDocRef, (docSnap) => { if (docSnap.exists()) setPrevReportData(docSnap.data()); else setPrevReportData({ sod: [], eod: [] }); setLoading(false); });
        return () => { unsub1(); unsub2(); };
    }, [user, selectedDate, userSettings]);

    React.useEffect(() => { localStorage.setItem(`loggr_draft_${user.uid}`, JSON.stringify(newTask)); }, [newTask, user]);

    // Enhanced save to include position/dept context
    const saveTask = async () => {
        if (!newTask.task) return;
        const reportId = `${user.uid}_${selectedDate}`;
        const docRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", reportId);
        let updatedReport = { ...reportData };
        updatedReport.uid = user.uid; updatedReport.userName = user.displayName; updatedReport.date = selectedDate; updatedReport.email = user.email;
        updatedReport.country = userSettings?.country || "Unknown"; updatedReport.timezone = userSettings?.timezone || "UTC";
        updatedReport.position = userSettings?.position || "N/A"; updatedReport.department = userSettings?.department || "N/A";
        
        // Save SOD Config
        if(view === 'sod') updatedReport.sodConfig = sodConfig;

        if (view === 'sod') {
            const sodItem = { id: Date.now(), task: newTask.task, minutes: newTask.minutes };
            updatedReport.sod = [...(updatedReport.sod || []), sodItem];
        } else {
            const eodItem = { id: Date.now(), task: newTask.task, minutes: newTask.minutes };
            updatedReport.eod = [...(updatedReport.eod || []), eodItem];
        }
        await setDoc(docRef, updatedReport, { merge: true });
        setNewTask(prev => ({ ...prev, task: '', minutes: '' })); 
    };

    const confirmLinkTask = async () => {
        if (!linkMinutes || !linkingTask) return;
        const reportId = `${user.uid}_${selectedDate}`;
        const docRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", reportId);
        let updatedReport = { ...reportData };
        updatedReport.country = userSettings?.country || "Unknown"; updatedReport.timezone = userSettings?.timezone || "UTC";
        updatedReport.position = userSettings?.position || "N/A"; updatedReport.department = userSettings?.department || "N/A";
        
        const eodItem = { id: Date.now(), task: linkingTask.task, minutes: linkMinutes };
        updatedReport.eod = [...(updatedReport.eod || []), eodItem];
        await setDoc(docRef, updatedReport, { merge: true });
        setLinkingTask(null); setLinkMinutes("");
    };

    const deleteTask = async (type, id) => {
        const reportId = `${user.uid}_${selectedDate}`;
        const docRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", reportId);
        let updatedReport = { ...reportData };
        if (type === 'sod') updatedReport.sod = updatedReport.sod.filter(item => item.id !== id);
        else updatedReport.eod = updatedReport.eod.filter(item => item.id !== id);
        await setDoc(docRef, updatedReport, { merge: true });
    };

    const confirmEdit = async () => {
        if (!editingItem || !editForm.task || !editForm.minutes) return;
        const reportId = `${user.uid}_${selectedDate}`;
        const docRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", reportId);
        let updatedReport = { ...reportData };
        if (view === 'sod') {
             updatedReport.sod = updatedReport.sod.map(item => 
                item.id === editingItem.id ? { ...item, task: editForm.task, minutes: editForm.minutes } : item
            );
        } else {
             updatedReport.eod = updatedReport.eod.map(item => 
                item.id === editingItem.id ? { ...item, task: editForm.task, minutes: editForm.minutes } : item
            );
        }
        await setDoc(docRef, updatedReport, { merge: true });
        setEditingItem(null);
    };

    const handleReorder = async (viewType, fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        const reportId = `${user.uid}_${selectedDate}`;
        const docRef = doc(db, "artifacts", APP_ID, "public", "data", "reports", reportId);
        let items = [...(viewType === 'sod' ? (reportData.sod || []) : (reportData.eod || []))];
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        const updateData = viewType === 'sod' ? { sod: items } : { eod: items };
        // Optimistically update local state to avoid jump
        setReportData(prev => ({ ...prev, ...updateData }));
        await setDoc(docRef, updateData, { merge: true });
    };

    const onDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Ghost element automatic by browser
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const onDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex !== null) {
            handleReorder(view, draggedIndex, dropIndex);
        }
        setDraggedIndex(null);
    };

    const handleExportCSV = () => {
        const rows = [["Date", "Type", "Time/Duration", "Task"]];
        const calculatedSod = calculateSodSchedule(reportData.sod || [], sodConfig.start);
        calculatedSod.forEach(i => rows.push([selectedDate, "SOD", `${i.start} - ${i.end}`, `"${i.task}"`]));
        (reportData.eod || []).forEach(i => rows.push([selectedDate, "EOD", `${i.minutes} mins`, `"${i.task}"`]));
        downloadCSV(rows, `Loggr_Report_${selectedDate}.csv`);
    };

    const generateReport = (type) => {
        let text = ""; const headerDate = getDisplayDate(selectedDate);
        if (type === 'SOD') { 
            text = `🚀 SOD Report - ${headerDate}\n\nTasks for Next Working Day:\n`; 
            if (!reportData.sod || reportData.sod.length === 0) text += "No tasks assigned yet."; 
            else {
                // Calculate Times just for display
                const itemsWithTimes = calculateSodSchedule(reportData.sod, sodConfig.start);
                itemsWithTimes.forEach(item => { text += `• ${item.start} - ${item.end}: ${item.task}\n`; }); 
            }
        } 
        else { text = `✅ EOD Report - ${headerDate}\n\nCompleted Today:\n`; if (!reportData.eod || reportData.eod.length === 0) text += "No completion logged."; else { let totalMins = 0; reportData.eod.forEach(item => { text += `• ${item.task} (${formatHours(item.minutes)}h)\n`; totalMins += parseFloat(item.minutes || 0); }); text += `\nTotal Hours: ${formatHours(totalMins)}h`; } }
        return text;
    };

    const handleEndDay = () => { setModalContent({ title: "End Day Report", body: generateReport('EOD') }); setShowModal(true); };
    const totalLoggedMinutes = (reportData.eod || []).reduce((acc, curr) => acc + parseFloat(curr.minutes || 0), 0);
    const totalLoggedHours = totalLoggedMinutes / 60;
    const isWorkHoursMet = !userSettings?.workConfig?.enabled || (totalLoggedHours >= requiredHours);
    const isTaskDone = (sodTaskName) => { return (reportData.eod || []).some(e => e.task.toLowerCase() === sodTaskName.toLowerCase()); };

    if (!selectedDate) return <div className="h-screen flex items-center justify-center text-slate-400">Loading profile...</div>;

    // Computed Lists
    const currentList = view === 'sod' 
        ? calculateSodSchedule(reportData.sod || [], sodConfig.start) // Compute times on the fly for render
        : (reportData.eod || []);

    // SOD Calculation for Progress Bar
    const totalSodMins = (reportData.sod || []).reduce((acc, curr) => acc + parseFloat(curr.minutes || 0), 0);
    const startD = new Date(`1970-01-01T${sodConfig.start}`);
    const endD = new Date(`1970-01-01T${sodConfig.end}`);
    const totalAvailableMins = (endD - startD) / 60000;
    const remainingMins = totalAvailableMins - totalSodMins;
    const remainingHours = (remainingMins / 60).toFixed(1);

    return (
        <div className="pb-44">
            <Toast message="Copied!" show={showToast} onClose={() => setShowToast(false)} />
            <div className="bg-white p-4 shadow-sm sticky top-0 z-20">
                <div className="flex justify-between items-center">
                    <div><h2 className="font-bold text-slate-800 text-lg">Hi, {user.displayName?.split(' ')[0]} 👋</h2><p className="text-xs text-slate-500 font-medium">{getTodayFullInTimezone(userSettings?.timezone)} • {getCurrentTimeInTimezone(userSettings?.timezone)}</p></div>
                    <div className="flex gap-2">
                        <button onClick={() => { setIsMandatoryProfile(false); setShowProfileModal(true); }} className="p-2 text-slate-400 hover:text-brand-600"><Settings size={20}/></button>
                        <button onClick={() => auth.signOut()} className="p-2 text-slate-400 hover:text-red-500"><LogOut size={20}/></button>
                    </div>
                </div>
            </div>
            <div className="p-4 max-w-lg mx-auto">
                <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} timezone={userSettings?.timezone} />
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6"><button onClick={() => setView('eod')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${view === 'eod' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}>EOD (Done)</button><button onClick={() => setView('sod')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${view === 'sod' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}>SOD (Plan)</button></div>
                <div className="space-y-6 fade-in">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Plus size={18} className="text-brand-500"/> {view === 'sod' ? 'Plan for Next Working Day' : 'Log Today\'s Activity'}</h3>
                        
                        {view === 'sod' && (
                            <div className="bg-slate-50 p-3 rounded-xl mb-3 border border-slate-100">
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Day Start</label>
                                        <input type="time" className="w-full bg-white p-1 rounded border border-slate-200 text-sm" value={sodConfig.start} onChange={e => { const n = {...sodConfig, start: e.target.value}; setSodConfig(n); setDoc(doc(db, "artifacts", APP_ID, "public", "data", "reports", `${user.uid}_${selectedDate}`), { sodConfig: n }, { merge: true }); }} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Day End</label>
                                        <input type="time" className="w-full bg-white p-1 rounded border border-slate-200 text-sm" value={sodConfig.end} onChange={e => { const n = {...sodConfig, end: e.target.value}; setSodConfig(n); setDoc(doc(db, "artifacts", APP_ID, "public", "data", "reports", `${user.uid}_${selectedDate}`), { sodConfig: n }, { merge: true }); }} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className={remainingMins < 0 ? "text-red-500 font-bold" : "text-slate-500"}>
                                        {remainingMins < 0 ? `${Math.abs(remainingHours)}h Overbooked` : `${remainingHours}h Remaining`}
                                    </span>
                                    <span className="text-slate-400">{formatHours(totalSodMins)}h Scheduled</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div className={`h-full ${remainingMins < 0 ? 'bg-red-500' : 'bg-brand-500'}`} style={{ width: `${Math.min((totalSodMins / totalAvailableMins) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        )}

                        <div className="mb-3"><label className="text-[10px] uppercase font-bold text-slate-400">Duration (Minutes)</label><input type="number" value={newTask.minutes} onChange={(e) => setNewTask({...newTask, minutes: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg text-sm" placeholder="e.g. 60" /></div>
                        
                        <div className="flex gap-2"><input type="text" placeholder={view === 'sod' ? "Task Name" : "Activity Description"} value={newTask.task} onChange={(e) => setNewTask({...newTask, task: e.target.value})} className="flex-1 p-2 bg-slate-50 rounded-lg text-sm border border-slate-200" onKeyDown={(e) => e.key === 'Enter' && saveTask()} /><button onClick={saveTask} disabled={!newTask.task || !newTask.minutes} className="bg-brand-600 text-white p-2 rounded-lg disabled:opacity-50"><Plus size={20}/></button></div>
                        {view === 'eod' && ( <div className="mt-4 border-t border-slate-100 pt-3"><p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Planned from Yesterday ({getPreviousDate(selectedDate)})</p>{prevReportData.sod && prevReportData.sod.length > 0 ? ( <div className="flex flex-wrap gap-2">{prevReportData.sod.map(item => { const done = isTaskDone(item.task); return ( <button key={item.id} onClick={() => !done && setLinkingTask(item)} disabled={done} className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1 ${done ? 'bg-green-100 text-green-700 border-green-200 cursor-default' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600'}`}>{done && <CheckCircle size={10}/>} {item.task}</button> ) })}</div> ) : ( <div className="text-xs text-slate-400 italic">First Day? No pending plans found from yesterday. You can log completed activities directly above.</div> )}</div> )}
                    </div>
                    <div className="space-y-3">
                        {loading ? <div className="text-center py-10 text-slate-400">Loading tasks...</div> : currentList.length === 0 ? ( <div className="text-center py-10"><div className="inline-block p-4 rounded-full bg-slate-100 mb-2">{view === 'sod' ? <Calendar className="text-slate-400"/> : <CheckCircle className="text-slate-400"/>}</div><p className="text-slate-500 text-sm">No tasks logged yet.</p></div> ) : ( 
                            currentList.map((item, idx) => ( 
                                <SwipeableListItem 
                                    key={item.id} 
                                    item={item} 
                                    index={idx}
                                    view={view}
                                    onEdit={(i) => { setEditingItem(i); setEditForm({ task: i.task, minutes: i.minutes }); }}
                                    onDelete={deleteTask}
                                    onDragStart={onDragStart}
                                    onDragOver={onDragOver}
                                    onDrop={onDrop}
                                /> 
                            )) 
                        )}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-30"><div className="max-w-lg mx-auto flex flex-col gap-2">{view === 'eod' && userSettings?.workConfig?.enabled && ( <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1"><div className={`h-full ${isWorkHoursMet ? 'bg-green-500' : 'bg-brand-500'}`} style={{ width: `${Math.min((totalLoggedHours / requiredHours) * 100, 100)}%` }}></div></div> )}{view === 'sod' ? ( <Button onClick={() => { setModalContent({ title: "Start Day Report", body: generateReport('SOD') }); setShowModal(true); }} disabled={(!reportData.sod || reportData.sod.length === 0)} className="shadow-lg shadow-brand-200">Start the Day</Button> ) : ( <Button onClick={handleEndDay} variant={isWorkHoursMet ? 'primary' : 'disabled'} disabled={!isWorkHoursMet} className="bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-300">{isWorkHoursMet ? "End the Day" : `Finish ${formatHours((requiredHours * 60) - totalLoggedMinutes)}h more`}</Button> )}<button onClick={handleExportCSV} className="text-xs text-brand-600 font-medium py-2 hover:underline">Export to CSV</button></div></div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalContent.title}><div className="bg-slate-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap mb-4 border border-slate-200">{modalContent.body}</div><Button onClick={() => { const textArea = document.createElement("textarea"); textArea.value = modalContent.body; document.body.appendChild(textArea); textArea.select(); try { document.execCommand('copy'); setShowToast(true); } catch (err) {} document.body.removeChild(textArea); setShowModal(false); }}><Copy size={18} /> Copy to Clipboard</Button></Modal>
            <Modal isOpen={!!linkingTask} onClose={() => setLinkingTask(null)} title="Complete Task"><div className="space-y-4"><p className="text-sm text-slate-600">How many minutes did you spend on <span className="font-bold">"{linkingTask?.task}"</span>?</p><Input type="number" value={linkMinutes} onChange={(e) => setLinkMinutes(e.target.value)} placeholder="e.g. 60" /><Button onClick={confirmLinkTask} disabled={!linkMinutes}>Log & Mark Done</Button></div></Modal>
            <Modal isOpen={showWelcomeModal} onClose={() => {}} title="Welcome!" allowClose={false}>
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2"><UserIcon size={32} /></div>
                    <p className="text-slate-600">Please complete your profile setup (Department & Position) to start using Loggr.</p>
                    <Button onClick={() => { setShowWelcomeModal(false); setIsMandatoryProfile(true); setShowProfileModal(true); }}>Proceed to Setup</Button>
                </div>
            </Modal>
            <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Task">
                <div className="space-y-4">
                    <Input label="Task Description" value={editForm.task} onChange={e => setEditForm({...editForm, task: e.target.value})} />
                    <Input label="Duration (Minutes)" type="number" value={editForm.minutes} onChange={e => setEditForm({...editForm, minutes: e.target.value})} />
                    <Button onClick={confirmEdit}>Save Changes</Button>
                </div>
            </Modal>
            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} userSettings={userSettings} isMandatory={isMandatoryProfile} />
        </div>
    );
};

// --- Admin Dashboard ---
const AdminDashboard = ({ user }) => {
    const [allEmployees, setAllEmployees] = React.useState([]);
    const [reports, setReports] = React.useState([]);
    const [filterDate, setFilterDate] = React.useState(formatDate(new Date()));
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filterDept, setFilterDept] = React.useState("");
    const [filterPos, setFilterPos] = React.useState("");
    const [filterStatus, setFilterStatus] = React.useState("Active");
    const [loading, setLoading] = React.useState(true);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [showConfigModal, setShowConfigModal] = React.useState(false);
    const [orgStructure, setOrgStructure] = React.useState({});
    const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, title: "", message: "", onConfirm: null, isDangerous: false });

    React.useEffect(() => {
        const unsubConfig = onSnapshot(doc(db, "artifacts", APP_ID, "public", "config"), (docSnap) => { if (docSnap.exists()) setOrgStructure(docSnap.data().orgStructure || {}); });
        const unsubEmployees = onSnapshot(collection(db, "artifacts", APP_ID, "public", "data", "employees"), (snapshot) => { const list = []; snapshot.forEach(doc => list.push(doc.data())); setAllEmployees(list); });
        const q = query(collection(db, "artifacts", APP_ID, "public", "data", "reports"), where("date", "==", filterDate));
        const unsubReports = onSnapshot(q, (snapshot) => { const data = []; snapshot.forEach(doc => data.push(doc.data())); setReports(data); setLoading(false); });
        return () => { unsubConfig(); unsubEmployees(); unsubReports(); };
    }, [filterDate]);

    const toggleDisable = (emp) => {
        setConfirmModal({
            isOpen: true,
            title: emp.disabled ? "Enable Account" : "Suspend Account",
            message: emp.disabled ? "Enable this account? User will be able to log in again." : "Disable this account? User will not be able to log in.",
            isDangerous: !emp.disabled,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false })); // Close immediately
                const updates = { disabled: !emp.disabled };
                await setDoc(doc(db, "artifacts", APP_ID, "public", "data", "employees", emp.uid), updates, { merge: true });
                await setDoc(doc(db, "artifacts", APP_ID, "users", emp.uid, "settings", "profile"), updates, { merge: true });
            }
        });
    };

    const toggleArchive = (emp) => {
        setConfirmModal({
            isOpen: true,
            title: emp.archived ? "Restore Account" : "Archive Account",
            message: emp.archived ? "Restore this account from archive? User will appear in active lists." : "Archive this account? User will be hidden from main lists and disabled.",
            isDangerous: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false })); // Close immediately
                const updates = { 
                    archived: !emp.archived, 
                    disabled: !emp.archived ? true : false // If archiving, disable. If restoring, enable (active).
                }; 
                await setDoc(doc(db, "artifacts", APP_ID, "public", "data", "employees", emp.uid), updates, { merge: true });
                await setDoc(doc(db, "artifacts", APP_ID, "users", emp.uid, "settings", "profile"), updates, { merge: true });
            }
        });
    };

    const deleteEmployee = (emp) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Permanently",
            message: "PERMANENTLY DELETE user? This action cannot be undone and will remove all their profile data.",
            isDangerous: true,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isOpen: false })); // Close immediately
                await deleteDoc(doc(db, "artifacts", APP_ID, "public", "data", "employees", emp.uid));
                await deleteDoc(doc(db, "artifacts", APP_ID, "users", emp.uid, "settings", "profile"));
            }
        });
    };

    const filteredEmployees = allEmployees.filter(emp => {
        let statusMatch = false;
        if (filterStatus === "Active") statusMatch = !emp.disabled && !emp.archived;
        else if (filterStatus === "Disabled") statusMatch = emp.disabled && !emp.archived;
        else if (filterStatus === "Archived") statusMatch = emp.archived;
        const matchesSearch = emp.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept ? emp.department === filterDept : true;
        const matchesPos = filterPos ? emp.position === filterPos : true;
        return matchesSearch && matchesDept && matchesPos && statusMatch;
    }).sort((a, b) => {
        const deptCompare = (a.department || "").localeCompare(b.department || "");
        if (deptCompare !== 0) return deptCompare;
        const posCompare = (a.position || "").localeCompare(b.position || "");
        if (posCompare !== 0) return posCompare;
        return (a.userName || "").localeCompare(b.userName || "");
    });
    
    const handleExportOne = (report) => {
        if (!report) return;
        const rows = [["Date", "User", "Email", "Department", "Position", "Type", "Time/Duration", "Task"]];
        (report.sod || []).forEach(i => rows.push([filterDate, report.userName, report.email, report.department, report.position, "SOD", `${i.start} - ${i.end}`, `"${i.task}"`]));
        (report.eod || []).forEach(i => rows.push([filterDate, report.userName, report.email, report.department, report.position, "EOD", `${formatHours(i.minutes)}h`, `"${i.task}"`]));
        downloadCSV(rows, `Loggr_${report.userName}_${filterDate}.csv`);
    };

    const handleExportAll = () => {
        const rows = [["Date", "User", "Email", "Country", "Department", "Position", "Type", "Time/Duration", "Task"]];
        reports.forEach(report => {
            (report.sod || []).forEach(i => rows.push([filterDate, report.userName, report.email, report.country, report.department, report.position, "SOD", `${i.start} - ${i.end}`, `"${i.task}"`]));
            (report.eod || []).forEach(i => rows.push([filterDate, report.userName, report.email, report.country, report.department, report.position, "EOD", `${formatHours(i.minutes)}h`, `"${i.task}"`]));
        });
        downloadCSV(rows, `Loggr_All_Reports_${filterDate}.csv`);
    };

    const deptOptions = Object.keys(orgStructure).map(d => ({ value: d, label: d }));
    const availablePos = filterDept ? (orgStructure[filterDept] || []) : Array.from(new Set(Object.values(orgStructure).flat()));
    const posOptions = availablePos.map(p => ({ value: p, label: p }));

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-slate-900 text-white p-6 sticky top-0 z-20 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold flex items-center gap-2"><Lock size={20}/> Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 px-3 rounded border-none focus:ring-0"><option value="Active">Active Users</option><option value="Disabled">Suspended</option><option value="Archived">Archived</option></select>
                        <button onClick={() => setShowConfigModal(true)} className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 px-3 rounded flex items-center gap-1"><Settings size={14}/> <span className="hidden sm:inline">Manage Org</span></button>
                        <button onClick={handleExportAll} className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2 px-3 rounded flex items-center gap-1"><Download size={14}/> <span className="hidden sm:inline">Export Reports</span></button>
                        <button onClick={() => auth.signOut()} className="text-slate-400 hover:text-white"><LogOut size={20}/></button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors md:col-span-1" onClick={() => setShowDatePicker(true)}><Calendar size={16} className="text-slate-400"/><span className="text-white text-sm font-medium">{getDisplayDate(filterDate)}, {filterDate.split('-')[0]}</span></div>
                    <div className="md:col-span-1"><select value={filterDept} onChange={e => { setFilterDept(e.target.value); setFilterPos(""); }} className="w-full bg-slate-800 text-white text-sm p-2 rounded-lg border-none focus:ring-0"><option value="">All Departments</option>{deptOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                    <div className="md:col-span-1 relative"><SearchableSelect value={filterPos} onChange={setFilterPos} options={posOptions} placeholder="All Positions" /></div>
                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg md:col-span-1"><Search size={16} className="text-slate-400"/><input type="text" placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent text-white w-full focus:outline-none text-sm" /></div>
                </div>
                <div className="flex gap-4 mt-4 text-xs text-slate-400 font-mono"><span>Employees: {filteredEmployees.length}</span></div>
            </div>

            <Modal isOpen={showDatePicker} onClose={() => setShowDatePicker(false)} title="Select Date"><CustomDatePicker selectedDate={filterDate} onChange={setFilterDate} onClose={() => setShowDatePicker(false)} /></Modal>
            <AdminConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
            <ConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmModal.onConfirm} title={confirmModal.title} message={confirmModal.message} isDangerous={confirmModal.isDangerous} />

            <div className="p-4 max-w-4xl mx-auto space-y-4">
                {loading ? <div className="text-center p-10">Loading...</div> : filteredEmployees.length === 0 ? ( <div className="text-center p-10 text-slate-500">No employees found in this view.</div> ) : (
                    filteredEmployees.map((emp) => {
                        const report = reports.find(r => r.uid === emp.uid);
                        const hasActivity = report && ((report.sod && report.sod.length > 0) || (report.eod && report.eod.length > 0));
                        const userTotalMins = report ? (report.eod || []).reduce((sum, item) => sum + parseFloat(item.minutes || 0), 0) : 0;
                        const isSuspended = emp.disabled; const isArchived = emp.archived;

                        return (
                            <div key={emp.uid} className={`bg-white rounded-xl shadow-sm border overflow-hidden fade-in ${isSuspended ? 'border-red-200 bg-red-50/50' : isArchived ? 'border-slate-200 bg-slate-100 opacity-75' : 'border-slate-200'}`}>
                                <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                                    <div className={`flex items-center gap-3 ${isSuspended ? 'opacity-50' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{emp.userName?.substring(0,2).toUpperCase()}</div>
                                        <div><p className="font-bold text-sm text-slate-800 flex items-center gap-2">{emp.userName} {isSuspended && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Suspended</span>} {isArchived && <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">Archived</span>}</p><p className="text-xs text-slate-400">{emp.position || "No Pos"} • {emp.department || "No Dept"}</p></div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2">
                                            {hasActivity && <button onClick={() => handleExportOne(report)} className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1 rounded flex items-center gap-1"><Download size={10}/> CSV</button>}
                                            {filterStatus === "Active" && (<><button onClick={() => toggleDisable(emp)} title="Suspend" className="text-xs p-1.5 rounded border bg-white border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"><UserMinus size={14}/></button><button onClick={() => toggleArchive(emp)} title="Archive" className="text-xs p-1.5 rounded border bg-white border-slate-200 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200"><Archive size={14}/></button></>)}
                                            {filterStatus === "Disabled" && (<><button onClick={() => toggleDisable(emp)} title="Enable" className="text-xs p-1.5 rounded border bg-white border-slate-200 hover:bg-green-50 hover:text-green-500 hover:border-green-200"><CheckCircle size={14}/></button><button onClick={() => toggleArchive(emp)} title="Archive" className="text-xs p-1.5 rounded border bg-white border-slate-200 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200"><Archive size={14}/></button></>)}
                                            {filterStatus === "Archived" && (<><button onClick={() => toggleArchive(emp)} title="Restore" className="text-xs p-1.5 rounded border bg-white border-slate-200 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200"><RotateCcw size={14}/></button><button onClick={() => deleteEmployee(emp)} title="Delete Permanently" className="text-xs p-1.5 rounded border bg-white border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"><Trash2 size={14}/></button></>)}
                                        </div>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Globe size={10}/> {emp.country || "Unknown"}</p>
                                    </div>
                                </div>
                                {hasActivity ? ( <div className="p-4 grid md:grid-cols-2 gap-4"><div className="bg-green-50/30 p-3 rounded-lg border border-green-50"><div className="flex justify-between items-center mb-2"><h4 className="text-xs font-bold text-green-600 uppercase tracking-wide">EOD Results</h4><span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{formatHours(userTotalMins)}h Total</span></div>{(!report.eod || report.eod.length === 0) ? <p className="text-xs text-slate-400 italic">Not submitted</p> : ( <ul className="space-y-2">{report.eod.map((item, i) => (<li key={i} className="text-xs text-slate-700 flex justify-between gap-4"><span>{item.task}</span><span className="font-bold text-green-700 whitespace-nowrap">{formatHours(item.minutes)}h</span></li>))}</ul> )}</div><div className="bg-blue-50/30 p-3 rounded-lg border border-blue-50"><h4 className="text-xs font-bold text-brand-600 mb-2 uppercase tracking-wide">SOD Plan (Next Working Day)</h4>{(!report.sod || report.sod.length === 0) ? <p className="text-xs text-slate-400 italic">Not submitted</p> : ( <ul className="space-y-2">{report.sod.map((item, i) => (<li key={i} className="text-xs text-slate-700 flex gap-2"><span className="font-mono text-slate-400 whitespace-nowrap min-w-[60px]">{item.start}</span><span>{item.task}</span></li>))}</ul> )}</div></div> ) : ( <div className="p-6 text-center"><div className="inline-block p-3 bg-slate-50 rounded-full mb-2"><Calendar size={20} className="text-slate-300"/></div><p className="text-sm text-slate-400 font-medium">No Activities Yet</p><p className="text-xs text-slate-300">Employee has not submitted any reports for this date.</p></div> )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

const App = () => {
    const [user, setUser] = React.useState(null); const [init, setInit] = React.useState(false); const [authAlert, setAuthAlert] = React.useState({ isOpen: false, title: "", message: "" });
    React.useEffect(() => { const unsubscribe = onAuthStateChanged(auth, async (u) => { try { if (u) { try { const userDoc = await getDoc(doc(db, "artifacts", APP_ID, "public", "data", "employees", u.uid)); if (userDoc.exists() && (userDoc.data().disabled || userDoc.data().archived)) { await signOut(auth); setAuthAlert({ isOpen: true, title: "Account Suspended", message: "Your account has been disabled or archived. Please contact the administrator." }); setUser(null); } else { setUser(u); } } catch (dbError) { console.error("Error checking employee status:", dbError); setUser(u); } } else { setUser(null); } } catch (err) { console.error("Auth State Error:", err); setUser(null); } finally { setInit(true); } }); return () => unsubscribe(); }, []);
    if (!init) return <div className="h-screen flex items-center justify-center text-brand-600">Loading Loggr...</div>;
    if (!user && !init) return <div className="h-screen flex items-center justify-center text-brand-600">Initializing...</div>;
    if (!user) return <><AuthScreen onLogin={setUser} /><AlertModal isOpen={authAlert.isOpen} onClose={() => setAuthAlert({ ...authAlert, isOpen: false })} title={authAlert.title} message={authAlert.message} /></>;
    if (user.email === 'admin@loggr.com') { return <AdminDashboard user={user} />; }
    return <UserDashboard user={user} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
