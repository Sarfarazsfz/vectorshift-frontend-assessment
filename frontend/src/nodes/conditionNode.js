// conditionNode.js

import { memo } from 'react';
import { BaseNode } from './BaseNode';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { useNodeField } from '../store/useNodeField';

export const ConditionNode = memo(({ id, data }) => {
  const [field, setField] = useNodeField(id, 'field', data?.field || '');
  const [operator, setOperator] = useNodeField(id, 'operator', data?.operator || '==');
  const [value, setValue] = useNodeField(id, 'value', data?.value || '');

  return (
    <BaseNode
      id={id}
      title="Condition Node"
      icon={<CallSplitIcon />}
      iconClassName="node-icon-condition"
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[
        { id: 'true', label: 'True' },
        { id: 'false', label: 'False' },
      ]}
    >
      <div className="node-field">
        <label className="node-field-label">Field</label>
        <input
          className="node-field-input"
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="e.g. status"
        />
      </div>
      <div className="node-field">
        <label className="node-field-label">Operator</label>
        <select
          className="node-field-select"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          <option value="==">Equals (==)</option>
          <option value="!=">Not Equals (!=)</option>
          <option value=">">Greater Than (&gt;)</option>
          <option value="<">Less Than (&lt;)</option>
          <option value=">=">Greater or Equal (&gt;=)</option>
          <option value="<=">Less or Equal (&lt;=)</option>
          <option value="contains">Contains</option>
          <option value="is_empty">Is Empty</option>
        </select>
      </div>
      <div className="node-field">
        <label className="node-field-label">Value</label>
        <input
          className="node-field-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Comparison value"
        />
      </div>
    </BaseNode>
  );
});

ConditionNode.displayName = 'ConditionNode';
