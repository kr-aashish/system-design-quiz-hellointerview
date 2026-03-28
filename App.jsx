import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, CheckCircle2, LayoutGrid, BookOpen, ExternalLink, PlayCircle } from 'lucide-react';
import quizState from './quiz-state.json';

import ContentionQuiz from './contention-quiz';
import LargeBlobsQuiz from './handling-large-blobs-quiz';
import MultiStepQuiz from './multi-step-processes-quiz';
import RealTimeUpdatesQuiz from './real-time-updates-quiz';
import ScalingReadsQuiz from './scaling-reads-quiz';
import ScalingWritesQuiz from './scaling-writes-quiz';
import LongRunningTasksQuiz from './managing-long-running-tasks-quiz';
import DataModelingQuiz from './data-modeling-quiz';

// Map output file names to imported components
const componentsMap = {
  'contention-quiz.jsx': ContentionQuiz,
  'handling-large-blobs-quiz.jsx': LargeBlobsQuiz,
  'managing-long-running-tasks-quiz.jsx': LongRunningTasksQuiz,
  'multi-step-processes-quiz.jsx': MultiStepQuiz,
  'real-time-updates-quiz.jsx': RealTimeUpdatesQuiz,
  'scaling-reads-quiz.jsx': ScalingReadsQuiz,
  'scaling-writes-quiz.jsx': ScalingWritesQuiz,
  'data-modeling-quiz.jsx': DataModelingQuiz,
};

function Index() {
  // Group topics by category
  const topicsByCategory = quizState.topics.reduce((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#1c2331] text-slate-300 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <BookOpen className="text-teal-500" />
            System Design Learning Paths
          </h1>
          <a
            href="https://www.hellointerview.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors border border-slate-700 max-sm:hidden"
          >
            <ExternalLink size={16} className="text-slate-400" />
            Dashboard
          </a>
        </div>
        
        <div className="space-y-4 bg-[#232a3b] p-6 rounded-xl border border-[#2d3748] shadow-2xl">
          {Object.entries(topicsByCategory).map(([category, items]) => (
            <CategorySection key={category} category={category} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, items }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full text-left font-semibold text-slate-200 hover:text-white transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
      >
        <LayoutGrid className="w-5 h-5 text-slate-400" />
        <span className="text-lg">{category}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 ml-auto text-slate-500" />
        ) : (
          <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />
        )}
      </button>

      {isOpen && (
        <ul className="mt-1 pl-[18px] border-l border-[#374151] ml-[14px] space-y-1">
          {items.map(item => {
            const isCompleted = item.status === 'completed';
            const hasQuiz = item.outputFile && componentsMap[item.outputFile];
            
            return (
              <li key={item.slug}>
                <div className="flex items-center gap-3 group px-4 py-2.5 rounded-lg hover:bg-[#2d3748] transition-colors cursor-default">
                  <CheckCircle2 
                    className={`w-5 h-5 shrink-0 ${isCompleted ? 'text-[#14b8a6]' : 'text-slate-600'}`} 
                  />
                  
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-[15px] font-medium transition-colors ${isCompleted ? 'text-[#14b8a6]' : 'text-slate-300 group-hover:text-white'}`}>
                      {item.name}
                    </span>
                    
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {hasQuiz && (
                        <Link 
                          to={`/${item.slug}`}
                          className="flex items-center gap-1.5 text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1.5 rounded-md hover:bg-teal-500/20 transition-colors font-semibold"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          Take Quiz
                        </Link>
                      )}
                      <a 
                        href={`https://www.hellointerview.com${item.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1.5 rounded-md hover:bg-blue-500/20 transition-colors font-semibold"
                        title="Read Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Article
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {quizState.topics.filter(t => t.outputFile && componentsMap[t.outputFile]).map((quiz) => {
          const Component = componentsMap[quiz.outputFile];
          return (
            <Route 
              key={quiz.slug} 
              path={`/${quiz.slug}`} 
              element={<Component />} 
            />
          );
        })}
      </Routes>
    </HashRouter>
  );
}
