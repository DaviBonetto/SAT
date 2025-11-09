
import React from 'react';
import type { Section } from '../types';
import { SECTIONS } from '../constants';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, setOpen }) => {
  const handleSectionClick = (section: Section) => {
    setActiveSection(section);
    if(window.innerWidth < 1024) { // Close sidebar on mobile after selection
        setOpen(false);
    }
  };
    
  return (
    <>
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setOpen(false)}>
      </div>
      <aside className={`fixed lg:relative z-40 lg:z-auto flex flex-col w-64 bg-gray-800 text-gray-300 h-full transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">SAT/ACT Prep Hub</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSectionClick(section);
              }}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeSection.id === section.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{section.icon}</span>
              {section.title}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
