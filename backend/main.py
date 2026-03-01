from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict, deque

app = FastAPI()

# Allow frontend on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://vectorshift-frontend-assessment.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def check_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """
    Determines whether the graph is a DAG using Kahn's algorithm.
    Returns True if the graph is acyclic (a valid DAG), False if a cycle exists.

    Kahn's algorithm works by:
    1. Computing in-degree for every node.
    2. Starting BFS from all nodes with in-degree 0.
    3. For each processed node, decrement in-degree of its neighbors.
    4. If all nodes are processed, no cycle exists → DAG.
    If some nodes remain unprocessed, a cycle exists → not a DAG.
    """
    # Collect all unique node IDs
    node_ids = set()
    for node in nodes:
        node_ids.add(node["id"])

    # Handle trivial cases
    if len(node_ids) == 0:
        return True

    # Build adjacency list and in-degree map
    adj = defaultdict(list)
    in_degree = {nid: 0 for nid in node_ids}

    for edge in edges:
        src = edge.get("source", "")
        tgt = edge.get("target", "")

        # Only consider edges between known nodes
        if src in node_ids and tgt in node_ids:
            # Self-loop is an immediate cycle
            if src == tgt:
                return False
            adj[src].append(tgt)
            in_degree[tgt] += 1

    # BFS: start from all nodes with in-degree 0
    queue = deque()
    for nid in node_ids:
        if in_degree[nid] == 0:
            queue.append(nid)

    processed = 0
    while queue:
        current = queue.popleft()
        processed += 1
        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we couldn't process all nodes, a cycle exists
    return processed == len(node_ids)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineRequest):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = check_dag(pipeline.nodes, pipeline.edges)

    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=dag,
    )
