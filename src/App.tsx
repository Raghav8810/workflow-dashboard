import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { AnalyticsPanel } from './components/analytics/AnalyticsPanel';
import { useWorkflowPersistence } from './hooks/useWorkflowPersistence';
import { CanvasBoard } from './components/CanvasBoard';

/**
 * App component.
 * 
 * This component manages the layout of the application and is responsible for rendering:
 * - The Sidebar
 * - The CanvasBoard (where the workflow is visualized)
 * - The AnalyticsPanel (showing analytics data related to the workflow)
 * 
 * It also uses the `useWorkflowPersistence` hook to persist the state of the workflow 

 */
function App() {
  useWorkflowPersistence();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />
      <ReactFlowProvider>
        <div className="flex-1 relative">
          <CanvasBoard />
          <AnalyticsPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;