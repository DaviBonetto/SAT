
import type { Section, StudyPlan, TopicCategory } from './types';
import { BarChartIcon, CalendarIcon, TargetIcon, BookIcon, BrainIcon, ClockIcon, CheckSquareIcon } from './components/Icons';

export const SECTIONS: Section[] = [
  { id: 'overview', title: 'Study Plan Overview', icon: <BarChartIcon /> },
  { id: 'schedule', title: 'Study Schedule', icon: <CalendarIcon /> },
  { id: 'tests', title: 'Practice Tests Tracker', icon: <TargetIcon /> },
  { id: 'resources', title: 'Resources', icon: <BookIcon /> },
  { id: 'weak-points', title: 'Weak Points & Strategy', icon: <BrainIcon /> },
  { id: 'countdown', title: 'Countdown Timer', icon: <ClockIcon /> },
  { id: 'mastery', title: 'Topics Mastery', icon: <CheckSquareIcon /> },
];

export const INITIAL_STUDY_PLAN: StudyPlan[] = [
    { subject: 'SAT Reading', strategy: 'Focus on identifying main ideas and evidence-based questions. Practice with official College Board materials.' },
    { subject: 'SAT Writing and Language', strategy: 'Master grammar rules, especially punctuation and sentence structure. Learn common idioms.' },
    { subject: 'SAT Math (No Calculator)', strategy: 'Strengthen core algebra and geometry concepts. Practice mental math and time management.' },
    { subject: 'SAT Math (Calculator)', strategy: 'Focus on data analysis, problem-solving, and advanced topics. Know when and how to use the calculator effectively.' },
    { subject: 'ACT English', strategy: 'Similar to SAT Writing. Focus on rhetoric skills and concise expression.' },
    { subject: 'ACT Math', strategy: 'Broader scope than SAT, including trigonometry. Pace is key; aim for 1 minute per question.' },
    { subject: 'ACT Reading', strategy: 'Time is tight. Practice skimming passages and locating specific information quickly.' },
    { subject: 'ACT Science', strategy: 'This is a reading and data interpretation test, not a science knowledge test. Practice reading graphs and tables quickly.' },
];

export const INITIAL_TOPIC_CATEGORIES: TopicCategory[] = [
    { id: 'math', name: 'Math', topics: [
      { id: 'm1', name: 'Heart of Algebra', mastered: false },
      { id: 'm2', name: 'Problem Solving and Data Analysis', mastered: false },
      { id: 'm3', name: 'Passport to Advanced Math', mastered: false },
      { id: 'm4', name: 'Additional Topics in Math (Geometry, Trigonometry)', mastered: false },
    ]},
    { id: 'reading', name: 'Reading', topics: [
      { id: 'r1', name: 'Command of Evidence', mastered: false },
      { id: 'r2', name: 'Words in Context', mastered: false },
      { id: 'r3', name: 'Analysis in History/Social Studies', mastered: false },
      { id: 'r4', name: 'Analysis in Science', mastered: false },
    ]},
    { id: 'writing', name: 'Writing & Language', topics: [
      { id: 'w1', name: 'Expression of Ideas', mastered: false },
      { id: 'w2', name: 'Standard English Conventions', mastered: false },
      { id: 'w3', name: 'Punctuation & Grammar', mastered: false },
    ]},
    { id: 'science', name: 'ACT Science', topics: [
        { id: 's1', name: 'Data Representation', mastered: false },
        { id: 's2', name: 'Research Summaries', mastered: false },
        { id: 's3', name: 'Conflicting Viewpoints', mastered: false },
    ]}
];