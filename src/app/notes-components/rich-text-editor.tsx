import React, { useRef, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';

import { $getRoot, $getSelection, EditorState } from 'lexical';


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
      <Box mb={2} sx={{ minHeight: '70vh', border: '1px solid #ccc', borderRadius: 1, p: 1, bgcolor: '#fff' }}>
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable style={{ minHeight: '60vh', outline: 'none' }} />}
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
            <Button variant="outlined" color="secondary" onClick={onCancel}>
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
