import { VisibilityOff, Visibility, ContentCopy } from "@mui/icons-material";
import { Box, Tooltip, IconButton } from "@mui/material";
import React from "react";

const MaskedCell: React.FC<{ value: string }> = ({ value }) => {
    const [show, setShow] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch {
            setCopied(false);
        }
    };
    return (
        <Box display="flex" alignItems="center">
            <span style={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                {show ? value : '•'.repeat(value?.length || 8)}
            </span>
            <Tooltip title={show ? 'Hide' : 'Show'}>
                <IconButton size="small" onClick={() => setShow((s) => !s)}>
                    {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
            </Tooltip>
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                <IconButton size="small" onClick={handleCopy}>
                    <ContentCopy fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default MaskedCell;