import React, { useState } from 'react';
import { Circle, Square, Diamond, Play, FileDown, Menu, X } from 'lucide-react';
import { NodeProperties } from './NodeProperties';
import { useWorkflowStore } from '../store/DashboardStore';
import { Button } from './ui/button';

/**
 * Defines the available node types with their corresponding icons and labels.
 * Each type represents a node that can be dragged into the workflow.
 */
const nodeTypes = [
  { type: 'start', icon: Play, label: 'Start' },
  { type: 'task', icon: Square, label: 'Task' },
  { type: 'decision', icon: Diamond, label: 'Decision' },
  { type: 'end', icon: Circle, label: 'End' },
];

/**
 * Sidebar component provides a draggable area for selecting node types and editing
 * node properties. It also allows for workflow import/export, undo/redo actions,
 * and simulation control (start/stop).
 * 
 * @returns {JSX.Element} The rendered Sidebar component.
 */
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
  // State to handle mobile sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  /**
 * Handles the drag start event for a node type. It sets the node type as data
 * in the drag event to be used by the React Flow editor.
 * 
 * @param {React.DragEvent} event - The drag event triggered by the user.
 * @param {string} nodeType - The type of node being dragged (e.g., 'start', 'task').
 */
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  /**
  * Handles the import of a workflow from a file. It reads the selected file,
  * parses its contents, and imports the workflow data into the application.
  * 
  * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered by file selection.
  */
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

  /**
  * Handles exporting the current workflow as a JSON file. It creates a blob from
  * the workflow data and triggers a download of the file.
  */
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
    <>

      <div className={`w-full md:w-64 ${isSidebarOpen ? 'h-12' : 'h-auto'
        } md:h-screen bg-[#FFFAEC] border-b md:border-r border-gray-200 overflow-hidden  transition-all duration-500 ease-in-out`}>
        {/* Mobile Sidebar Toggle Button */}
        <button
          className={`md:hidden p-4 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'rotate-90' : 'rotate-0'
            }`} // Animation for rotation on mobile toggle
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
        </button>
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Node Types</h2>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
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
          {/*actions buttons */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Actions</h3>

            <div className="flex space-x-2">
              <Button
                onClick={undo}
                className="px-9 py-1 bg-[#578E7E] rounded hover:bg-[#8cbaad] font-medium"
              >
                Undo
              </Button>
              <Button
                onClick={redo}
                className="px-9 py-1 bg-[#578E7E] rounded hover:bg-[#8cbaad] font-medium"
              >
                Redo
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleExport}
                className="px-5 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FileDown />
                Export
              </Button>
              <label className="px-[30px] py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
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
              <Button
                onClick={isSimulating ? stopSimulation : startSimulation}
                className={`px-3 py-1 rounded w-full ${isSimulating
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
              >
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};