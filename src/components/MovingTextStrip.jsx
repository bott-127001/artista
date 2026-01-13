import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

function MovingTextStrip() {
  const [announcementText, setAnnouncementText] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await settingsAPI.get();
      setAnnouncementText(response.data.announcementText || '');
      setIsActive(response.data.isAnnouncementActive || false);
    } catch (error) {
      // Silently fail if API is not available - component will just not render
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.error('Error fetching announcement:', error);
      }
    }
  };

  if (!isActive || !announcementText) {
    return null;
  }

  return (
    <div className="fixed top-[68px] sm:top-[70px] md:top-[66px] left-0 right-0 z-50 bg-accent text-white overflow-hidden h-10 flex items-center">
      <div className="whitespace-nowrap overflow-hidden w-full">
        <div className="inline-flex animate-marquee">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="px-12 font-medium text-sm">{announcementText}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovingTextStrip;
