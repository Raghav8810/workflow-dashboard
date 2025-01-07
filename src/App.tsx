import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { AnalyticsPanel } from './components/analytics/AnalyticsPanel';
import { useWorkflowPersistence } from './hooks/useWorkflowPersistence';

function App() {
  useWorkflowPersistence();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar />
      <ReactFlowProvider>
        <div className="flex-1 relative">
          <Canvas />
          <AnalyticsPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;