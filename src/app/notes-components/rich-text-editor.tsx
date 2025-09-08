// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
// import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, ListNode, ListItemNode } from '@lexical/list';
// import { $createHeadingNode, HeadingNode, registerRichText } from '@lexical/rich-text';
// Toolbar plugin for formatting
import React, { useState, useRef } from 'react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface RichTextEditorProps {
  initialValue?: string;
  onSave: (content: string) => void;
  onCancel?: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue = '', onSave, onCancel }) => {
  const [editorData, setEditorData] = useState(initialValue);
  const [showSaved, setShowSaved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = () => {
    onSave(editorData);
    setShowSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowSaved(false), 10000);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 'auto', margin: '32px auto' }}>
      <Typography variant="h6" gutterBottom>
        Free Text Editor
      </Typography>
  <Box mb={2} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, bgcolor: '#fff', height: '60vh', minHeight: 300, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <CKEditor 
          editor={ClassicEditor}
          data={editorData}
          onChange={(_event: any, editor: any) => {
            setEditorData(editor.getData());
          }}
          config={{
            placeholder: 'Write your notes here...'
          }}
          // @ts-ignore
          style={{ flex: 1, height: '100%', minHeight: '100%', boxSizing: 'border-box' }}
        />
        <style>{`
          .ck-editor__editable_inline {
            min-height: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            box-sizing: border-box;
          }
        `}</style>
      </Box>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
        <Box flex={1} display="flex" justifyContent="center">
          {showSaved && (
            
            <Alert severity="success"  sx={{ mt: 1 }}>
                  Content saved successfully.
            </Alert>
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
