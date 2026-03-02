import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FunctionsIcon from '@mui/icons-material/Functions';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import ImageIcon from '@mui/icons-material/Image';
import ApiIcon from '@mui/icons-material/Api';

import { InputNode } from './inputNode';
import { OutputNode } from './outputNode';
import { LLMNode } from './llmNode';
import { TextNode } from './textNode';
import { MathNode } from './mathNode';
import { FilterNode } from './filterNode';
import { ImageNode } from './imageNode';
import { APINode } from './apiNode';
import { ConditionNode } from './conditionNode';

// ReactFlow nodeTypes map
export const nodeTypes = {
    customInput: InputNode,
    customOutput: OutputNode,
    llm: LLMNode,
    text: TextNode,
    math: MathNode,
    filter: FilterNode,
    image: ImageNode,
    api: APINode,
    condition: ConditionNode,
};

// Node configuration for the sidebar — grouped by category
export const nodeConfig = [
    {
        category: 'CORE',
        nodes: [
            { type: 'customInput', label: 'Input Node', icon: <InputIcon fontSize="small" /> },
            { type: 'customOutput', label: 'Output Node', icon: <OutputIcon fontSize="small" /> },
            { type: 'text', label: 'Text Node', icon: <TextFieldsIcon fontSize="small" /> },
            { type: 'llm', label: 'LLM Node', icon: <SmartToyIcon fontSize="small" /> },
        ],
    },
    {
        category: 'PROCESSING',
        nodes: [
            { type: 'math', label: 'Math Node', icon: <FunctionsIcon fontSize="small" /> },
            { type: 'filter', label: 'Filter Node', icon: <FilterAltIcon fontSize="small" /> },
            { type: 'condition', label: 'Condition Node', icon: <CallSplitIcon fontSize="small" /> },
        ],
    },
    {
        category: 'INTEGRATION',
        nodes: [
            { type: 'image', label: 'Image Node', icon: <ImageIcon fontSize="small" /> },
            { type: 'api', label: 'API Node', icon: <ApiIcon fontSize="small" /> },
        ],
    },
];

export {
    InputNode,
    OutputNode,
    LLMNode,
    TextNode,
    MathNode,
    FilterNode,
    ImageNode,
    APINode,
    ConditionNode,
};
