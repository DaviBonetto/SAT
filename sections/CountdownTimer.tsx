import React, { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CountdownTimer: React.FC = () => {
  const [examDateTime, setExamDateTime] = useLocalStorage<string>('examDateTime', '');
  
  const datePart = useMemo(() => examDateTime.split('T')[0] || '', [examDateTime]);
  const timePart = useMemo(() => examDateTime.split('T')[1] || '09:00', [examDateTime]);

  // This effect will run once a second to update the timer display
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
        setTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeRemaining = useMemo(() => {
    if (!examDateTime) return null;

    const today = new Date();
    const targetDate = new Date(examDateTime);
    
    const diffTime = targetDate.getTime() - today.getTime();
    if (diffTime < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };

  }, [examDateTime, setTick]); // Depend on setTick to re-evaluate every second
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
        setExamDateTime(`${newDate}T${timePart}`);
    } else {
        setExamDateTime('');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (datePart) {
          setExamDateTime(`${datePart}T${e.target.value}`);
      }
  };
  
  const TimeUnit: React.FC<{ value: number, label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-gray-700 p-4 sm:p-6 rounded-lg w-24 h-24 sm:w-32 sm:h-32">
        <span className="text-3xl sm:text-5xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
        <span className="text-sm sm:text-base text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Set Your Exam Date & Time</h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="date"
          value={datePart}
          onChange={handleDateChange}
          className="bg-gray-700 border border-gray-600 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="time"
          value={timePart}
          onChange={handleTimeChange}
          className="bg-gray-700 border border-gray-600 text-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {examDateTime && timeRemaining ? (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-white">Time Remaining</h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <TimeUnit value={timeRemaining.days} label="Days" />
            <TimeUnit value={timeRemaining.hours} label="Hours" />
            <TimeUnit value={timeRemaining.minutes} label="Minutes" />
            <TimeUnit value={timeRemaining.seconds} label="Seconds" />
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Please select an exam date to start the countdown.</p>
      )}
    </div>
  );
};

export default CountdownTimer;