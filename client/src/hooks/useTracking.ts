import { useEffect, useState } from 'react';

export interface TrackingData {
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

export function useTracking() {
  const [trackingData, setTrackingData] = useState<TrackingData>({
    source: 'direct',
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    
    let source = 'direct';
    const referrer = document.referrer;

    if (utmSource) {
      source = utmSource;
    } else if (referrer) {
      if (referrer.includes('google.com')) source = 'google';
      else if (referrer.includes('facebook.com')) source = 'facebook';
      else if (referrer.includes('instagram.com')) source = 'instagram';
      else if (referrer.includes('t.co') || referrer.includes('twitter.com')) source = 'twitter';
      else source = 'referral';
    }

    setTrackingData({
      source,
      utmSource: utmSource || undefined,
      utmMedium: utmMedium || undefined,
      utmCampaign: utmCampaign || undefined,
      referrer: referrer || undefined,
    });
  }, []);

  return trackingData;
}
