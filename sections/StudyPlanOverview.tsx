import React, { useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { StudyPlan, TopicCategory } from '../types';
import { INITIAL_STUDY_PLAN, INITIAL_TOPIC_CATEGORIES } from '../constants';
import { useState } from 'react';

const PieChart: React.FC<{ percentage: number; size?: number }> = ({ percentage, size = 150 }) => {
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="text-gray-700"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-blue-500"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />
        </svg>
        <span className="absolute text-2xl font-bold text-white">{`${percentage}%`}</span>
      </div>
    );
};

const StudyPlanOverview: React.FC = () => {
  const [studyPlan, setStudyPlan] = useLocalStorage<StudyPlan[]>('studyPlan', INITIAL_STUDY_PLAN);
  const [categories] = useLocalStorage<TopicCategory[]>('topicsMastery', INITIAL_TOPIC_CATEGORIES);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const overallProgress = useMemo(() => {
    const allTopics = categories.flatMap(c => c.topics);
    if (allTopics.length === 0) return { percentage: 0, mastered: 0, total: 0 };
    const masteredTopics = allTopics.filter(t => t.mastered).length;
    return {
        percentage: Math.round((masteredTopics / allTopics.length) * 100),
        mastered: masteredTopics,
        total: allTopics.length,
    }
  }, [categories]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(studyPlan[index].strategy);
  };

  const handleSave = (index: number) => {
    const newPlan = [...studyPlan];
    newPlan[index].strategy = editText;
    setStudyPlan(newPlan);
    setEditingIndex(null);
  };
  
  const handleCancel = () => {
      setEditingIndex(null);
      setEditText('');
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditText(e.target.value);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow p-6">
             <h2 className="text-xl font-bold mb-4 text-white">Mastery Progress</h2>
             <p className="text-gray-400 mb-6">
                This chart shows your overall topic mastery based on the checklist in the "Topics Mastery" section.
            </p>
             <div className="flex items-center gap-6">
                <PieChart percentage={overallProgress.percentage} />
                <div>
                    <h3 className="text-3xl font-bold text-white">{overallProgress.mastered} / {overallProgress.total}</h3>
                    <p className="text-gray-400">Topics Mastered</p>
                </div>
             </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Quick Tip</h2>
            <p className="text-gray-400">
                Regularly update your weak points and review your strategies. Consistent, focused effort on difficult areas yields the best results.
            </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Section Strategies</h2>
        <p className="text-gray-400 mb-6">
          Here is a breakdown of the SAT and ACT sections. You can add your personal strategy for each module to tailor your study plan.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">Subject / Section</th>
                <th scope="col" className="px-6 py-3">Strategy</th>
                <th scope="col" className="px-6 py-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studyPlan.map((item, index) => (
                <tr key={item.subject} className="bg-gray-800 border-b border-gray-700 last:border-b-0">
                  <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {item.subject}
                  </th>
                  <td className="px-6 py-4">
                    {editingIndex === index ? (
                      <textarea
                        value={editText}
                        onChange={handleTextareaChange}
                        className="w-full h-32 p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                        autoFocus
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{item.strategy}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingIndex === index ? (
                      <div className="flex justify-end space-x-2">
                          <button onClick={() => handleSave(index)} className="font-medium text-green-500 hover:underline">Save</button>
                          <button onClick={handleCancel} className="font-medium text-red-500 hover:underline">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(index)} className="font-medium text-blue-500 hover:underline">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanOverview;