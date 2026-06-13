// React
import React from 'react';

// Inertia
import { Head } from '@inertiajs/react';

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Sections
import FAQSection from '../About/FAQSection/FAQSection';
import AddressSection from './AddressSection/AddressSection';
import FollowUSSection from './FollowUSSection/FollowUSSection';
import BannerSection from '../About/BannerSection/BannerSection';
import StoriesSection from '../Home/StoriesSection/StoriesSection';
import ContactReachSection from './ContactReachSection/ContactReachSection';
import ContactOfficeSection from './ContactOfficeSection/ContactOfficeSection';
import UpcomingEventsSection from '../Home/UpcomingEventsSection/UpcomingEventsSection';

const ContactUs = ({
  // Shared 
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific - Now coming from backend
  bannerData,
  offices,
  socialItems,
  reachUsImage,
  officesLocation,
  faqData,
  storiesData,
  upcomingEventsData,
}) => {
  return (
    <PublicLayout topBarData={topBarData} navbarData={navbarData} footerData={footerData} storageUrl={storageUrl}>
      <Head title="Contact Us | DUS - Dwip Unnayan Society | Empowering Communities" />

      {/* Banner */}
      <BannerSection bannerData={bannerData} sectionId='contact-us-banner' />

      {/* Contact Office Section */}
      <ContactOfficeSection offices={offices} />

      {/* Contact Reach Section*/}
      <ContactReachSection image={reachUsImage} />

      {/* Follow US Section */}
      <FollowUSSection SocialItems={socialItems} />

      {/* Address Section*/}
      <AddressSection officesLocation={officesLocation} />

      {/* FAQ Section */}
      <FAQSection faqData={faqData} bgColor={'bg-white'} />

      <StoriesSection storiesData={storiesData} />

      <UpcomingEventsSection eventsData={upcomingEventsData} />
    </PublicLayout>
  );
};

export default ContactUs;