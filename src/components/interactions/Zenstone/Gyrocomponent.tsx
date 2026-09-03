import { useEffect, useState } from 'react';

export default function Gyrocomponent() {
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
    hasPermission: false,
    isAndroid: false,
    isIOS: false,
  });

  useEffect(() => {
    // Detect platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    setOrientation((prev) => ({ ...prev, isAndroid, isIOS }));

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation((prev) => ({
        ...prev,
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      }));
    };

    const requestPermission = async () => {
      // iOS 13+
      if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            setOrientation((prev) => ({ ...prev, hasPermission: true }));
          }
        } catch (error) {
          console.error('iOS permission denied:', error);
        }
      } else {
        // Android and older iOS - no permission needed
        window.addEventListener('deviceorientation', handleOrientation);
        setOrientation((prev) => ({ ...prev, hasPermission: true }));
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
}