import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Resource, ResourceCategory } from '../types';
import { PlusIcon, TrashIcon, StarIcon, ChevronDownIcon, FileIcon } from '../components/Icons';

const INITIAL_RESOURCES: ResourceCategory[] = [
    { id: 'free', title: 'Free Resources', resources: [], isOpen: true },
    { id: 'books', title: 'Books', resources: [], isOpen: true },
    { id: 'yt', title: 'YouTube Channels', resources: [], isOpen: true },
    { id: 'apps', title: 'Apps', resources: [], isOpen: true },
    { id: 'pdfs', title: 'PDFs & Documents', resources: [], isOpen: true },
];

const Resources: React.FC = () => {
    const [categories, setCategories] = useLocalStorage<ResourceCategory[]>('resources', INITIAL_RESOURCES);
    const [newResourceText, setNewResourceText] = useState('');
    const [newResourceUrl, setNewResourceUrl] = useState('');
    const [newResourceFile, setNewResourceFile] = useState<{name: string, data: string} | null>(null);
    const [resourceType, setResourceType] = useState<'link' | 'file'>('link');
    const [selectedCategory, setSelectedCategory] = useState<string>(INITIAL_RESOURCES[0].id);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if(loadEvent.target?.result) {
                    setNewResourceFile({ name: file.name, data: loadEvent.target.result as string });
                    setNewResourceText(file.name.replace(/\.pdf$/i, ''));
                }
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please upload a valid PDF file.");
        }
    };
  
    const addResource = () => {
      if (!newResourceText.trim()) return;
      
      let newResourceItem: Resource | null = null;

      if (resourceType === 'file' && newResourceFile) {
        newResourceItem = {
            id: new Date().toISOString(),
            text: newResourceText,
            favorite: false,
            type: 'file',
            fileData: newResourceFile.data,
            fileName: newResourceFile.name,
        };
      } else if (resourceType === 'link' && newResourceUrl.trim()) {
        newResourceItem = {
            id: new Date().toISOString(),
            text: newResourceText,
            url: newResourceUrl,
            favorite: false,
            type: 'link',
        };
      }
      
      if (newResourceItem) {
          const targetCategoryId = resourceType === 'file' ? 'pdfs' : selectedCategory;
          setCategories(categories.map(cat => 
            cat.id === targetCategoryId ? { ...cat, resources: [...cat.resources, newResourceItem as Resource] } : cat
          ));
      }
      
      setNewResourceText('');
      setNewResourceUrl('');
      setNewResourceFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    };

    const deleteResource = (categoryId: string, resourceId: string) => {
        setCategories(categories.map(cat => 
            cat.id === categoryId ? { ...cat, resources: cat.resources.filter(r => r.id !== resourceId) } : cat
        ));
    };

    const toggleFavorite = (categoryId: string, resourceId: string) => {
        setCategories(categories.map(cat =>
            cat.id === categoryId ? {
                ...cat,
                resources: cat.resources.map(r => r.id === resourceId ? { ...r, favorite: !r.favorite } : r)
            } : cat
        ));
    };

    const toggleCategory = (categoryId: string) => {
        setCategories(categories.map(cat => cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat));
    };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
        <div className='flex items-center space-x-4 mb-4'>
            <button onClick={() => setResourceType('link')} className={`px-4 py-2 rounded-md font-semibold ${resourceType === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Link</button>
            <button onClick={() => setResourceType('file')} className={`px-4 py-2 rounded-md font-semibold ${resourceType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>PDF File</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <input type="text" value={newResourceText} onChange={(e) => setNewResourceText(e.target.value)} placeholder="Resource Name" className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
            {resourceType === 'link' ? (
                <>
                <input type="url" value={newResourceUrl} onChange={(e) => setNewResourceUrl(e.target.value)} placeholder="https://example.com" className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" disabled={resourceType === 'file'}>
                    {categories.filter(c => c.id !== 'pdfs').map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                </select>
                </>
            ) : (
                <input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500" />
            )}
            <button onClick={addResource} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center">
                <PlusIcon /><span className="ml-2">Add</span>
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => (
            <div key={category.id} className="bg-gray-800 rounded-lg shadow overflow-hidden">
                <button onClick={() => toggleCategory(category.id)} className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 transition-colors">
                    <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                    <ChevronDownIcon className={`transition-transform transform ${category.isOpen ? 'rotate-180' : ''}`} />
                </button>
                {category.isOpen && (
                    <ul className="divide-y divide-gray-700 p-4">
                        {category.resources.length > 0 ? category.resources.sort((a, b) => b.favorite === a.favorite ? 0 : b.favorite ? 1 : -1).map(resource => (
                            <li key={resource.id} className="flex items-center justify-between py-3">
                                {resource.type === 'link' ? (
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 truncate pr-4">{resource.text}</a>
                                ) : (
                                    <a href={resource.fileData} download={resource.fileName} className="text-blue-400 hover:underline hover:text-blue-300 flex items-center truncate pr-4">
                                        <FileIcon />
                                        <span className="ml-2">{resource.text}</span>
                                    </a>
                                )}
                                <div className="flex items-center space-x-3 flex-shrink-0">
                                    <button onClick={() => toggleFavorite(category.id, resource.id)}><StarIcon filled={resource.favorite} /></button>
                                    <button onClick={() => deleteResource(category.id, resource.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                </div>
                            </li>
                        )) : <li className="text-center py-4 text-gray-500">No resources added to this category yet.</li>}
                    </ul>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;