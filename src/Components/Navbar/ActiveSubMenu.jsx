import React from'react'
import { FaArrowLeft } from'react-icons/fa6'
import { useDispatch } from'react-redux';
import { Link } from'react-router-dom';
import { getProducts } from'../../Redux/controllers/metaDataController';

const ActiveSubMenu = ({ data, isCollection, closeModal, backModal }) => {
 const dispatch = useDispatch()

 if (!data) return null;

 const menuName = data?.label || data?.name ||"";
 const categoriesList = isCollection ? data?.allCategories : data?.categories;

 const handleCategoryClick = async (type, category) => {
 dispatch(getProducts({ type: type, category: category }));
 if (backModal) backModal();
 if (closeModal) closeModal();
 }

 if (!categoriesList || categoriesList.length === 0) return null;

 return (
 <div
 className="z-[100] flex flex-col w-full justify-start items-center gap-1
 lg:absolute lg:top-full lg:left-0 lg:w-max lg:min-w-[220px] lg:h-auto bg-surface lg:shadow-xl lg:border lg:border-gray-100 lg:p-4 lg:rounded-xl
 
 lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:transition-all lg:duration-200 lg:transform lg:scale-95 lg:group-hover:scale-100 lg:mt-1
 overflow-y-auto max-h-[60vh] lg:overflow-visible lg:max-h-none pb-2"
 style={{ WebkitOverflowScrolling:'touch' }}
 >
 
 {/* Back Button - Only visible on Mobile */}
 {backModal && (
 <button 
 className="relative group w-full lg:hidden text-left py-3 text-md font-bold flex justify-start gap-4 items-center border-b border-surface text-primary" 
 onClick={backModal}
 >
 <FaArrowLeft /> {menuName}
 </button>
 )}

 {/* Category Links */}
 {categoriesList.map((category, index) => {
 const categoryName = category?.name || category?.label ||"";
 return (
 <Link 
 onClick={() => handleCategoryClick(menuName, categoryName)} 
 to={`/collections/${menuName.toLowerCase()}/${categoryName.toLowerCase()}`} 
 key={index} 
 className="relative group w-full text-left py-3 lg:py-2.5 px-3 text-sm font-medium flex justify-between items-center rounded-lg text-primary hover:text-emerald-500 hover:bg-gray-50 transition-all"
 >
 {categoryName}
 </Link>
 );
 })} 
 </div>
 )
}

export default ActiveSubMenu;