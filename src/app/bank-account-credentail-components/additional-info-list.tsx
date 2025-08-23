import { Grid, Box, Typography, Button, Paper, TextField, IconButton, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { IExtensibleProperties } from "../../entities/db-entities/extensible-properties";
import { ContentCopy } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddAddtionalInfoComponent from "../common-components/add-additional-info-component";

interface IAddtionalInfoListComponentProps {
    additionalInfo: IExtensibleProperties;
    onAdditionalInfoUpdate: (additionalInfo: IExtensibleProperties) => void;
}

const AdditionalInfoListComponent: React.FC<IAddtionalInfoListComponentProps> = (props) => {

    const [addtionalInfoObject, setAddtionalInfoObject] = React.useState<{ [key: string]: string }>(props.additionalInfo);
    const [addAddtionalInfoModalOpen, setAddAddtionalInfoModalOpen] = React.useState(false);

    const onDeleteAddtionalinfo = (key: string) => {
        delete addtionalInfoObject[key];
        setAddtionalInfoObject({ ...addtionalInfoObject });
        props.onAdditionalInfoUpdate({ ...addtionalInfoObject });
    };

    const copyContentToClipBoard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Content copied to clipboard');
        }).catch((err) => {
            console.error('Error copying content to clipboard:', err);
        });
    };

    const onAddAdditionalInfo = (key: string, value: string): void => {
        addtionalInfoObject[key] = value;
        setAddtionalInfoObject({ ...addtionalInfoObject });
        props.onAdditionalInfoUpdate(addtionalInfoObject);
    }

    const additionalInfoRows = addtionalInfoObject ? Object.entries(addtionalInfoObject).map(([key, value], i) => ({
        id: i,
        key: key,
        value: value,
    })) : [];

    const additionalInfoColumns = [
        { field: 'key', headerName: 'Key', flex: 1 },
        {
            field: 'value', headerName: 'Value', flex: 1,
            renderCell: (params: any) => (
                <div style={{ display: 'flex' }}>
                    <div >
                        {params.row.value}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="secondary" title='Copy Value' onClick={() => copyContentToClipBoard(params.row.value)} aria-label="edit">
                            <ContentCopy />
                        </IconButton>
                    </div>
                </div>
            )
        },
        {
            field: 'modify',
            headerName: 'Modify',
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <Box>
                    <IconButton color="error" onClick={() => onDeleteAddtionalinfo(params.row.key)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),

        },
    ];

    return (
        <Grid sx={{ width: '100%', paddingTop: 1 }}>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="secondary" sx={{ width: 120, maxHeight: 30 }} onClick={() => setAddAddtionalInfoModalOpen(true)}>
                    Add New
                </Button>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
                <DataGrid
                    rows={additionalInfoRows}
                    columns={additionalInfoColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } }, }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight={false} />
            </Box>

            <Modal open={addAddtionalInfoModalOpen} onClose={() => setAddAddtionalInfoModalOpen(false)}>
                <AddAddtionalInfoComponent
                    onAddAddtionalinfo={onAddAdditionalInfo}
                    onClose={() => setAddAddtionalInfoModalOpen(false)}
                />
            </Modal>


        </Grid>

    );
}

export default AdditionalInfoListComponent;