import React from'react';
import { useSelector } from'react-redux';
import { useTextFavicon } from'../Utils/useTextFavicon';
import AddressBook from'../Components/Profile/AddressBook';
import AddressModal from'../Components/Profile/AddressForm';
import { useProfile } from'../hooks/useProfile';

const Addresses = () => {
 const { user, isModalOpen, setIsModalOpen, formData, handleInputChange, handleOpenModal, saveAddressAction, deleteAddressAction } = useProfile();
 const data = useSelector((state) => state.siteData.data);

 useTextFavicon('CU',
 `${user?.firstName ||'My'} Addresses - ${data?.websiteName ||'Store'}`,
 { bgColor:'#10b981', textColor:'#ffffff' }
 );

 return (
 <div className="max-w-7xl mx-auto px-4 py-12">
 <header className="mb-10 border-b border-slate-100 pb-10">
 <h1 className="text-4xl font-bold">Saved Addresses</h1>
 <p className="text-sm text-slate-500 mt-3">Manage your shipping addresses and add new delivery locations.</p>
 </header>

 <div className="flex items-center justify-between mb-10 gap-4">
 <div>
 <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Address Book</p>
 <h2 className="text-2xl font-bold">Your saved shipping addresses</h2>
 </div>
 
 </div>

 <AddressBook
 addresses={user?.addresses}
 onAdd={handleOpenModal}
 onEdit={(idx) => handleOpenModal(idx)}
 onDelete={deleteAddressAction}
 />

 {isModalOpen && (
 <AddressModal
 initialData={formData}
 onChange={handleInputChange}
 onSave={saveAddressAction}
 onClose={() => setIsModalOpen(false)}
 />
 )}
 </div>
 );
};

export default Addresses;
