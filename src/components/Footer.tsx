
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-2 h-7 w-7 text-greenyp-400"
            >
              <path d="M17.6,11.48 L19.44,8.3 C19.6,8.05 19.45,7.74 19.15,7.74 L14.82,7.75 C13.19,7.75 12.12,6.7 12.12,5.1 L12.12,4.97 C12.12,3.38 13.23,2.32 14.84,2.32 L20.15,2.33 C20.45,2.33 20.59,2.01 20.43,1.77 L18.6,0 L12.01,0 C8.3,0 6.09,2.1 6.09,5.1 L6.09,5.1 C6.09,7.67 7.63,9.16 9.67,9.89 L9.67,18.76 C9.67,19.42 9.14,20 8.51,20 L8.51,20 C7.87,20 7.35,19.43 7.35,18.76 L7.35,14.17 L3.87,14.17 C3.24,14.17 2.71,14.74 2.71,15.4 L2.71,15.4 C2.71,16.07 3.24,16.64 3.87,16.64 L5.04,16.64 L5.04,18.76 C5.04,20.78 6.55,22.38 8.51,22.38 L8.51,22.38 C10.46,22.38 11.98,20.78 11.98,18.76 L11.98,9.89 C14.02,9.16 15.56,7.67 15.56,5.1 L15.56,5.1 C15.56,5.07 15.56,5.04 15.56,5.01 L21.52,5.01 C21.82,5.01 21.98,4.7 21.81,4.45 L16.58,0 L16.58,0 L17.6,11.48 Z"/>
            </svg>
            <span className="text-xl font-bold text-white">GreenYP</span>
          </div>
          <p className="mb-6 text-gray-400">Explore the green marketplace, your source for all your lawn and garden needs</p>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {currentYear} GreenYP. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
