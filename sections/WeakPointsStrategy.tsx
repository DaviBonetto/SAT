
import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { WeakPoint } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from '../components/Icons';

const WeakPointsStrategy: React.FC = () => {
  const [weakPoints, setWeakPoints] = useLocalStorage<WeakPoint[]>('weakPoints', []);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Partial<WeakPoint>>({});
  const [showNotMasteredOnly, setShowNotMasteredOnly] = useLocalStorage('weakPointsFilter', false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setCurrentItem(prev => ({...prev, [name]: checked}));
    } else {
        setCurrentItem(prev => ({ ...prev, [name]: name === 'timesWrong' ? parseInt(value) || 0 : value }));
    }
  };

  const addOrUpdateItem = () => {
    if (!currentItem.topic || !currentItem.subject) return;
    if (isEditing) {
      setWeakPoints(prev => prev.map(item => item.id === isEditing ? { ...item, ...currentItem } as WeakPoint : item));
      setIsEditing(null);
    } else {
      const newItem: WeakPoint = {
        id: new Date().toISOString(),
        topic: '',
        subject: '',
        timesWrong: 1,
        lastReview: new Date().toISOString().split('T')[0],
        strategy: '',
        mastered: false,
        ...currentItem,
      };
      setWeakPoints(prev => [...prev, newItem]);
    }
    setCurrentItem({});
  };

  const editItem = (item: WeakPoint) => {
    setIsEditing(item.id);
    setCurrentItem(item);
  };

  const deleteItem = (id: string) => {
    // FIX: Remove confirmation dialog to ensure state update is not interrupted.
    setWeakPoints(prev => prev.filter(item => item.id !== id));
  };
  
  const toggleMastered = (id: string) => {
    setWeakPoints(prev => prev.map(item => item.id === id ? { ...item, mastered: !item.mastered } : item));
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setCurrentItem({});
  };
  
  const filteredPoints = useMemo(() => {
    return showNotMasteredOnly ? weakPoints.filter(p => !p.mastered) : weakPoints;
  }, [weakPoints, showNotMasteredOnly]);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{isEditing ? 'Edit Weak Point' : 'Add New Weak Point'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="topic" value={currentItem.topic || ''} onChange={handleInputChange} placeholder="Topic (e.g., Comma Splices)" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="text" name="subject" value={currentItem.subject || ''} onChange={handleInputChange} placeholder="Subject (e.g., Writing)" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="number" name="timesWrong" value={currentItem.timesWrong || ''} onChange={handleInputChange} placeholder="Times Wrong" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="date" name="lastReview" value={currentItem.lastReview || ''} onChange={handleInputChange} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-300" />
          <textarea name="strategy" value={currentItem.strategy || ''} onChange={handleInputChange} placeholder="Strategy for Improvement" rows={2} className="md:col-span-2 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="mt-4 flex space-x-2">
          <button onClick={addOrUpdateItem} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center">
            <PlusIcon /><span className="ml-2">{isEditing ? 'Update Item' : 'Add Item'}</span>
          </button>
          {isEditing && <button onClick={cancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200">Cancel</button>}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={showNotMasteredOnly} onChange={(e) => setShowNotMasteredOnly(e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"/>
          <span>Show only "Not Mastered"</span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Times Wrong</th>
              <th className="px-4 py-3">Last Review</th>
              <th className="px-4 py-3">Strategy</th>
              <th className="px-4 py-3">Mastered?</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPoints.map(item => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="px-4 py-2 font-medium text-white">{item.topic}</td>
                <td className="px-4 py-2">{item.subject}</td>
                <td className="px-4 py-2">{item.timesWrong}</td>
                <td className="px-4 py-2">{item.lastReview}</td>
                <td className="px-4 py-2 max-w-xs truncate">{item.strategy}</td>
                <td className="px-4 py-2">
                  <input type="checkbox" checked={item.mastered} onChange={() => toggleMastered(item.id)} className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"/>
                </td>
                <td className="px-4 py-2 flex justify-end space-x-2">
                  <button onClick={() => editItem(item)} className="p-1 text-blue-400 hover:text-blue-300"><EditIcon /></button>
                  <button onClick={() => deleteItem(item.id)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
                </td>
              </tr>
            ))}
            {filteredPoints.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                        {showNotMasteredOnly ? "You've mastered everything!" : "No weak points logged yet. Great start!"}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeakPointsStrategy;