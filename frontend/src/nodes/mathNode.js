// mathNode.js

import { memo } from 'react';
import { BaseNode } from './BaseNode';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useNodeField } from '../store/useNodeField';

export const MathNode = memo(({ id, data }) => {
  const [operation, setOperation] = useNodeField(
    id,
    'operation',
    data?.operation || 'add'
  );

  return (
    <BaseNode
      id={id}
      title="Math Node"
      icon={<FunctionsIcon />}
      iconClassName="node-icon-math"
      inputs={[
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ]}
      outputs={[{ id: 'result', label: 'Result' }]}
    >
      <div className="node-field">
        <label className="node-field-label">Operation</label>
        <select
          className="node-field-select"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
          <option value="modulo">Modulo (%)</option>
          <option value="power">Power (^)</option>
        </select>
      </div>
      <p className="node-info-text">
        Performs arithmetic on two numeric inputs.
      </p>
    </BaseNode>
  );
});

MathNode.displayName = 'MathNode';
