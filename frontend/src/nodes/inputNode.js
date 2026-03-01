// inputNode.js

import { memo } from 'react';
import { BaseNode } from './BaseNode';
import InputIcon from '@mui/icons-material/Input';
import { useNodeField } from '../store/useNodeField';

export const InputNode = memo(({ id, data }) => {
  const [currName, setCurrName] = useNodeField(
    id,
    'inputName',
    data?.inputName || id.replace('customInput-', 'input_')
  );
  const [inputType, setInputType] = useNodeField(
    id,
    'inputType',
    data?.inputType || 'Text'
  );

  return (
    <BaseNode
      id={id}
      title="Input Node"
      icon={<InputIcon />}
      iconClassName="node-icon-input"
      inputs={[]}
      outputs={[{ id: 'value', label: 'Value' }]}
    >
      <div className="node-field">
        <label className="node-field-label">Variable Name</label>
        <input
          className="node-field-input"
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="e.g. user_input"
        />
      </div>
      <div className="node-field">
        <label className="node-field-label">Data Type</label>
        <select
          className="node-field-select"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
});

InputNode.displayName = 'InputNode';
