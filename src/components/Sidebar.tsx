import React from 'react';
import { Circle, Square, Diamond, Play } from 'lucide-react';
import { NodeProperties } from './NodeProperties';
import { useWorkflowStore } from '../store/workflowStore';

const nodeTypes = [
  { type: 'start', icon: Play, label: 'Start' },
  { type: 'task', icon: Square, label: 'Task' },
  { type: 'decision', icon: Diamond, label: 'Decision' },
  { type: 'end', icon: Circle, label: 'End' },
];

export const Sidebar: React.FC = () => {
  const { 
    exportWorkflow, 
    importWorkflow, 
    undo, 
    redo, 
    startSimulation, 
    stopSimulation,
    isSimulating 
  } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importWorkflow(content);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const jsonString = exportWorkflow();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full md:w-64 h-auto md:h-screen bg-[#FFFAEC] border-b md:border-r border-gray-200 overflow-auto">
    
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Node Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {nodeTypes.map(({ type, icon: Icon, label }) => (
              <div
                key={type}
                className="flex items-center p-2 bg-[#F5ECD5] rounded cursor-move hover:bg-[#578E7E]"
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                
              >
                <Icon className="w-5 h-5 mr-2" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <NodeProperties />
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          
          <div className="flex space-x-2">
            <button
              onClick={undo}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Undo
            </button>
            <button
              onClick={redo}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Redo
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export
            </button>
            <label className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <button
              onClick={isSimulating ? stopSimulation : startSimulation}
              className={`px-3 py-1 rounded w-full ${
                isSimulating
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};