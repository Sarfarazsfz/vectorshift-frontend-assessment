import { useTheme } from './ThemeContext';
import WidgetsIcon from '@mui/icons-material/Widgets';

export const TemplatesButton = ({ onClick }) => {
    return (
        <button className="templates-btn" onClick={onClick} type="button">
            <WidgetsIcon fontSize="small" />
            <span>Templates</span>
        </button>
    );
};
