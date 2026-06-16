import React from'react';
import { Plus, Edit3, Trash2, MapPin } from'lucide-react';
import { FaCheck } from'react-icons/fa';

const AddressBook = ({ addresses, onAdd, onEdit, onDelete }) => {
 return (
 <div className="space-y-8">
 <div className="flex justify-between items-center">
 <h2 className="text-xl font-bold">Saved Profiles</h2>
 <button disabled={addresses?.length >=5} onClick={onAdd} className={`${addresses?.length >=5 ?"bg-slate-400" :"bg-slate-900"} text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2`}>
 {addresses?.length < 5 && <Plus size={16} /> } {addresses?.length >=5 ?"Added Maximum Addresses" :"Add New Address"}
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {addresses?.map((addr, idx) => (
 <div key={idx} className="p-10 border border-slate-800 rounded-[40px] relative group hover:border-slate-300 transition-all shadow-sm">
 <div className="flex justify-between mb-8">
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl border">{addr?.type}</span>
 {addr.isDefault && <FaCheck className="text-blue-500 text-xs" />}
 </div>
 <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
 <button onClick={() => onEdit(idx)} className="text-slate-300 hover:text-blue-500"><Edit3 size={18} /></button>
 <button onClick={() => onDelete(addr._id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
 </div>
 </div>
 <p className="font-bold text-lg">{addr.firstName} {addr.lastName}</p>
 <p className="text-sm text-slate-500 leading-relaxed">{addr.street}, {addr.city}</p>
 <p className="text-sm text-slate-500">{addr.state} - {addr.zip}</p>
 </div>
 ))}
 </div>
 </div>
 );
};

export default AddressBook;