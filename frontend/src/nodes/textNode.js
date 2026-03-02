import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { BaseNode } from './BaseNode';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useNodeField } from '../store/useNodeField';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_]\w*)\s*\}\}/g;

export const TextNode = memo(({ id, data }) => {
  const [text, setText] = useNodeField(
    id,
    'text',
    data?.text || '{{input}}'
  );
  const [cardWidth, setCardWidth] = useState(210);
  const textareaRef = useRef(null);

  // Extract unique variable names from {{...}} patterns
  const variables = useMemo(() => {
    const matches = [];
    let match;
    const re = new RegExp(VARIABLE_REGEX.source, 'g');
    while ((match = re.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, [text]);

  // Auto-resize textarea height and card width
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Height auto-resize
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    // Width auto-resize based on longest line
    const lines = text.split('\n');
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    ctx.font = '12px Inter, -apple-system, BlinkMacSystemFont, sans-serif';

    let maxLineWidth = 0;
    for (const line of lines) {
      const w = ctx.measureText(line).width;
      if (w > maxLineWidth) maxLineWidth = w;
    }

    // textarea padding (18px) + body padding (20px) + border + extra
    const computed = Math.ceil(maxLineWidth) + 52;
    setCardWidth(Math.max(210, Math.min(computed, 480)));
  }, [text]);

  const dynamicInputs = variables.map((v) => ({ id: v, label: v }));

  return (
    <BaseNode
      id={id}
      title="Text Node"
      icon={<TextFieldsIcon />}
      iconClassName="node-icon-text"
      inputs={dynamicInputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      cardStyle={{ width: cardWidth, minWidth: 210, maxWidth: 480 }}
    >
      <div className="node-field">
        <label className="node-field-label">Template</label>
        <textarea
          ref={textareaRef}
          className="node-field-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder="Type text… use {{variable}} for dynamic inputs"
        />
      </div>
      {variables.length > 0 && (
        <div className="variable-pills">
          {variables.map((v) => (
            <span key={v} className="variable-pill">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
});

TextNode.displayName = 'TextNode';
