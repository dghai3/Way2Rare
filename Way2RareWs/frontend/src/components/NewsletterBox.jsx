import React, { useState } from 'react';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setError('Please enter your email address');
            setSuccess(false);
            return;
        }
        
        // Clear error if email is provided
        setError('');
        // Here you would typically send the email to your backend
        console.log('Subscribing with email:', email);
        
        // Show success message and reset form
        setSuccess(true);
        setEmail('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    return(
        <div className = 'text-center'>
            <p className = 'text-2xl font-medium text-gray-800'>Subscribe now & get 10% off</p>
            <p className = 'text-gray-400 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias dolor perferendis, in quos, sit beatae repudiandae, rem iure quam nostrum eius ducimus asperiores architecto sequi quasi. Nisi tenetur voluptatibus fuga!</p>
            <form onSubmit={handleSubmit} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input 
                    className ='w-full sm:flex-1 outline-none' 
                    type = "email" 
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(''); // Clear error when user starts typing
                    }}
                />
                <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
            </form>
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            {success && <p className='text-green-500 text-sm mt-2'>Thank you for subscribing!</p>}
        </div>
    )
}

export default NewsletterBox