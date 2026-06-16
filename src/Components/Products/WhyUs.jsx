import React from'react';
import { FaHandshake, FaTruck, FaUserTie, FaStar } from'react-icons/fa';

const WhyUs = () => {
 const features = [
 {
 icon: <FaHandshake className="text-4xl md:text-5xl" />,
 text:"Over 1 Million Happy Customers"
 },
 {
 icon: <FaTruck className="text-4xl md:text-5xl" />,
 text:"Free Shipping on orders above Rs 999"
 },
 {
 // Using a generic icon, but you can replace with your custom Sidhu Moose Wala SVG
 icon: <FaUserTie className="text-4xl md:text-5xl" />, 
 text:"Our own Design"
 },
 {
 icon: <FaStar className="text-4xl md:text-5xl" />,
 text:"Celebrity endorsed Brand"
 }
 ];

 return (
 <section className="bg-[#E5E7EB] py-5 px-4 w-full my-3">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-black tracking-tight">
 Why Us?
 </h2>
 
 <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
 {features.map((feature, index) => (
 <div 
 key={index} 
 className="flex flex-col items-center text-center space-y-4 group"
 >
 <div className="text-black transition-transform duration-300 group-hover:scale-110">
 {feature.icon}
 </div>
 <p className="text-gray-700 text-sm md:text-base font-medium max-w-[200px]">
 {feature.text}
 </p>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
};

export default WhyUs;