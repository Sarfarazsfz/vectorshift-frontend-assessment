import { memo } from 'react';
import { BaseNode } from './BaseNode';
import ApiIcon from '@mui/icons-material/Api';
import { useNodeField } from '../store/useNodeField';

const METHOD_COLORS = {
  GET: 'method-get',
  POST: 'method-post',
  PUT: 'method-put',
  DELETE: 'method-delete',
};

export const APINode = memo(({ id, data }) => {
  const [method, setMethod] = useNodeField(id, 'method', data?.method || 'GET');
  const [url, setUrl] = useNodeField(id, 'url', data?.url || '');

  return (
    <BaseNode
      id={id}
      title="API Node"
      icon={<ApiIcon />}
      iconClassName="node-icon-api"
      inputs={[{ id: 'body', label: 'Body' }]}
      outputs={[{ id: 'response', label: 'Response' }]}
    >
      <div className="node-field">
        <label className="node-field-label">Method</label>
        <select
          className="node-field-select"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {Object.keys(METHOD_COLORS).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="method-badge-wrapper">
        <span className={`method-badge ${METHOD_COLORS[method]}`}>{method}</span>
      </div>
      <div className="node-field">
        <label className="node-field-label">Endpoint URL</label>
        <input
          className="node-field-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/data"
        />
      </div>
    </BaseNode>
  );
});

APINode.displayName = 'APINode';
