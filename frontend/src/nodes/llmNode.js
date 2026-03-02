import { memo } from 'react';
import { BaseNode } from './BaseNode';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNodeField } from '../store/useNodeField';

export const LLMNode = memo(({ id, data }) => {
  const [model, setModel] = useNodeField(
    id,
    'model',
    data?.model || 'gpt-4'
  );

  return (
    <BaseNode
      id={id}
      title="LLM Node"
      icon={<SmartToyIcon />}
      iconClassName="node-icon-llm"
      inputs={[
        { id: 'system', label: 'System' },
        { id: 'prompt', label: 'Prompt' },
      ]}
      outputs={[{ id: 'response', label: 'Response' }]}
    >
      <div className="node-field">
        <label className="node-field-label">Model</label>
        <select
          className="node-field-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3-opus">Claude 3 Opus</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>
      <p className="node-info-text">
        Processes prompts using a large language model and returns a text response.
      </p>
    </BaseNode>
  );
});

LLMNode.displayName = 'LLMNode';
