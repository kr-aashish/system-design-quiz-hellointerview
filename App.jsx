import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ContentionQuiz from './contention-quiz';
import LargeBlobsQuiz from './handling-large-blobs-quiz';
import MultiStepQuiz from './multi-step-processes-quiz';
import RealTimeUpdatesQuiz from './real-time-updates-quiz';
import ScalingReadsQuiz from './scaling-reads-quiz';
import ScalingWritesQuiz from './scaling-writes-quiz';
import LongRunningTasksQuiz from './managing-long-running-tasks-quiz';

const QUIZZES = [
  { path: '/contention', title: 'Contention Quiz', component: ContentionQuiz },
  { path: '/large-blobs', title: 'Handling Large Blobs Quiz', component: LargeBlobsQuiz },
  { path: '/managing-long-running-tasks', title: 'Managing Long-Running Tasks Quiz', component: LongRunningTasksQuiz },
  { path: '/multi-step', title: 'Multi-Step Processes Quiz', component: MultiStepQuiz },
  { path: '/real-time-updates', title: 'Real-Time Updates Quiz', component: RealTimeUpdatesQuiz },
  { path: '/scaling-reads', title: 'Scaling Reads Quiz', component: ScalingReadsQuiz },
  { path: '/scaling-writes', title: 'Scaling Writes Quiz', component: ScalingWritesQuiz },
];

function Index() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">System Design Quizzes</h1>
        <ul className="space-y-3">
          {QUIZZES.map((quiz) => (
            <li key={quiz.path}>
              <Link 
                to={quiz.path}
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-lg font-medium text-blue-600"
              >
                {quiz.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {QUIZZES.map((quiz) => {
          const Component = quiz.component;
          return (
            <Route 
              key={quiz.path} 
              path={quiz.path} 
              element={<Component />} 
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}
