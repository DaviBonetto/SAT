
import React, { useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { DailyGoalsData } from '../types';
import { FlameIcon, PlusIcon } from '../components/Icons';

const DailyGoals: React.FC = () => {
    const [goals, setGoals] = useLocalStorage<DailyGoalsData>('dailyGoals', {
        dailyGoal: 2,
        weeklyGoal: 10,
        streak: 0,
        lastCompletedDate: null,
        hoursToday: 0
    });
    
    const [hoursToAdd, setHoursToAdd] = useState(1);

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    // Reset hoursToday if it's a new day
    useEffect(() => {
        const today = new Date();
        const lastDate = goals.lastCompletedDate ? new Date(goals.lastCompletedDate) : null;

        if (lastDate && !isSameDay(today, lastDate)) {
            setGoals(prev => ({ ...prev, hoursToday: 0 }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGoals(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const addStudyHours = () => {
        const today = new Date();
        const newHoursToday = goals.hoursToday + hoursToAdd;

        let newStreak = goals.streak;
        let newLastCompletedDate = goals.lastCompletedDate;

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        const lastDate = goals.lastCompletedDate ? new Date(goals.lastCompletedDate) : null;

        if (newHoursToday >= goals.dailyGoal) {
            if (!lastDate || !isSameDay(today, lastDate)) {
                 if(lastDate && isSameDay(yesterday, lastDate)) {
                    newStreak += 1; // It's a consecutive day
                 } else {
                    newStreak = 1; // Start a new streak
                 }
                 newLastCompletedDate = today.toISOString().split('T')[0];
            }
        }

        setGoals({
            ...goals,
            hoursToday: newHoursToday,
            streak: newStreak,
            lastCompletedDate: newLastCompletedDate
        });
        setHoursToAdd(1);
    };

    const dailyProgress = goals.dailyGoal > 0 ? Math.min((goals.hoursToday / goals.dailyGoal) * 100, 100) : 0;
    
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Study Progress Today</h2>
        <div className="mb-6">
            <p className="mb-2 text-gray-400">You've studied for <span className="font-bold text-white">{goals.hoursToday.toFixed(1)}</span> hours today.</p>
            <div className="w-full bg-gray-700 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${dailyProgress}%` }}></div>
            </div>
            <p className="text-right text-lg font-semibold mt-2 text-white">{dailyProgress.toFixed(0)}% of Daily Goal</p>
        </div>
        
        <div className="flex items-center gap-4">
             <input 
                type="number" 
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(parseFloat(e.target.value) || 0)}
                className="w-24 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                min="0.5"
                step="0.5"
            />
            <button onClick={addStudyHours} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center">
                <PlusIcon /> <span className="ml-2">Add Study Hours</span>
            </button>
        </div>

      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center justify-center text-center">
        <FlameIcon />
        <p className="text-5xl font-bold text-white mt-2">{goals.streak}</p>
        <p className="text-gray-400">Day Streak</p>
        {dailyProgress >= 100 && <p className="text-green-400 mt-2 font-semibold">Daily goal completed!</p>}
      </div>

      <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Set Your Goals</h2>
        <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
                <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-400 mb-1">Daily Study Hours</label>
                <input 
                    type="number"
                    id="dailyGoal"
                    name="dailyGoal"
                    value={goals.dailyGoal}
                    onChange={handleGoalChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                />
            </div>
            <div className="flex-1">
                <label htmlFor="weeklyGoal" className="block text-sm font-medium text-gray-400 mb-1">Weekly Study Hours</label>
                <input 
                    type="number"
                    id="weeklyGoal"
                    name="weeklyGoal"
                    value={goals.weeklyGoal}
                    onChange={handleGoalChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DailyGoals;