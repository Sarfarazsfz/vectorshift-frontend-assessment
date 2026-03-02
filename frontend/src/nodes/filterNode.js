import { memo } from 'react';
import { BaseNode } from './BaseNode';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNodeField } from '../store/useNodeField';

export const FilterNode = memo(({ id, data }) => {
  const [field, setField] = useNodeField(id, 'field', data?.field || '');
  const [condition, setCondition] = useNodeField(id, 'condition', data?.condition || 'equals');
  const [value, setValue] = useNodeField(id, 'value', data?.value || '');

  return (
    <BaseNode
      id={id}
      title="Filter Node"
      icon={<FilterAltIcon />}
      iconClassName="node-icon-filter"
      inputs={[{ id: 'data_in', label: 'Data' }]}
      outputs={[
        { id: 'passed', label: 'Passed' },
        { id: 'rejected', label: 'Rejected' },
      ]}
    >
      <div className="node-field">
        <label className="node-field-label">Field</label>
        <input
          className="node-field-input"
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="e.g. age, name"
        />
      </div>
      <div className="node-field">
        <label className="node-field-label">Condition</label>
        <select
          className="node-field-select"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="contains">Contains</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
          <option value="regex">Regex Match</option>
        </select>
      </div>
      <div className="node-field">
        <label className="node-field-label">Value</label>
        <input
          className="node-field-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Filter value"
        />
      </div>
    </BaseNode>
  );
});

FilterNode.displayName = 'FilterNode';
