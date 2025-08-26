import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Divider, Typography, Paper, TextField, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RichTextEditor from '../notes-components/rich-text-editor';

interface NotePage {
	id: string;
	title: string;
	content: string;
}

const NotesListComponent: React.FC = () => {
	const [pages, setPages] = useState<NotePage[]>([{
		id: 'page-1',
		title: 'Untitled Page',
		content: ''
	}]);
	const [selectedPageId, setSelectedPageId] = useState<string>('page-1');
	const [addingPage, setAddingPage] = useState(false);
	const [newPageTitle, setNewPageTitle] = useState('');
	const [editingTitle, setEditingTitle] = useState(false);
	const [editedTitle, setEditedTitle] = useState('');
	const handleDeletePage = (id: string) => {
		const idx = pages.findIndex(p => p.id === id);
		const newPages = pages.filter(page => page.id !== id);
		setPages(newPages);
		// Select next page or previous if available
		if (newPages.length > 0) {
			const nextIdx = idx < newPages.length ? idx : newPages.length - 1;
			setSelectedPageId(newPages[nextIdx].id);
		} else {
			setSelectedPageId('');
		}
	};

	const handleRenamePage = () => {
		setPages(pages.map(page => page.id === selectedPageId ? { ...page, title: editedTitle } : page));
		setEditingTitle(false);
	};

	const handleAddPage = () => {
		if (!newPageTitle.trim()) return;
		const newId = `page-${Date.now()}`;
		setPages([...pages, { id: newId, title: newPageTitle, content: '' }]);
		setSelectedPageId(newId);
		setNewPageTitle('');
		setAddingPage(false);
	};

	const handleSaveContent = (content: string) => {
		setPages(pages.map(page => page.id === selectedPageId ? { ...page, content } : page));
	};

	const selectedPage = pages.find(page => page.id === selectedPageId);

	return (
		<Box display="flex" height="80vh" minHeight={500}>
			{/* Left Sidebar */}
			<Paper elevation={2} sx={{ width: 240, minWidth: 180, p: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f7f7f7' }}>
				<Box display="flex" alignItems="center" mb={1}>
					<Typography variant="subtitle1" flex={1}>Pages</Typography>
					<IconButton size="small" color="primary" onClick={() => setAddingPage(true)}>
						<AddIcon />
					</IconButton>
				</Box>
				<Divider />
						<List dense sx={{ flex: 1, overflowY: 'auto' }}>
							{pages.map(page => (
								<ListItem key={page.id} disablePadding secondaryAction={
									<Tooltip title="Delete Page">
										<IconButton edge="end" size="small" color="error" onClick={() => handleDeletePage(page.id)}>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								}>
									<ListItemButton selected={page.id === selectedPageId} onClick={() => setSelectedPageId(page.id)}>
										<ListItemText primary={page.title} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
				{addingPage && (
					<Box mt={1} display="flex" gap={1}>
						<TextField
							size="small"
							autoFocus
							placeholder="Page title"
							value={newPageTitle}
							onChange={e => setNewPageTitle(e.target.value)}
							onKeyDown={e => { if (e.key === 'Enter') handleAddPage(); }}
							sx={{ flex: 1 }}
						/>
						<Button variant="contained" size="small" onClick={handleAddPage}>Add</Button>
					</Box>
				)}
			</Paper>
			{/* Right Editor Pane */}
					<Box flex={1} p={2}>
						{selectedPage ? (
							<>
								<Box display="flex" alignItems="center" mb={2} gap={1}>
									{editingTitle ? (
										<>
											<TextField
												size="small"
												value={editedTitle}
												onChange={e => setEditedTitle(e.target.value)}
												onKeyDown={e => { if (e.key === 'Enter') handleRenamePage(); }}
												sx={{ mr: 1, width: 240 }}
											/>
											<Button variant="contained" size="small" onClick={handleRenamePage}>Save</Button>
											<Button variant="text" size="small" onClick={() => setEditingTitle(false)}>Cancel</Button>
										</>
									) : (
										<>
											<Typography variant="h6" mb={0}>{selectedPage.title}</Typography>
											<Tooltip title="Rename Page">
												<IconButton size="small" color="primary" sx={{ ml: 1 }} onClick={() => { setEditingTitle(true); setEditedTitle(selectedPage.title); }}>
													<EditIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</>
									)}
								</Box>
								<RichTextEditor
									key={selectedPage.id}
									initialValue={selectedPage.content}
									onSave={handleSaveContent}
								/>
							</>
						) : (
							<Typography variant="body1">Select a page to start editing.</Typography>
						)}
					</Box>
		</Box>
	);
};

export default NotesListComponent;
