import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

const STORAGE_KEY = 'workflow-state';

export const useWorkflowPersistence = () => {
  const { nodes, edges, loadWorkflow } = useWorkflowStore();

  // Load workflow from localStorage on mount
  useEffect(() => {
    const savedWorkflow = localStorage.getItem(STORAGE_KEY);
    if (savedWorkflow) {
      loadWorkflow(JSON.parse(savedWorkflow));
    }
  }, [loadWorkflow]);

  // Save workflow to localStorage when it changes
  useEffect(() => {
    const workflowState = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflowState));
  }, [nodes, edges]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
};