import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { PracticeTest } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from '../components/Icons';

const PracticeTestsTracker: React.FC = () => {
  const [tests, setTests] = useLocalStorage<PracticeTest[]>('practiceTests', []);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentTest, setCurrentTest] = useState<Partial<PracticeTest>>({ type: 'SAT' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['totalScore', 'reading', 'writing', 'math', 'science'].includes(name);
    setCurrentTest(prev => ({ ...prev, [name]: isNumberField ? parseInt(value) || 0 : value }));
  };

  const addOrUpdateTest = () => {
    if (!currentTest.date || !currentTest.totalScore) return;
    if (isEditing) {
      setTests(prev => prev.map(test => test.id === isEditing ? { ...test, ...currentTest } as PracticeTest : test));
      setIsEditing(null);
    } else {
      const newTest: PracticeTest = {
        id: new Date().toISOString(),
        type: 'SAT',
        date: '',
        totalScore: 0,
        reading: 0,
        writing: 0,
        math: 0,
        observations: '',
        ...currentTest,
      };
      if (newTest.type === 'SAT') delete newTest.science;
      setTests(prev => [...prev, newTest]);
    }
    setCurrentTest({ type: 'SAT' });
  };
  
  const editTest = (test: PracticeTest) => {
    setIsEditing(test.id);
    setCurrentTest(test);
  };
  
  const deleteTest = (id: string) => {
    // FIX: Remove confirmation dialog to ensure state update is not interrupted.
    setTests(prev => prev.filter(test => test.id !== id));
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setCurrentTest({ type: 'SAT' });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{isEditing ? 'Edit Test Record' : 'Add New Test Record'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select name="type" value={currentTest.type || 'SAT'} onChange={handleInputChange} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option>SAT</option>
            <option>ACT</option>
          </select>
          <input type="date" name="date" value={currentTest.date || ''} onChange={handleInputChange} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-300" />
          <input type="number" name="totalScore" value={currentTest.totalScore || ''} onChange={handleInputChange} placeholder="Total Score" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="number" name="reading" value={currentTest.reading || ''} onChange={handleInputChange} placeholder="Reading Score" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="number" name="writing" value={currentTest.writing || ''} onChange={handleInputChange} placeholder="Writing Score" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input type="number" name="math" value={currentTest.math || ''} onChange={handleInputChange} placeholder="Math Score" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          {currentTest.type === 'ACT' && (
            <input type="number" name="science" value={currentTest.science || ''} onChange={handleInputChange} placeholder="Science Score" className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          )}
          <textarea name="observations" value={currentTest.observations || ''} onChange={handleInputChange} placeholder="Observations" rows={2} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 md:col-span-full focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div className="mt-4 flex space-x-2">
            <button onClick={addOrUpdateTest} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center">
              <PlusIcon /> <span className="ml-2">{isEditing ? 'Update Test' : 'Add Test'}</span>
            </button>
            {isEditing && <button onClick={cancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200">Cancel</button>}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Reading</th>
              <th className="px-4 py-3">Writing</th>
              <th className="px-4 py-3">Math</th>
              {tests.some(t => t.type === 'ACT') && <th className="px-4 py-3">Science</th>}
              <th className="px-4 py-3">Observations</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(test => (
              <tr key={test.id} className="border-b border-gray-700">
                <td className="px-4 py-2 font-medium text-white">{test.type}</td>
                <td className="px-4 py-2">{test.date}</td>
                <td className="px-4 py-2 text-white font-bold">{test.totalScore}</td>
                <td className="px-4 py-2">{test.reading}</td>
                <td className="px-4 py-2">{test.writing}</td>
                <td className="px-4 py-2">{test.math}</td>
                {tests.some(t => t.type === 'ACT') && <td className="px-4 py-2">{test.science ?? 'N/A'}</td>}
                <td className="px-4 py-2 max-w-xs truncate">{test.observations}</td>
                <td className="px-4 py-2 flex justify-end space-x-2">
                  <button onClick={() => editTest(test)} className="p-1 text-blue-400 hover:text-blue-300"><EditIcon /></button>
                  <button onClick={() => deleteTest(test.id)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon /></button>
                </td>
              </tr>
            ))}
            {tests.length === 0 && (
                <tr>
                    <td colSpan={tests.some(t => t.type === 'ACT') ? 9 : 8} className="text-center py-8 text-gray-500">No practice tests logged yet.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PracticeTestsTracker;