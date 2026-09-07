import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">AidLink</h3>
          <p className="text-sm">Connecting resources to real impact. We ensure all NGOs on our platform undergo a strict documentation verification process to ensure your donations go to the right place.</p>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-white">Our Verification Process</Link></li>
            <li><Link to="#" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
          <p className="text-sm mb-2">support@aidlink.com</p>
          <p className="text-sm">Admin Office, Tech Park, Level 4</p>
        </div>
      </div>
    </footer>
  );
}