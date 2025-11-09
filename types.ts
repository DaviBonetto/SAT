import type { ReactElement } from 'react';

export interface Section {
  id: string;
  title: string;
  // Fix: Cannot find namespace 'JSX'. Replaced JSX.Element with ReactElement.
  icon: ReactElement;
}

export interface StudyPlan {
  subject: string;
  strategy: string;
}

export interface ScheduleItem {
  id: string;
  week: number;
  focusArea: string;
  studyHours: number;
  materials: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  notes: string;
  dateRange: string;
  testType: 'General' | 'SAT' | 'ACT';
}

export interface PracticeTest {
  id: string;
  type: 'SAT' | 'ACT';
  date: string;
  totalScore: number;
  reading: number;
  writing: number;
  math: number;
  science?: number;
  observations: string;
}

export interface Resource {
  id: string;
  text: string;
  url?: string;
  favorite: boolean;
  type: 'link' | 'file';
  fileData?: string;
  fileName?: string;
}


export interface ResourceCategory {
  id: string;
  title: string;
  resources: Resource[];
  isOpen: boolean;
}

export interface WeakPoint {
  id: string;
  topic: string;
  subject: string;
  timesWrong: number;
  lastReview: string;
  strategy: string;
  mastered: boolean;
}

export interface Topic {
  id: string;
  name: string;
  mastered: boolean;
}

export interface TopicCategory {
  id: string;
  name: string;
  topics: Topic[];
}

export interface DailyGoalsData {
  dailyGoal: number;
  weeklyGoal: number;
  streak: number;
  lastCompletedDate: string | null;
  hoursToday: number;
}
// FIX: Add ChatMessage interface for use in AIMentor component.
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
