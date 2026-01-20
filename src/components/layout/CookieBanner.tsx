'use client';

import { useState, useSyncExternalStore } from 'react';

// Subscribe to localStorage changes
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return localStorage.getItem('cookie-consent');
}

function getServerSnapshot() {
  return null;
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localAccepted, setLocalAccepted] = useState(false);

  const isVisible = !consent && !localAccepted;

  const handleAccept = () => {
    setLocalAccepted(true);
    localStorage.setItem('cookie-consent', 'accepted');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D2D2D] text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          This site uses cookies to offer you a better browsing experience. By
          browsing this website, you agree to our use of cookies.
        </p>
        <button
          onClick={handleAccept}
          className="bg-[#C9A86C] hover:bg-[#B89A5C] text-white font-semibold px-6 py-2 rounded transition-colors whitespace-nowrap"
        >
          ACCEPT
        </button>
      </div>
    </div>
  );
}

