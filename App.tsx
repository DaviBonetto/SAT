import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StudyPlanOverview from './sections/StudyPlanOverview';
import StudySchedule from './sections/StudySchedule';
import PracticeTestsTracker from './sections/PracticeTestsTracker';
import Resources from './sections/Resources';
import WeakPointsStrategy from './sections/WeakPointsStrategy';
import CountdownTimer from './sections/CountdownTimer';
import TopicsMastery from './sections/TopicsMastery';
import { SECTIONS } from './constants';
import type { Section } from './types';
import { DownloadIcon, UploadIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(SECTIONS[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection.id) {
      case 'overview': return <StudyPlanOverview />;
      case 'schedule': return <StudySchedule />;
      case 'tests': return <PracticeTestsTracker />;
      case 'resources': return <Resources />;
      case 'weak-points': return <WeakPointsStrategy />;
      case 'countdown': return <CountdownTimer />;
      case 'mastery': return <TopicsMastery />;
      default: return <StudyPlanOverview />;
    }
  };
  
  const handleExport = useCallback(() => {
    const data: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('prepHub_')) {
        data[key] = JSON.parse(localStorage.getItem(key) as string);
      }
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `sat-act-prep-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }, []);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const data = JSON.parse(text);
            Object.keys(data).forEach(key => {
              if (key.startsWith('prepHub_')) {
                localStorage.setItem(key, JSON.stringify(data[key]));
              }
            });
            alert('Data imported successfully! The page will now reload.');
            window.location.reload();
          }
        } catch (error) {
          alert('Failed to import data. Please check the file format.');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset file input
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div key={activeSection.id} className="max-w-7xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden mr-4 p-2 rounded-md text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                <span className="mr-3">{activeSection.icon}</span>
                {activeSection.title}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleExport} className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 text-sm">
                <DownloadIcon />
                <span className="hidden sm:inline ml-2">Export</span>
              </button>
              <label className="flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer text-sm">
                <UploadIcon />
                <span className="hidden sm:inline ml-2">Import</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;