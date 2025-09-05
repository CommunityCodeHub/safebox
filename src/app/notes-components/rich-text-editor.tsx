import React, { useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, ListNode, ListItemNode } from '@lexical/list';
import { $createHeadingNode, HeadingNode, registerRichText } from '@lexical/rich-text';
// Toolbar plugin for formatting

import { Box, Button, Paper, Typography } from '@mui/material';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';

import { $getRoot, EditorState } from 'lexical';

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const format = (command: any, value?: any) => {
    editor.dispatchCommand(command, value);
  };

  const setHeading = (level: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Replace selected blocks with heading nodes
        selection.getNodes().forEach((node: any) => {
          if (node.getType() !== 'heading') {
            node.replace($createHeadingNode(`h${level}`));
          } else {
            node.setTag(`h${level}`);
          }
        });
      }
    });
  };

  return (
    <Box mb={1} display="flex" gap={1}>
      <Button size="small" onClick={() => format(FORMAT_TEXT_COMMAND, 'bold')}>Bold</Button>
      <Button size="small" onClick={() => format(FORMAT_TEXT_COMMAND, 'italic')}>Italic</Button>
      <Button size="small" onClick={() => format(FORMAT_TEXT_COMMAND, 'underline')}>Underline</Button>
      <Button size="small" onClick={() => setHeading(1)}>H1</Button>
      <Button size="small" onClick={() => setHeading(2)}>H2</Button>
      <Button size="small" onClick={() => setHeading(3)}>H3</Button>
      <Button size="small" onClick={() => format(INSERT_UNORDERED_LIST_COMMAND)}>Bulleted List</Button>
      <Button size="small" onClick={() => format(INSERT_ORDERED_LIST_COMMAND)}>Numbered List</Button>
      <Button size="small" onClick={() => format(REMOVE_LIST_COMMAND)}>Remove List</Button>
    </Box>
  );
}


interface RichTextEditorProps {
  initialValue?: string;
  onSave: (content: string) => void;
  onCancel?: () => void;
}

// Lexical theme can be omitted or set to an empty object for default styling
const theme = {};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue = '', onSave, onCancel }) => {
  const editorStateRef = useRef<EditorState | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initialConfig = {
    namespace: 'SafeBoxNotes',
    theme,
    onError(error: Error) {
      throw error;
    },
    nodes: [HeadingNode, ListNode, ListItemNode],
    editorState: initialValue
      ? (editor: any) => {
          try {
            // Lexical expects EditorState.fromJSON
            const state = editor.parseEditorState(initialValue);
            editor.setEditorState(state);
          } catch {
            // fallback to empty
          }
        }
      : undefined,
  };

// Plugin to register rich text behaviors
function RegisterRichTextPlugin(): null {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    return registerRichText(editor);
  }, [editor]);
  return null;
}

  const handleChange = (editorState: EditorState) => {
    editorStateRef.current = editorState;
  };

  const handleSave = () => {
    if (editorStateRef.current) {
      // Use toJSON for Lexical serialization
      const json = JSON.stringify(editorStateRef.current.toJSON());
      onSave(json);
      setShowSaved(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowSaved(false), 10000);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 'auto', margin: '32px auto' }}>
      <Typography variant="h6" gutterBottom>
        Free Text Editor
      </Typography>
      <Box mb={2} sx={{  border: '1px solid #ccc', borderRadius: 1, p: 1, bgcolor: '#fff' }}>
        <LexicalComposer initialConfig={initialConfig}>
          <RegisterRichTextPlugin />
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable style={{ minHeight: '50vh', outline: 'none' }} />}
            placeholder={<div style={{ color: '#aaa' }}>Write your notes here...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
          <AutoFocusPlugin />
        </LexicalComposer>
      </Box>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
        <Box flex={1} display="flex" justifyContent="center">
          {showSaved && (
            <Typography color="success.main" variant="body2" align="center">
              Content saved successfully
            </Typography>
          )}
        </Box>
        <Box display="flex" gap={2}>
          {onCancel && (
            <Button
              variant="outlined"
              color="primary"
              onClick={onCancel}
              sx={{ fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', background: '#f3f6fa', '&:hover': { background: '#e3f2fd', borderColor: 'primary.dark', color: 'primary.dark' } }}
            >
              Cancel
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RichTextEditor;
