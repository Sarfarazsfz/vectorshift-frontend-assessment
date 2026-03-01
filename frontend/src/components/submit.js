// submit.js
// Sends pipeline data to the backend and displays results in a centered modal.

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

// Centered Result Modal
const ResultModal = ({ data, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-accent" />

      <div className="modal-header">
        <div className="modal-header-left">
          <span className="modal-icon">
            <BarChartIcon />
          </span>
          <h2 className="modal-title">Pipeline Analysis</h2>
        </div>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon fontSize="small" />
        </button>
      </div>

      <div className="modal-divider" />

      <div className="modal-stats">
        <div className="modal-stat-row">
          <span className="modal-stat-label">Number of Nodes</span>
          <span className="modal-stat-value">{data.num_nodes}</span>
        </div>
        <div className="modal-stat-row">
          <span className="modal-stat-label">Number of Edges</span>
          <span className="modal-stat-value">{data.num_edges}</span>
        </div>
        <div className="modal-stat-row">
          <span className="modal-stat-label">Is DAG</span>
          <span
            className={`modal-badge ${data.is_dag ? 'modal-badge-yes' : 'modal-badge-no'
              }`}
          >
            {data.is_dag ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="modal-footer">
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);

// Submit Button + Modal Controller
export const SubmitButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      toast.error('Add some nodes to the canvas first.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://vectorshift-backend-mai0.onrender.com/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      toast.error(err.message || 'Failed to analyze pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-container">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          {loading ? (
            <span className="spinner" />
          ) : (
            <PlayArrowIcon />
          )}
          <span>{loading ? 'Analyzing...' : 'Run Pipeline'}</span>
        </button>
      </div>

      {result && createPortal(
        <ResultModal data={result} onClose={() => setResult(null)} />,
        document.body
      )}
    </>
  );
};
