'use client';

import { useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { ANNOUNCEMENT } from '@/lib/constants';

// Subscribe to localStorage changes
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return localStorage.getItem('announcement-dismissed');
}

function getServerSnapshot() {
  return null;
}

export function AnnouncementBar() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localDismissed, setLocalDismissed] = useState(false);

  const isVisible = !dismissed && !localDismissed;

  const handleDismiss = () => {
    setLocalDismissed(true);
    localStorage.setItem('announcement-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#2D2D2D] text-white py-2 px-4 text-center text-sm relative">
      <p className="pr-8">{ANNOUNCEMENT.message}</p>
      {ANNOUNCEMENT.dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

