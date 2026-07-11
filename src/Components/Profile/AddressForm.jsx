import { useState, useEffect } from"react";
import { useDispatch, useSelector } from"react-redux";
import { addAddress, updateAddress } from"../../Redux/controllers/crudUser";

const AddressForm = ({ initialData, onAddressSaved, onSubmit, onClose, saveToProfile = true }) => {
 const dispatch = useDispatch();
 const { user } = useSelector((state) => state.auth);
 const [loading, setLoading] = useState(false);

 const isEditMode = !!initialData?._id;

 const [formData, setFormData] = useState({
 type:'Home',
 firstName:'',
 lastName:'',
 street:'',
 apartment:'',
 address:'',
 city:'',
 state:'',
 zip:'',
 country:'India',
 mobile:'',
 isDefault: false
 });

useEffect(() => {
  if (initialData) {
    setFormData((prev) => ({
      ...prev, // Keep your default empty strings
      ...initialData, // Override with existing data
      // Explicitly protect against null/undefined from the database:
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      street: initialData.street || '',
      apartment: initialData.apartment || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zip: initialData.zip || '',
      country: initialData.country || 'India',
      mobile: initialData.mobile || '',
      isDefault: initialData.isDefault || false
    }));
  }
}, [initialData]);

 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;
 setFormData({
 ...formData,
 [name]: type ==='checkbox' ? checked : value
 });
 };

 const handleTypeSelect = (type) => {
 setFormData({ ...formData, type });
 };

 const handleSaveToProfile = async () => {
 if (!formData.firstName || !formData.address || !formData.mobile || !formData.zip) {
 alert("Please fill in all required fields marked with *");
 return;
 }

 setLoading(true);
 try {
 if (!saveToProfile) {
 if (onSubmit) onSubmit(formData);
 else if (onAddressSaved) onAddressSaved(formData);
 if (onClose) onClose();
 return;
 }

 const payload = { ...formData, userId: user?.id || user?._id };
 let result = isEditMode 
 ? await dispatch(updateAddress(payload)).unwrap()
 : await dispatch(addAddress(payload)).unwrap();

 if (onAddressSaved) onAddressSaved(result._id);
 if (onClose) onClose();
 } catch (err) {
 alert(err ||"Error saving address");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4  backdrop-blur-sm">
 <div className=" p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100 bg-white">
 <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in zoom-in duration-300 ">
 
 {/* Header */}
 <div className="md:col-span-2 flex justify-between items-center mb-2">
 <h2 className="text-2xl font-black uppercase tracking-tighter italic">
 {isEditMode ?'Edit Address' :'New Address'}
 </h2>
 <button onClick={() => onClose && onClose()} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold text-xl">
 ✕
 </button>
 </div>

 {/* Address Type Selector */}
 <div className="md:col-span-2 space-y-3">
 <label className="text-[10px] font-bold uppercase tracking-[0.2em]">Select Label</label>
 <div className="flex gap-3">
 {['Home','Work','Other'].map((t) => (
 <button
 key={t}
 type="button"
 onClick={() => handleTypeSelect(t)}
 className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border-2 ${
 formData.type === t 
 ?'bg-black border-black text-white shadow-lg translate-y-[-2px]' 
 :'bg-white border-gray-100 text-black hover:border-gray-300'
 }`}
 >
 {t}
 </button>
 ))}
 </div>
 </div>

 {/* Row 1: Names */}
 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">First Name *</label>
 <input name="firstName" value={formData.firstName} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Last Name *</label>
 <input name="lastName" value={formData.lastName} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 {/* Row 2: Street */}
 <div className="md:col-span-2 space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Street / Area *</label>
 <input name="street" value={formData.street} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 {/* Row 3: Landmark */}
 <div className="md:col-span-2 space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Full Address / Landmark *</label>
 <input name="address" value={formData.address} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 {/* Row 4: Apartment & City */}
 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Apartment / Suite</label>
 <input name="apartment" value={formData.apartment} onChange={handleChange} type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">City *</label>
 <input name="city" value={formData.city} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 {/* Row 5: State & Zip */}
 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">State *</label>
 <input name="state" value={formData.state} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Zip Code *</label>
 <input name="zip" value={formData.zip} onChange={handleChange} required type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 {/* Row 6: Mobile & Country */}
 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Mobile Number *</label>
 <input  name="mobile" maxLength={10} value={formData.mobile} onChange={(e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    handleChange(e);
  }} required type='tel' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 <div className="space-y-1">
 <label className="text-[10px] font-bold uppercase tracking-widest">Country</label>
 <input name="country" value={formData.country} onChange={handleChange} type='text' className="w-full bg-surface border border-gray-200 p-3 text-sm outline-none focus:border-black rounded-lg" />
 </div>

 {/* Default Toggle */}
 <div className="md:col-span-2 flex items-center justify-between p-4 bg-surface rounded-2xl mt-2 border border-slate-100">
 <div>
 <p className="text-sm font-bold">Set as Default Address</p>
 <p className="text-[10px] uppercase tracking-tight">Use this address for future checkouts</p>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input 
 type="checkbox" 
 name="isDefault"
 checked={formData.isDefault} 
 onChange={handleChange}
 className="sr-only peer" 
 />
 <div className="w-11 h-6 bg-gray-200 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
 </label>
 </div>

 {/* Action Button */}
 <div className="md:col-span-2 pt-6">
 <button
 onClick={handleSaveToProfile}
 disabled={loading}
 className=' border-2 border-gray-400 rounded-2xl w-full py-4 font-black uppercase tracking-[0.2em] hover:text-black transition-all disabled:bg-gray-300 disabled:border-gray-300 shadow-xl'
 >
 {loading ?'Processing...' : isEditMode ?'Update Address' :'Add Address to Profile'}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

export default AddressForm;