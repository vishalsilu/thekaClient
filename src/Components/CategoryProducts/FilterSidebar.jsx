import React from'react';

// Notice: Removed the old static getFiltersByWearType import cleaner layout
const FilterSidebar = ({ filterOptions, activeFilters, onFilterChange, onClear }) => {

 return (
 <div className="h-full flex flex-col">
 <div className="mb-6 flex items-center justify-between">
 <h3 className="text-sm font-black uppercase tracking-tighter">Filters</h3>
 <button 
 onClick={onClear}
 className="text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
 >
 Clear All
 </button>
 </div>

 <div className="space-y-8">
 {/* Directly read our live database mapped choices state object */}
 {Object.entries(filterOptions || {}).map(([group, options]) => {
 // If the database returns no values for a filter category (e.g. pattern is empty), skip rendering it completely
 if (!options || options.length === 0) return null;

 return (
 <div key={group} className="pb-2 border-b border-zinc-50 last:border-0">
 <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em]">
 {group}
 </h4>
 <div className="space-y-3">
 {options.map((option) => (
 <label key={option} className="flex items-center gap-3 text-xs font-medium cursor-pointer group/item">
 <div className="relative flex items-center">
 <input 
 type="checkbox" 
 checked={activeFilters[group]?.includes(option) || false}
 onChange={() => onFilterChange(group, option)}
 className="peer h-4 w-4 appearance-none rounded border border-zinc-300 checked:bg-emerald-500 checked:border-emerald-500 transition-all" 
 />
 <svg className="absolute w-3 h-3 opacity-0 peer-checked:opacity-100 pointer-events-none ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <span className=" transition-colors">{option}</span>
 </label>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
};

export default FilterSidebar;