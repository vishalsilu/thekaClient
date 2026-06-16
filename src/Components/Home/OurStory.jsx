import React from'react'

const OurStory = () => {
 return (
 /* Mobile: min-h-screen or h-auto with vertical padding to prevent overlap.
 Desktop: Fixed height (600px) to maintain the premium split look.
 */
 <div className='w-full lg:h-[600px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 md:px-16 lg:px-24 my-12 lg:my-24'>
 
 {/* Left Box: Image Container */}
 <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] lg:h-full overflow-hidden rounded-3xl shadow-sm">
 <img 
 src="https://urbantheka.in/cdn/shop/files/PAM04893.jpg?v=1706290109&width=940" 
 className='w-full h-full object-cover' 
 alt="Our Story" 
 />
 </div>

 {/* Right Box: Text Container */}
 <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start gap-6 py-4">
 
 {/* Headline */}
 <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center lg:text-left leading-tight'>
 Our Story
 </h1>
 
 {/* Paragraph: Better leading and text color for readability */}
 <p className='text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed text-center lg:text-left max-w-xl'>
 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est tenetur earum iusto, 
 odio illum quia laboriosam veniam rerum reprehenderit fugit eius. Sit maiores 
 veniam quasi blanditiis adipisci voluptatum sunt quas consequatur veritatis 
 totam nam repudiandae qui placeat dolorum.
 </p>
 
 {/* Optional Action Button - Added for a complete look */}
 <button className='px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95'>
 Read More
 </button>
 </div>

 </div>
 )
}

export default OurStory