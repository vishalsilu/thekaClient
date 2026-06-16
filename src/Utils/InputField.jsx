export const InputField = ({ label, name, required, placeholder, value, onChange }) => (
 <div className="flex flex-col gap-1.5">
 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
 {label} {required && <span className="text-red-500">*</span>}
 </label>
 <input
 required={required}
 name={name}
 placeholder={placeholder || label}
 value={value}
 onChange={onChange}
 className="w-full border border-slate-200 bg-slate-50/50 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
 />
 </div>
);