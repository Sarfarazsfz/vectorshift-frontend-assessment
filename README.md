# VectorShift — Pipeline Builder

![VectorShift](https://img.shields.io/badge/VectorShift-Assessment-blue)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![React Flow](https://img.shields.io/badge/ReactFlow-Canvas-orange)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-purple)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow?logo=javascript)

## Overview
A visual drag-and-drop pipeline builder built for the VectorShift Frontend Technical Assessment. It enables users to construct graph-based workflows using a React Flow canvas and validates the resulting topology against a FastAPI backend to ensure it forms a valid Directed Acyclic Graph (DAG).

## Screenshots

### Pipeline Builder Canvas
<img width="1918" height="972" alt="image" src="https://github.com/user-attachments/assets/62c45bde-18a2-4afb-92e6-357b818a8a18" />

### Node Connections Example
<img width="1918" height="982" alt="image" src="https://github.com/user-attachments/assets/8f006680-da1a-49b1-ae63-8ab1919ca68a" />

### Text Node Dynamic Variables
<img width="1918" height="975" alt="image" src="https://github.com/user-attachments/assets/c2828dbb-1994-4cde-b341-cbce8c28c177" />

### Pipeline Analysis Result Modal
<img width="1918" height="887" alt="image" src="https://github.com/user-attachments/assets/93af0cdb-bf86-4ff2-a209-d8bed6d8c85f" />

### 🌙 Dark Mode Interface

<img width="1918" height="871" alt="image" src="https://github.com/user-attachments/assets/f0eb7808-b6b3-415d-82fb-3f8f8d7479b1" />

---

## Features
- **Reusable BaseNode abstraction**: A single, flexible wrapper `BaseNode` component powering all node variants, eliminating layout duplication.
- **9 Distinct node types**: A complete set of functional nodes ready for composition.
- **Dynamic TextNode variable handles**: Text areas automatically parse `{{variableName}}` patterns via regex to instantly generate and bind corresponding input handles.
- **Auto-resizing TextNode**: Text nodes dynamically expand their width and height based on user input content utilizing native browser measurements.
- **Backend DAG validation**: Pipeline submissions are routed to the backend for topological sorting to ensure acyclic integrity.
- **Modal result display**: Evaluation metrics including node counts, edge counts, and DAG status are parsed and returned cleanly within a frontend results modal.
- **Drag and drop system**: Seamless component mounting from the sidebar palette directly onto the interactive canvas.

## Node Types Table

| Node | Description |
|---|---|
| InputNode | Entry point for data flowing into the pipeline |
| OutputNode | Terminal node that receives the pipeline's final result |
| TextNode | Template node with dynamic handle generation and auto-resizing |
| LLMNode | Represents a language model execution step |
| MathNode | Performs arithmetic operations on two numeric inputs |
| FilterNode | Filters flow data based on specific conditions |
| ConditionNode | Branches the pipeline based on a boolean expression |
| ImageNode | Handles image input rendering and precise resizing |
| APINode | Configures and wraps external API calls |

## Tech Stack
**Frontend:**
- React
- React Flow
- Zustand
- CSS

**Backend:**
- FastAPI
- Python

## Project Structure
```text
frontend/src/components
frontend/src/nodes
frontend/src/store
frontend/src/styles
backend/main.py
```

## Setup Instructions

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## API Endpoint
### POST `/pipelines/parse`
Evaluates the graph payload and returns the pipeline's topological state.

**Response definition:**
- `num_nodes`: Total count of nodes in the graph.
- `num_edges`: Total count of edges connecting the nodes.
- `is_dag`: Boolean flag representing if the graph is a valid Directed Acyclic Graph (true) or contains cyclic dependencies (false).

## Assessment Requirements Coverage
- **Node abstraction implemented using BaseNode**: The UI shell, default connections, state interactions, and styling are governed centrally.
- **5 additional nodes implemented**: MathNode, FilterNode, ConditionNode, ImageNode, and APINode demonstrate immediate abstraction reuse securely.
- **TextNode dynamic variables implemented**: Raw text input parses safely into independent node handles with duplication detection.
- **Backend integration implemented**: Network topological mapping functions natively without arbitrary external routing logic.

## Implementation Notes
- **Reusable architecture**: The codebase favors a modular architecture to streamline component additions and maintain visual consistency globally.
- **Clean component structure**: Logic splitting emphasizes single-responsibility without over-engineering file paths.
- **React Flow integration**: Core canvases, handles, and edges strictly follow native interaction paradigms.
- **Zustand state management**: A lightweight global store is utilized for tracking canvas element positions, modifications, and edge connectivity payloads securely prior to submission.

---

### Author
**Md Sarfaraz Alam**  
VectorShift Frontend Technical Assessment Submission

- **GitHub:** https://github.com/Sarfarazsfz
- **Email:** sarfaraz.alam.dev@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/faraz4237/
