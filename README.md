VectorShift — Pipeline Builder
A visual drag-and-drop pipeline builder built as part of the VectorShift Frontend Technical Assessment. Design, connect, and validate node-based pipelines entirely in the browser, with a FastAPI backend that checks whether the resulting graph is a valid DAG.

Screenshots
<!-- Pipeline Builder Canvas -->

<!-- Node Connections & Edge Routing ]()

<!-- DAG Validation Result -->


What it does
Drag nodes from the sidebar onto the canvas, connect them by drawing edges between handles, and click Run Pipeline to send the graph to the backend. The backend returns node/edge counts and whether the graph is a valid directed acyclic graph.
The Text Node has one extra trick: write {{variable}} anywhere in the template and an input handle appears automatically for that variable — in real time, with deduplication.

Nodes
NodePurposeInputEntry point for data flowing into the pipelineOutputTerminal node that receives the final resultTextTemplate node with dynamic {{variable}} handle generationLLMRepresents a language model stepAPIWraps an external API callImageHandles image input or processingMathPerforms a numeric operationFilterFilters data based on a conditionConditionBranches the pipeline on a boolean expression
All nine nodes share a single BaseNode component. Adding a new node type means defining its fields and handles — nothing else.

Tech Stack
Frontend

React 18
React Flow (canvas + edge routing)
Zustand (global pipeline state)
MUI icons
react-hot-toast (submission feedback)
Vanilla CSS (no Tailwind)

Backend

Python / FastAPI
Pydantic for request validation
Kahn's algorithm for DAG detection


Project Structure
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.js            # Root layout — navbar, sidebar, canvas
│   │   │   ├── ui.js             # React Flow canvas setup
│   │   │   ├── toolbar.js        # Sidebar with draggable node cards
│   │   │   ├── submit.js         # Run Pipeline button + API call
│   │   │   ├── draggableNode.js  # Draggable sidebar item
│   │   │   └── ThemeContext.js   # Light/dark mode context
│   │   ├── nodes/
│   │   │   ├── BaseNode.js       # Shared node shell (handles, layout, style)
│   │   │   ├── textNode.js       # Dynamic {{variable}} handle detection
│   │   │   ├── inputNode.js
│   │   │   ├── outputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── apiNode.js
│   │   │   ├── imageNode.js
│   │   │   ├── mathNode.js
│   │   │   ├── filterNode.js
│   │   │   ├── conditionNode.js
│   │   │   └── index.js          # Node type registry
│   │   ├── store/
│   │   │   └── useStore.js       # Zustand pipeline state
│   │   └── styles/
│   │       └── App.css           # All styles, CSS variables, dark mode
│   └── package.json
│
└── backend/
    ├── main.py                   # FastAPI app + /pipelines/parse endpoint
    └── requirements.txt

Getting Started
Prerequisites: Node.js ≥ 16, Python ≥ 3.9
Backend:
bashcd backend
pip install -r requirements.txt
uvicorn main:app --reload
API available at http://localhost:8000.
Frontend:
bashcd frontend
npm install
npm start
Open http://localhost:3000.

API Reference
POST /pipelines/parse
Accepts the current pipeline graph and returns node/edge counts plus DAG validity.
Request body:
json{
  "nodes": [{ "id": "node-1" }, { "id": "node-2" }],
  "edges": [{ "source": "node-1", "target": "node-2" }]
}
Response:
json{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
DAG detection uses Kahn's algorithm (BFS-based topological sort). A pipeline with a cycle returns "is_dag": false.

Features Worth Noting
Text Node {{variable}} detection — parses the textarea in real time with a regex, deduplicates variable names, and renders one input handle per unique variable. The card also auto-resizes its width using a <canvas> measurement pass.
BaseNode abstraction — every node renders through the same shell. Input/output handles, labels, icons, and card styles are all props. No duplicated markup across node types.
Dark mode — implemented via a React context and CSS custom properties. The toggle in the navbar persists across re-renders without any external library.
Responsive sidebar — collapses on mobile with a CSS transform (no layout reflow), and shows an overlay to close it on small screens.
Toast notifications — meaningful success and error states shown after pipeline submission, themed to match the current color mode.

Developed by Md Sarfaraz Alam — VectorShift Frontend Technical Assessment
GitHub · LinkedIn · sarfaraz.alam.dev@gmail.com
