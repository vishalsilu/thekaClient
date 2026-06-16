

const Information = [
 {
 name:"Privacy Policy",
 link:"/privacy-policy",
 subtitle:"Data Protection",
 sections: [
 {
 id:"01",
 title:"Data Collection",
 text:"We collect essential identity markers including email, shipping coordinates, and style preferences to provide a precision-fit shopping experience."
 },
 {
 id:"02",
 title:"Encryption",
 text:"All transaction data is processed via 256-bit SSL encryption. We do not store raw credit card credentials on our studio servers."
 },
 {
 id:"03",
 title:"Digital Cookies",
 text:"We utilize digital cookies to remember your cart status and Blueprint preferences for future sessions."
 }
 ]
 },
 {
 name:"Terms of Service",
 link:"/terms-of-service",
 subtitle:"Legal Protocol",
 sections: [
 {
 id:"01",
 title:"Usage Rights",
 text:"By entering Urban Theka, you agree to respect our digital infrastructure and intellectual property, including all blueprint designs and media."
 },
 {
 id:"02",
 title:"Limited Drops",
 text:"Orders are subject to availability. Adding an item to your cart does not reserve it until the checkout protocol is complete."
 },
 {
 id:"03",
 title:"Account Security",
 text:"Users are responsible for maintaining the confidentiality of their security keys and access credentials."
 }
 ]
 },
 {
 name:"Return Policy",
 link:"/return-policy",
 subtitle:"Quality Assurance",
 highlight:"We ensure precision in every stitch. If it is not right, we fix it.",
 sections: [
 {
 id:"Window",
 title:"Return Window",
 text:"Items must be returned within 14 days of delivery in original Blueprint packaging with all tags attached."
 },
 {
 id:"Status",
 title:"Exclusions",
 text:"Final sale items and limited-edition archive drops are not eligible for return unless a manufacturing defect is present."
 }
 ]
 },
 {
 name:"Shipping Information",
 link:"/shipping-information",
 subtitle:"Logistics",
 methods: [
 { type:"Domestic", time:"3-5 Business Days" },
 { type:"Express", time:"Next Day Dispatch" }
 ],
 sections: [
 {
 id:"Track",
 title:"Tracking Protocol",
 text:"Every order includes a digital tracking link sent via email once the package leaves our warehouse."
 }
 ]
 }
];

const OurStore = [
 {
 address:"Pse Pose Pose Doda Pose Doda Pose Poooooseee Dodaaa O",
 phone:"+1 (123) 456-7890",
 email:"Vishalsainisilu@gmail.com",
 social: [
 { name:"Facebook", link:"https://www.facebook.com/vishal.saini.1437" },
 { name:"Twitter", link:"https://www.twitter.com/vishal_saini" },
 { name:"Instagram", link:"https://www.instagram.com/vishal_badona" },
 { name:"LinkedIn", link:"https://www.linkedin.com/company/vishalbadona" },
 { name:"YouTube", link:"https://www.youtube.com/" }
 ],
 time :"Everyday 08 AM-10 PM"
 }
];


const adjectives = ["Urban","Vintage","Street","Classic","Elite","Minimal","Acid","Retro","Nova","Zenith"];
const styles = ["Oversized","Slim-Fit","Relaxed","Tailored","Boxy","Cargo","Graphic","Premium"];

const PaymentMethods = ["MoneyBill","CreditCard","Paypal","GooglePay"];

const Pages = [
 { name:"Home", path:"/" },
 { name:"About Us", path:"/about-us" },
 { name:"Contact Us", path:"/contact-us" }
];

// ... (Keep all your existing code for Information, OurStore, Collections, Products, etc.)

/**
 * CART DATABASE (Spoof Data)
 * Pre-filled with items to help you design your Cart and Checkout pages.


/**
 * CART PRICING & CONFIGURATION
 * Useful for calculating totals in your frontend components.
 */
const CartPricing = {
 currency:"INR",
 currencySymbol:"₹",
 shipping: {
 standard: 99,
 express: 250,
 freeThreshold: 2000 // Free shipping if subtotal > 2000
 },
 taxRate: 0.18, // 18% GST
 discountCoupons: [
 { code:"FIRSTORDER", discount: 0.15, type:"percentage" },
 { code:"URBANTEKA", discount: 500, type:"fixed" }
 ]
};

const Users = [
 {
 id:"USER-001",
 firstName:"Vishal",
 lastName:"Saini",
 email:"Vishalsainisilu@gmail.com",
 password:"Password123", // In a real app, this would be hashed
 role:"Admin",
 phone:"+1 (123) 456-7890",
 avatar:"https://i.pravatar.cc/150?u=USER-001",
 addresses: [
 {
 id:"addr-1",
 type:"Home",
 street:"Shailja teri chut ma lola pana mno",
 city:"Cityville",
 state:"Rajasthan",
 firstName:"Vishal",
 lastName:"Saini",
 mobile:"+91 98765-43210",
 zip:"302001",
 isDefault: true,
 country:"India",
 }
 ],
 },
 {
 id:"USER-002",
 firstName:"Jane",
 lastName:"Doe",
 email:"jane.doe@example.com",
 password:"CustomerPass!",
 role:"Customer",
 phone:"+1 (987) 654-3210",
 avatar:"https://i.pravatar.cc/150?u=USER-002",
 addresses: [],
 wishlist: []
 }
];

/**
 * ORDER HISTORY (Spoof Data)
 * Link these to users via userId to build the"My Orders" section.
 */


// Add this to your ../Utils/db.js
const Coupons = [
 {
 code:"FIRST20",
 discountType:"percentage",
 value: 20, // 20% off
 minPurchase: 1000,
 },
 {
 code:"SAVE500",
 discountType:"fixed",
 value: 500, // ₹500 off
 minPurchase: 5000,
 },
 {
 code:"FREESHIP",
 discountType:"freeShipping",
 value: 0, // Free shipping
 minPurchase: 1000,
 },
 {
 code:"URBAN10",
 discountType:"percentage",
 value: 10, // 10% off
 minPurchase: 1500,
 }
];

/**
 * UPDATED EXPORTS
 */
export { 
 Pages, 
 OurStore, 
 Information, 
 PaymentMethods,
 CartPricing,
 Users, // New export
 Coupons // New export
};