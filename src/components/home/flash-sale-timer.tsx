"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlashSaleTimerProps {
  targetDate: Date;
  className?: string;
}

export default function FlashSaleTimer({
  targetDate,
  className,
}: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({
    value,
    label,
    color,
  }: {
    value: number;
    label: string;
    color: string;
  }) => (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg",
          color
        )}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs md:text-sm text-gray-600 mt-2 font-medium capitalize">
        {label}
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2 md:gap-4",
        className
      )}
    >
      <TimeUnit value={timeLeft.days} label="Days" color="bg-red-600" />
      <span className="text-2xl font-bold text-red-600 mt-[-20px]">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" color="bg-orange-500" />
      <span className="text-2xl font-bold text-orange-500 mt-[-20px]">:</span>
      <TimeUnit
        value={timeLeft.minutes}
        label="Mins"
        color="bg-orange-600"
      />
      <span className="text-2xl font-bold text-orange-600 mt-[-20px]">:</span>
      <TimeUnit
        value={timeLeft.seconds}
        label="Secs"
        color="bg-red-500"
      />
    </div>
  );
}
