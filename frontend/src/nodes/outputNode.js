import { memo } from 'react';
import { BaseNode } from './BaseNode';
import OutputIcon from '@mui/icons-material/Output';
import { useNodeField } from '../store/useNodeField';

export const OutputNode = memo(({ id, data }) => {
  const [currName, setCurrName] = useNodeField(
    id,
    'outputName',
    data?.outputName || id.replace('customOutput-', 'output_')
  );
  const [outputType, setOutputType] = useNodeField(
    id,
    'outputType',
    data?.outputType || 'Text'
  );

  return (
    <BaseNode
      id={id}
      title="Output Node"
      icon={<OutputIcon />}
      iconClassName="node-icon-output"
      inputs={[{ id: 'value', label: 'Value' }]}
      outputs={[]}
    >
      <div className="node-field">
        <label className="node-field-label">Variable Name</label>
        <input
          className="node-field-input"
          type="text"
          value={currName}
          onChange={(e) => setCurrName(e.target.value)}
          placeholder="e.g. result"
        />
      </div>
      <div className="node-field">
        <label className="node-field-label">Data Type</label>
        <select
          className="node-field-select"
          value={outputType}
          onChange={(e) => setOutputType(e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
});

OutputNode.displayName = 'OutputNode';
