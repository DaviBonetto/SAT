import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { ScheduleItem } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from '../components/Icons';

const StudySchedule: React.FC = () => {
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('studySchedule', []);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Partial<ScheduleItem>>({ testType: 'General' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: name === 'week' || name === 'studyHours' ? parseInt(value) || 0 : value }));
  };

  const addOrUpdateItem = () => {
    if (!currentItem.focusArea) return;
    if (isEditing) {
      setSchedule(prev => prev.map(item => item.id === isEditing ? { ...item, ...currentItem } as ScheduleItem : item));
      setIsEditing(null);
    } else {
      const newItem: ScheduleItem = {
        id: new Date().toISOString(),
        week: 1,
        focusArea: '',
        studyHours: 0,
        materials: '',
        status: 'Not Started',
        notes: '',
        dateRange: '',
        testType: 'General',
        ...currentItem
      };
      setSchedule(prev => [...prev, newItem]);
    }
    setCurrentItem({ testType: 'General' });
  };

  const editItem = (item: ScheduleItem) => {
    setIsEditing(item.id);
    setCurrentItem(item);
  };

  const deleteItem = (id: string) => {
    // FIX: Remove confirmation dialog to ensure state update is not interrupted.
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setCurrentItem({ testType: 'General' });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{isEditing ? 'Edit Schedule Item' : 'Add New Schedule Item'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" name="focusArea" value={currentItem.focusArea || ''} onChange={handleInputChange} placeholder="Focus Area" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="text" name="dateRange" value={currentItem.dateRange || ''} onChange={handleInputChange} placeholder="Date Range" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <select name="testType" value={currentItem.testType || 'General'} onChange={handleInputChange} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option>General</option>
            <option>SAT</option>
            <option>ACT</option>
          </select>
          <input type="number" name="week" value={currentItem.week || ''} onChange={handleInputChange} placeholder="Week" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="number" name="studyHours" value={currentItem.studyHours || ''} onChange={handleInputChange} placeholder="Study Hours" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="text" name="materials" value={currentItem.materials || ''} onChange={handleInputChange} placeholder="Materials" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <select name="status" value={currentItem.status || 'Not Started'} onChange={handleInputChange} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <textarea name="notes" value={currentItem.notes || ''} onChange={handleInputChange} placeholder="Notes" rows={1} className="md:col-span-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="mt-4 flex space-x-2">
            <button onClick={addOrUpdateItem} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center">
              <PlusIcon /> <span className="ml-2">{isEditing ? 'Update Item' : 'Add Item'}</span>
            </button>
            {isEditing && <button onClick={cancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200">Cancel</button>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th className="px-4 py-3">Week</th>
              <th className="px-4 py-3">Date Range</th>
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3">Focus Area</th>
              <th className="px-4 py-3">Hours</th>
              <th className="px-4 py-3">Materials</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(item => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{item.week}</td>
                <td className="px-4 py-2 text-white">{item.dateRange}</td>
                 <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.testType === 'SAT' ? 'bg-blue-800 text-blue-300' :
                        item.testType === 'ACT' ? 'bg-red-800 text-red-300' : 'bg-gray-600 text-gray-300'
                    }`}>{item.testType}</span>
                </td>
                <td className="px-4 py-2 font-medium text-white">{item.focusArea}</td>
                <td className="px-4 py-2">{item.studyHours}</td>
                <td className="px-4 py-2">{item.materials}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Completed' ? 'bg-green-800 text-green-300' :
                      item.status === 'In Progress' ? 'bg-yellow-800 text-yellow-300' : 'bg-gray-600 text-gray-300'
                  }`}>{item.status}</span>
                </td>
                <td className="px-4 py-2 max-w-xs truncate">{item.notes}</td>
                <td className="px-4 py-2 flex justify-end space-x-2">
                  <button onClick={() => editItem(item)} className="p-1 text-blue-400 hover:text-blue-300"><EditIcon /></button>
                  <button onClick={() => deleteItem(item.id)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
                </td>
              </tr>
            ))}
             {schedule.length === 0 && (
                <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">No schedule items added yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudySchedule;