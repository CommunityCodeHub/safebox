

import React from 'react';
import { Box, IconButton, List, ListItemText, Divider, ListItemButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';

interface IHelpComponentProps {
  onClose: () => void;
}

const menuItems = [
  { label: 'About SafeBox', file: 'about-safebox.md' },
  { label: 'Getting Started', file: 'getting-started.md' },
  { label: 'Features', file: 'features.md' },
  { label: 'Security', file: 'security.md' },
  { label: 'FAQ', file: 'faq.md' },
  { label: 'Contact', file: 'contact.md' },

];

const HelpComponent: React.FC<IHelpComponentProps> = (props) => {
  const [helpContent, setHelpContent] = React.useState<string>('');
  const [activeMenu, setActiveMenu] = React.useState<string>(menuItems[0].label);

  const fetchMarkdown = (file: string, label: string) => {
    setActiveMenu(label);
    fetch(`../assets/help/${file}`)
      .then(res => res.text())
      .then(md => setHelpContent(md))
      .catch(() => setHelpContent('Help content could not be loaded.'));
  };

  React.useEffect(() => {
    // Load the first menu item's markdown by default
    fetchMarkdown(menuItems[0].file, menuItems[0].label);
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '80vh', width: '100%' }}>
      {/* Left Panel: Menu */}
      <Box sx={{ width: '20%', minWidth: 120, maxWidth: 220, bgcolor: '#f0f0f0', borderRight: '1px solid #ddd', p: 2, position: 'relative' }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          {menuItems.map(item => (
            <ListItemButton
              key={item.label}
              selected={activeMenu === item.label}
              onClick={() => fetchMarkdown(item.file, item.label)}
              component="a"
              sx={{ cursor: 'pointer', color: activeMenu === item.label ? 'primary.main' : 'inherit' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      {/* Right Panel: Static HTML Content */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto', position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <ReactMarkdown components={{
          a: ({ href, children }) => (
            <a
              href={href}
              onClick={e => {
                e.preventDefault();
                if (href) window.api.openExternal(href);
              }}
              style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
            >
              {children}
            </a>
          )
        }}
        >{helpContent}</ReactMarkdown>
      </Box>
    </Box>
  );
}

export default HelpComponent;