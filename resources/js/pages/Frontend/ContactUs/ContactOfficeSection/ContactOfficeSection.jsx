// resources/js/Pages/Frontend/ContactUs/ContactOfficeSection/ContactOfficeSection.jsx

// React
import React from 'react';

// Icons
import { FaGraduationCap } from 'react-icons/fa';

const ContactOfficeSection = ({ offices }) => {
  return (
    <section className="bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-50 py-10 sm:py-14 lg:py-37.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {offices.map((office) => (
            <div
              key={office.title}
              className="rounded-2xl border border-gray-100 bg-white p-12.5 shadow-lg "
            >

              <FaGraduationCap className="text-4xl" />


              <h3 className="text-[22px] sm:text-[24px] font-bold text-[#080C14] pt-5">
                {office.title}
              </h3>

              <div className="space-y-1 text-[14px] sm:text-[15px] leading-relaxed text-[#444]">
                <p className="font-semibold text-[#333333]">Dwip Unnayan Songstha (DUS)</p>
                <p><span className="font-semibold text-[#333333]">Address:</span> {office.address}</p>
                <p><span className="font-semibold text-[#333333]">Phone :</span> {office.phones}</p>
                <p>
                  <span className="font-semibold text-[#333333]">E-mail :</span>{" "}
                  {office.emails.map((email, idx) => (
                    <span key={idx}>
                      {idx > 0 && <span>, </span>}
                      <a
                        href={`mailto:${email}`}
                        className={`text-[#444] hover:underline ${idx > 0 ? "lg:pl-14" : ""
                          }`}
                      >
                        {email}
                      </a>
                    </span>
                  ))}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOfficeSection;