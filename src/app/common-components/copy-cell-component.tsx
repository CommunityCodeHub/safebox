import { ContentCopy } from "@mui/icons-material";
import { Box, Tooltip, IconButton } from "@mui/material";
import React from "react";

const CopyCell: React.FC<{ value: string }> = ({ value }) => {
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
            <span style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{value}</span>
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                <IconButton size="small" onClick={handleCopy}>
                    <ContentCopy fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default CopyCell;