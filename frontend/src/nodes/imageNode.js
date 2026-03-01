// imageNode.js

import { useEffect, useState, memo } from 'react';
import { BaseNode } from './BaseNode';
import ImageIcon from '@mui/icons-material/Image';
import { useNodeField } from '../store/useNodeField';

export const ImageNode = memo(({ id, data }) => {
  const [url, setUrl] = useNodeField(id, 'url', data?.url || '');
  const [resize, setResize] = useNodeField(id, 'resize', data?.resize || '100');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [url]);

  return (
    <BaseNode
      id={id}
      title="Image Node"
      icon={<ImageIcon />}
      iconClassName="node-icon-image"
      inputs={[{ id: 'image_in', label: 'Input' }]}
      outputs={[{ id: 'image_out', label: 'Output' }]}
    >
      <div className="node-field">
        <label className="node-field-label">Image URL</label>
        <input
          className="node-field-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.png"
        />
      </div>
      <div className="node-image-preview">
        {url && !hasError ? (
          <img
            src={url}
            alt="Preview"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="node-image-placeholder">
            {url ? 'Unable to load image' : 'No preview available'}
          </span>
        )}
      </div>
      <div className="node-field">
        <label className="node-field-label">Resize (%)</label>
        <input
          className="node-field-input"
          type="number"
          value={resize}
          onChange={(e) => setResize(e.target.value)}
          min="1"
          max="500"
        />
      </div>
    </BaseNode>
  );
});

ImageNode.displayName = 'ImageNode';
