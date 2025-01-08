
# Workflow Builder Application
LIVE: https://workflow-dashboard.vercel.app/

  


Tech Stack I used : 
- React
- typescript
- tailwind css
- React chart
- React flow
- shadcn 

✨ Features:
1. Drag-and-Drop Workflow Builder
Canvas: A resizable, zoomable workspace for creating and modifying workflows.

Nodes: Drag-and-drop functionality for adding node types like Task, Decision, Start, and End.

Connections: Draw lines to connect nodes, simulating directed edges between them.

Node Properties: A sidebar allows users to edit properties such as node name, execution time, and type.

2. Validation
Disconnected Nodes: Highlight nodes that are not connected to the workflow.

Invalid Workflows: Alert users if there are issues like multiple Start nodes in the workflow.

3. Save and Load
Warning on Unsaved Changes: Notify users if they try to navigate away without saving their work.

Local Storage: Save workflows to the browser’s local storage for later access.

4. Dynamic Graph Features
Bar Chart: Visualizes the execution time of each node.
Line Chart: Displays cumulative execution time across connected nodes.
Pie Chart: Shows the distribution of execution times by node type.

5. Graph Features
Tooltips: Show detailed information about each data point when hovered over.

Node Highlighting: Highlight corresponding nodes in the workflow when a graph element is hovered over.

6. Dynamic Features
Rearrange Nodes: Users can drag nodes around, with automatic updates to connections.

Zoom and Pan: Support for zooming in/out and panning the canvas for larger workflows.

7. Responsiveness
Ensure the application works seamlessly on different screen sizes, from mobile to desktop.

8. Simulate Execution
Animation: Animate the workflow execution, highlighting nodes in the sequence they are processed.

9. Export/Import Workflows
Export as JSON: Users can export their workflows as JSON files to continue working on them later.

Import Workflows: Allow users to import previously saved workflows.

10. Undo/Redo
History Management: Implement undo and redo functionality to revert or reapply changes to the workflow.




