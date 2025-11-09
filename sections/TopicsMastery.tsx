import React, { useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Topic, TopicCategory } from '../types';
import { INITIAL_TOPIC_CATEGORIES } from '../constants';
import { PlusIcon, TrashIcon } from '../components/Icons';

const TopicsMastery: React.FC = () => {
  const [categories, setCategories] = useLocalStorage<TopicCategory[]>('topicsMastery', INITIAL_TOPIC_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTopicTexts, setNewTopicTexts] = useState<{[key: string]: string}>({});

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
        const newCategory: TopicCategory = {
            id: new Date().toISOString(),
            name: newCategoryName.trim(),
            topics: []
        };
        setCategories(prevCategories => [...prevCategories, newCategory]);
        setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this entire category and all its topics?')) {
        setCategories(categories.filter(c => c.id !== categoryId));
    }
  };

  const handleAddTopic = (categoryId: string) => {
    const topicText = newTopicTexts[categoryId]?.trim();
    if(topicText) {
        const newTopic: Topic = {
            id: new Date().toISOString(),
            name: topicText,
            mastered: false,
        };
        setCategories(categories.map(cat => 
            cat.id === categoryId ? {...cat, topics: [...cat.topics, newTopic]} : cat
        ));
        setNewTopicTexts(prev => ({...prev, [categoryId]: ''}));
    }
  };

  const handleDeleteTopic = (categoryId: string, topicId: string) => {
    setCategories(categories.map(cat => 
        cat.id === categoryId ? {...cat, topics: cat.topics.filter(t => t.id !== topicId)} : cat
    ));
  };

  const toggleTopicMastery = (categoryId: string, topicId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              topics: category.topics.map(topic =>
                topic.id === topicId ? { ...topic, mastered: !topic.mastered } : topic
              ),
            }
          : category
      )
    );
  };
  
  const overallProgress = useMemo(() => {
    const allTopics = categories.flatMap(c => c.topics);
    if (allTopics.length === 0) return 0;
    const masteredTopics = allTopics.filter(t => t.mastered).length;
    return Math.round((masteredTopics / allTopics.length) * 100);
  }, [categories]);

  return (
    <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Overall Mastery Progress</h2>
            <div className="w-full bg-gray-700 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <p className="text-right text-lg font-semibold mt-2">{overallProgress}% Complete</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => {
            const categoryProgress = useMemo(() => {
                if(category.topics.length === 0) return 0;
                const masteredCount = category.topics.filter(t => t.mastered).length;
                return Math.round((masteredCount / category.topics.length) * 100);
            }, [category.topics]);

            return (
                <div key={category.id} className="bg-gray-800 rounded-lg shadow p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${categoryProgress}%`}}></div>
                    </div>
                    <div className="space-y-3 flex-grow">
                        {category.topics.map(topic => (
                            <div key={topic.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50 transition-colors group">
                                <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                                    <input
                                    type="checkbox"
                                    checked={topic.mastered}
                                    onChange={() => toggleTopicMastery(category.id, topic.id)}
                                    className="h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`${topic.mastered ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                                    {topic.name}
                                    </span>
                                </label>
                                <button onClick={() => handleDeleteTopic(category.id, topic.id)} className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>
                            </div>
                        ))}
                    </div>
                     <div className="mt-4 flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Add new topic"
                            value={newTopicTexts[category.id] || ''}
                            onChange={(e) => setNewTopicTexts(prev => ({...prev, [category.id]: e.target.value}))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTopic(category.id)}
                            className="flex-grow bg-gray-700 border-gray-600 rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={() => handleAddTopic(category.id)} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-md"><PlusIcon /></button>
                     </div>
                </div>
            )
        })}
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
            <div className="flex gap-2">
                <input 
                    type="text"
                    placeholder="New category name (e.g., Essay Writing)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    className="flex-grow bg-gray-700 border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center">
                    <PlusIcon /><span className="ml-2 hidden sm:inline">Add Category</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default TopicsMastery;