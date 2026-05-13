import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // In-page JSON data
  const footerData = {
    logo: {
      src: "/images/Icon-bottom.svg",
      alt: "DUS Logo",
      className: "h-41.25 w-auto"
    },
    description: "A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur's promotion and capacity building of the underprivileged directing towards a just society",
    socialLinks: [
      { icon: FaFacebook, url: "#", hoverColor: "hover:text-blue-400", ariaLabel: "Facebook" },
      { icon: FaInstagram, url: "#", hoverColor: "hover:text-pink-400", ariaLabel: "Instagram" },
      { icon: FaXTwitter, url: "#", hoverColor: "hover:text-gray-400", ariaLabel: "Twitter" },
      { icon: FaLinkedin, url: "#", hoverColor: "hover:text-blue-500", ariaLabel: "LinkedIn" }
    ],
    address: {
      title: "Address",
      line1: "24/5 Mollika, Prominent Housing",
      line2: "3 Pisciculture Road, Mohammadpur",
      city: "Dhaka - 1207"
    },
    contact: {
      title: "Call",
      numbers: [
        "+88 01761 493407",
        "+88 01622 093793 – (In Emergency)",
        "+88 02 48110362"
      ]
    },
    email: {
      title: "Email Us",
      addresses: [
        "dusdhaka@gmail.com",
        "dus.eddus@gmail.com"
      ]
    },
    quickLinks: [
      "About Us", "Community Radio", "Evaluation", "Working Area",
      "Publication", "Mission & Visions", "Blogs", "Contact Us"
    ],
    programs: [
      "Micro-Finance Program", "Disaster Management", "Community Radio", "Education",
      "ICT for Development", "Health Program", "Livelihood", "Member Facilities",
      "Social Development", "Legal Support", "Agriculture", "Water and Sanitation",
      "Research and Documentation", "Training Facilities", "Tourism"
    ],
    newsletter: {
      title: "Subscribe to Our Newsletter",
      placeholder: "Enter your email address",
      buttonText: "Subscribe"
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubmitMessage('Please enter a valid email address');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with actual API endpoint
    setTimeout(() => {
      setSubmitMessage('Successfully subscribed!');
      setEmail('');
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }, 1000);
  };

  // Split programs into two columns
  const itemsPerColumn = Math.ceil(footerData.programs.length / 2);
  const firstProgramColumn = footerData.programs.slice(0, itemsPerColumn);
  const secondProgramColumn = footerData.programs.slice(itemsPerColumn);

  return (
    <footer className='bg-[#080C14] rounded-t-4xl' role="contentinfo">
      <div className='mx-auto flex flex-col lg:flex-row justify-between max-w-7xl gap-12 lg:gap-50 py-12 lg:py-30 px-4 lg:px-0'>

        {/* Left Section */}
        <div className='w-full lg:w-1/3'>
          {/* Footer Logo */}
          <img
            src={footerData.logo.src}
            alt={footerData.logo.alt}
            className={footerData.logo.className}
            loading="lazy"
          />

          {/* Footer Description */}
          <p className='pt-5 max-w-92.5 text-xs leading-relaxed text-gray-300'>
            {footerData.description}
          </p>

          {/* Social Media Icons */}
          <div className='pt-5 flex gap-3 lg:gap-5' aria-label="Social media links">
            {footerData.socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <div
                  key={index}
                  className='border border-white rounded-full p-2 transition-transform duration-200 hover:scale-110'
                >
                  <a
                    href={social.url}
                    className={`text-2xl text-white ${social.hoverColor} transition-colors duration-200`}
                    aria-label={social.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Address & Contact Info */}
          <div className='max-w-125 pt-5 space-y-4'>
            <div>
              <h2 className='text-gray-400 font-semibold mb-2'>{footerData.address.title}</h2>
              <address className="not-italic text-gray-300">
                {footerData.address.line1}<br />
                {footerData.address.line2}<br />
                {footerData.address.city}
              </address>
            </div>

            <div>
              <h2 className='text-gray-400 font-semibold mb-2'>{footerData.contact.title}</h2>
              {footerData.contact.numbers.map((number, index) => (
                <a
                  key={index}
                  href={`tel:${number.replace(/\D/g, '')}`}
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  {number}
                </a>
              ))}
            </div>

            <div>
              <h2 className='text-gray-400 font-semibold mb-2'>{footerData.email.title}</h2>
              {footerData.email.addresses.map((emailAddr, index) => (
                <a
                  key={index}
                  href={`mailto:${emailAddr}`}
                  className="block text-gray-300 hover:text-white transition-colors break-all"
                >
                  {emailAddr}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className='w-full lg:w-2/3'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Quick Links */}
            <div>
              <h2 className='text-xl lg:text-[26px] font-bold mb-5'>Quick Links</h2>
              <ul className='space-y-3'>
                {footerData.quickLinks.map((link, index) => (
                  <li key={index} className='flex items-center group'>
                    <img
                      src="/images/link.svg"
                      alt=""
                      className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                      aria-hidden="true"
                    />
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-[#009BE2] transition-colors cursor-pointer"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Programs - Column 1 */}
            <div>
              <h2 className='text-xl lg:text-[26px] font-bold mb-5'>Our Programs</h2>
              <ul className='space-y-3'>
                {firstProgramColumn.map((program, index) => (
                  <li key={index} className='flex items-center group'>
                    <img
                      src="/images/link.svg"
                      alt=""
                      className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                      aria-hidden="true"
                    />
                    <Link
                      href={`/programs/${program.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-[#009BE2] transition-colors cursor-pointer"
                    >
                      {program}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Programs - Column 2 */}
            <div>
              <h2 className='text-xl lg:text-[26px] font-bold mb-5 opacity-0 pointer-events-none lg:invisible'>
                Our Programs
              </h2>
              <ul className='space-y-3'>
                {secondProgramColumn.map((program, index) => (
                  <li key={index} className='flex items-center group'>
                    <img
                      src="/images/link.svg"
                      alt=""
                      className='mr-3 w-2.5 h-auto opacity-70 group-hover:opacity-100 transition-opacity'
                      aria-hidden="true"
                    />
                    <Link
                      href={`/programs/${program.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-[#009BE2] transition-colors cursor-pointer"
                    >
                      {program}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className='pt-10 mt-5 border-t border-gray-700'>
            <h2 className='text-2xl lg:text-[30px] font-bold'>{footerData.newsletter.title}</h2>

            <form onSubmit={handleSubscribe} className='space-y-3 pt-5'>
              <label htmlFor="email" className="text-gray-300">Email Address</label>
              <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2'>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={footerData.newsletter.placeholder}
                  className="flex-1 py-3 px-4 bg-[#080C14] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009BE2] focus:border-transparent transition-all text-white"
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='bg-[#009BE2] hover:bg-[#009BE2]/80 disabled:bg-[#009BE2]/50 disabled:cursor-not-allowed px-6 py-3 rounded-md font-semibold transition-all duration-200'
                >
                  {isSubmitting ? 'Subscribing...' : footerData.newsletter.buttonText}
                </button>
              </div>
              {submitMessage && (
                <p className={`text-sm mt-2 ${submitMessage.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;