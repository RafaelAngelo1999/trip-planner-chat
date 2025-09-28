import { useCallback } from 'react';

export function useNotificationSound() {

  const playNotificationSound = useCallback((enabled: boolean) => {
    if (!enabled) return;

    try {
      // Create a pleasant notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a gentle two-tone notification sound
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        // Gentle fade in and out
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play two pleasant tones
      playTone(800, audioContext.currentTime, 0.15);
      playTone(1000, audioContext.currentTime + 0.1, 0.15);
      
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, []);

  return { playNotificationSound };
}