// import { useSelector } from'react-redux';
// import WhatsAppContactForm from'../Components/WhatsAppContactForm';

// const WhatsAppContactExample = () => {

// const user = useSelector((state) => state.auth.user);
// console.log("Authenticated User in WhatsAppContactExample:", user);

// const data = useSelector((state) => state.siteData.data.contact);
// console.log("Site Data in WhatsAppContactExample:", data);
// // Handle form submission if you need to log or track submissions
// const handleFormSubmit = (e,formData, whatsappURL) => {
// // You can log the submission, send it to your backend, etc.
// console.log('Form submitted:', formData);
// };

// return (
// <div className="min-h-screen p-6" style={{ backgroundColor:'var(--bg, #f5f5f5)' }}>
// <div className="max-w-4xl mx-auto">
 
// {/* Page Header */}
// <div className="mb-12 text-center">
// <h1 className="text-4xl font-bold mb-3" style={{ color:'var(--text, #000000)' }}>
// Contact Us via WhatsApp
// </h1>
// <p className="text-lg opacity-70" style={{ color:'var(--text, #000000)' }}>
// Quick and easy way to reach us
// </p>
// </div>

// {/* Form Container */}
// <div className="flex justify-center">
// <WhatsAppContactForm 
// businessPhoneNumber={data?.phone.replace(/\D/g,'')} // Your WhatsApp business number (with country code)
// onSubmit={handleFormSubmit}
// userId={user?.id}
// title="Quick Contact"
// subtitle="Message us on WhatsApp"
// submitText="Send on WhatsApp"
// successMessage="Opening WhatsApp..."
// />
// </div>

// {/* Info Section */}
// <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
// <div className="p-6 rounded-lg" style={{ backgroundColor:'var(--surface, #ffffff)' }}>
// <h3 className="text-lg font-semibold mb-2" style={{ color:'var(--text, #000000)' }}>📱 Quick</h3>
// <p className="text-sm opacity-70" style={{ color:'var(--text, #000000)' }}>
// Get instant notifications and reply quickly through WhatsApp
// </p>
// </div>
// <div className="p-6 rounded-lg" style={{ backgroundColor:'var(--surface, #ffffff)' }}>
// <h3 className="text-lg font-semibold mb-2" style={{ color:'var(--text, #000000)' }}>🔒 Secure</h3>
// <p className="text-sm opacity-70" style={{ color:'var(--text, #000000)' }}>
// Your information is encrypted end-to-end through WhatsApp
// </p>
// </div>
// <div className="p-6 rounded-lg" style={{ backgroundColor:'var(--surface, #ffffff)' }}>
// <h3 className="text-lg font-semibold mb-2" style={{ color:'var(--text, #000000)' }}>✓ Easy</h3>
// <p className="text-sm opacity-70" style={{ color:'var(--text, #000000)' }}>
// Simple form, no complex processes - just fill and send
// </p>
// </div>
// </div>
// </div>
// </div>
// );
// };

// export default WhatsAppContactExample;
