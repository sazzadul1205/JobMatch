// resources/js/components/Navbar.jsx

// React
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Icons
import { Menu, X, ChevronDown } from 'lucide-react';

// Utility function to check if value exists
const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const Navbar = ({ navbarData }) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Get current URL path
  const { url } = usePage();

  // Check if a link is active
  const isActive = (href) => {
    if (!hasValue(href)) return false;
    if (href === '/') {
      return url === href;
    }
    return url.startsWith(href);
  };

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Don't render if no data
  if (!hasValue(navbarData)) {
    return null;
  }

  // Safe destructuring with defaults
  const {
    logo = {},
    navLinks = [],
    button = {},
    mobileMenu = {},
    dropdowns = []
  } = navbarData;

  const hasLogo = hasValue(logo.src);
  const hasNavLinks = hasValue(navLinks);
  const hasButton = hasValue(button.text) && hasValue(button.href);
  const hasDropdowns = hasValue(dropdowns);

  // If no content, don't render
  if (!hasLogo && !hasNavLinks && !hasButton) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className="mx-auto px-5 md:px-20 py-3">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          {hasLogo && (
            <Link href={logo.href || '/'} className="flex items-center space-x-2 group">
              <img
                src={logo.src}
                alt={logo.alt || 'Logo'}
                className={logo.className || 'h-10 w-auto'}
              />
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className='flex items-center space-x-8'>

            {/* Navigation Links */}
            {hasNavLinks && (
              <ul className="hidden lg:flex items-center space-x-8">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  const hasDropdown = hasValue(link.dropdown) || hasValue(dropdowns[index]);

                  return (
                    <li key={link.name || index} className="relative group">
                      {hasDropdown ? (
                        // Dropdown Link
                        <div>
                          <button
                            onClick={() => toggleDropdown(index)}
                            className={`relative font-medium transition-all duration-300 flex items-center gap-1 ${active
                              ? 'text-[#009BE2]'
                              : 'text-black hover:text-[#009BE2]'
                              }`}
                          >
                            {link.name}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdowns[index] ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdowns[index] && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {(link.dropdown || dropdowns[index] || []).map((dropdownItem, idx) => (
                                <Link
                                  key={idx}
                                  href={dropdownItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#009BE2] hover:text-white transition-colors duration-200"
                                  onClick={() => setOpenDropdowns({})}
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Regular Link
                        <Link
                          href={link.href}
                          className={`relative font-medium transition-all duration-300 group ${active
                            ? 'text-[#009BE2]'
                            : 'text-black hover:text-[#009BE2]'
                            }`}
                        >
                          {link.name}
                          {/* Bottom blue line - active state */}
                          <span
                            className={`absolute bottom-0 left-0 h-0.5 bg-[#009BE2] transition-all duration-300 ${active
                              ? 'w-full'
                              : 'w-0 group-hover:w-full group-hover:right-0 group-hover:left-auto'
                              }`}
                          ></span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Desktop Contact Button */}
            {hasButton && (
              <Link
                href={button.href}
                className={`hidden lg:inline-block ${button.className || 'capitalize text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200'}`}
              >
                {button.text}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={mobileMenu.className || "md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen ? 'max-h-125 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
          <ul className="flex flex-col space-y-4 pb-4">
            {hasNavLinks && navLinks.map((link, index) => {
              const active = isActive(link.href);
              const hasDropdown = hasValue(link.dropdown) || hasValue(dropdowns[index]);
              const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

              return (
                <li key={link.name || index}>
                  {hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                        className={`flex items-center justify-between w-full font-medium transition-colors duration-200 py-2 ${active ? 'text-[#009BE2]' : 'text-black hover:text-[#009BE2]'
                          }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileDropdownOpen && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                          {(link.dropdown || dropdowns[index] || []).map((dropdownItem, idx) => (
                            <Link
                              key={idx}
                              href={dropdownItem.href}
                              className="block py-2 text-sm text-gray-600 hover:text-[#009BE2] transition-colors duration-200"
                              onClick={() => {
                                setIsOpen(false);
                                setMobileDropdownOpen(false);
                              }}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block font-medium transition-colors duration-200 py-2 ${active ? 'text-[#009BE2]' : 'text-black hover:text-[#009BE2]'
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                      {active && (
                        <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#009BE2]"></span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
            {hasButton && (
              <li>
                <Link
                  href={button.href}
                  className="inline-block text-center w-full text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {button.text}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;