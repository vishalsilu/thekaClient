import React, { useState, useRef, useEffect } from'react';
import { ChevronDown } from'lucide-react';

const CustomSort = ({ options, value, onChange, placeholder ="Sort By" }) => {
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef(null);

 useEffect(() => {
 const handleClickOutside = (e) => {
 if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
 setIsOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const selectedOption = options.find((opt) => opt.value === value);

 return (
 <div className="relative inline-block text-left" ref={dropdownRef}>
 <button
 type="button"
 onClick={() => setIsOpen(!isOpen)}
 className=" text-sm flex items-center justify-between px-1 gap-1 py-2 border max-w-[50vw] border-zinc-900 hover:border-black transition-all duration-200 focus:outline-none"
 >
 <h1 className=''>SORT:</h1> 
 <span className="text-sm tracking-tight uppercase line-clamp-1 tracking-tight">
 {selectedOption ? selectedOption.label : placeholder}
 </span>
 <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ?'rotate-180' :''}`} />
 </button>

 {isOpen && (
 <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl bg-surface shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5 overflow-hidden border border-zinc-100">
 <div className="py-2 max-h-[400px] overflow-y-auto">
 {options.map((option) => (
 <label
 key={option.value}
 className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-all ${
 value === option.value ?'bg-emerald-500' :'hover:bg-zinc-50/50'
 }`}
 >
 <div className="flex items-center gap-4">
 {/* High-Contrast Radio UI */}
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
 value === option.value ?'border-white' :'border-zinc-300'
 }`}>
 {value === option.value && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
 </div>
 
 <span className={`text-sm hover:text-emerald-500 hover:font-bold tracking-wide ${value === option.value ?' text-black' :'text-black'}`}>
 {option.label}
 </span>
 </div>

 <input
 type="radio"
 className="hidden"
 name="customSort"
 checked={value === option.value}
 onChange={() => {
 onChange(option.value);
 setIsOpen(false);
 }}
 />
 </label>
 ))}
 </div>
 </div>
 )}
 </div>
 );
};

export default CustomSort;