import React, { useState, useEffect } from 'react';
import { YUVA_SANGAM_EVENT } from '../constants/eventDetails';
import { CalendarButtons } from './CalendarButtons';
import { Clock, MapPin, Flame, Timer } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const TARGET_EVENT_TIME = new Date('2026-08-30T15:00:00+05:30').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = TARGET_EVENT_TIME - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

const AnimatedDigit: React.FC<{ value: string | number; suffix: string }> = ({ value, suffix }) => {
  return (
    <span className="inline-flex items-center gap-[1px] bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={String(value)}
          initial={{ y: -5, opacity: 0, filter: 'blur(2px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: 5, opacity: 0, filter: 'blur(2px)' }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="inline-block min-w-[12px] text-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-[9px] text-amber-400/80 font-sans font-semibold">{suffix}</span>
    </span>
  );
};

export const EventHeader: React.FC = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`SA Jain College Auditorium, Ambala`)}`;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white rounded-xl sm:rounded-2xl border border-orange-500/30 p-3 sm:p-4 mb-3 sm:mb-4 relative overflow-visible z-20 shadow-md shadow-orange-950/30">
      {/* Decorative top border line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-xl sm:rounded-t-2xl" />
      
      {/* Background radial glow */}
      <div className="absolute -top-12 left-1/3 w-48 h-24 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-2.5">
        {/* Top Section: Left (Title + Organizer + Venue) & Right (30 August Badge + Save Event Button) */}
        <div className="flex items-start justify-between gap-3">
          {/* Left Column */}
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            {/* Title & Icon */}
            <div className="flex items-center gap-3 min-w-0">
              <img src="./logo.png" alt="तरुणोदय उत्कर्ष युवा संगम" className="h-14 sm:h-16 object-contain" />
            </div>

            {/* Venue Details */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-amber-100/90 font-medium translate-y-[13px]">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-amber-200 hover:text-amber-300 hover:underline decoration-amber-400/50 underline-offset-2 transition-colors"
                title="Open location on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>SA Jain College Auditorium, Ambala</span>
              </a>
            </div>
          </div>

          {/* Right Column: 30 August Date Badge + Save Event Button underneath */}
          <div className="shrink-0 flex flex-col items-end gap-1.5 sm:gap-2">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-orange-500/20 via-red-500/15 to-amber-500/20 border border-orange-500/30 px-3 py-1.5 rounded-xl text-center shadow-xs min-w-[72px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300 leading-none">
                30
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-orange-100 uppercase tracking-widest mt-0.5">
                August
              </span>
            </div>

            {/* Save Event Button placed below date */}
            <CalendarButtons variant="compact" className="translate-y-[3px]" />
          </div>
        </div>

        {/* Bottom Row: Time on Left, Animated Countdown Timer on Right (aligned with Date) */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pt-2 border-t border-orange-500/20 relative z-30">
          {/* Time on Left */}
          <div className="flex items-center gap-1.5 text-xs text-amber-200 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>03:00 PM – 06:30 PM</span>
          </div>

          {/* Dynamic Compact Countdown Pill aligned to Right */}
          {!timeLeft.isPast ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-950/90 via-slate-900/80 to-blue-950/90 border border-orange-500/30 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold text-amber-300 shadow-xs ring-1 ring-orange-500/20 ml-auto">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <div className="flex items-center gap-1">
                <AnimatedDigit value={timeLeft.days} suffix="d" />
                <span className="text-amber-500/60 font-sans text-[10px]">:</span>
                <AnimatedDigit value={String(timeLeft.hours).padStart(2, '0')} suffix="h" />
                <span className="text-amber-500/60 font-sans text-[10px]">:</span>
                <AnimatedDigit value={String(timeLeft.minutes).padStart(2, '0')} suffix="m" />
                <span className="text-amber-500/60 font-sans text-[10px]">:</span>
                <AnimatedDigit value={String(timeLeft.seconds).padStart(2, '0')} suffix="s" />
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-xs text-emerald-300 font-bold ml-auto">
              🎉 Event Live!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




