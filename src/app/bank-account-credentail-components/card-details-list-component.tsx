import React, { useState } from 'react';
import { ICardDetails } from '../../entities/db-entities/bank-account-credentails';
import { Grid, Box, Typography, Button, IconButton, Modal } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import MaskedCell from '../common-components/masked-cell-component';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import AddCardDetailsComponent from './add-card-details-component';

interface CardDetailsComponentProps {
    onListUpdate: (details: ICardDetails[]) => void;
    cardDetails?: ICardDetails[];
}

const CardDetailsComponent: React.FC<CardDetailsComponentProps> = (props) => {
    const defaultCardDetails: ICardDetails = {
        CardNumber: '',
        CardHolderName: '',
        ExpiryDate: '',
        CVV: '',
        Pin: '',
        LastUpdatedOn: new Date(),
        IssuingBank: '',
        CreatedOn: new Date(),
        AdditionalInfo: {},
        CardName: ''
    };

    const [cardDetailsList, setCardDetailsList] = useState<ICardDetails[]>(props.cardDetails || []);
    const [showAddCardDetailsModal, setShowAddCardDetailsModal] = useState(false);
    const [cardDetails, setCardDetails] = useState<ICardDetails | null>(defaultCardDetails);
    const [cardDetailsRow, setCardDetailsRow] = useState<any>(null);

    const handleAddCardDetails = (details: ICardDetails) => {
        setCardDetailsList((prev) => [...prev, details]);
        props.onListUpdate([...cardDetailsList, details]);
    };
  

     React.useEffect(() => {
        var dataRow: any;
        var rows: any = [];
        cardDetailsList.forEach((row: any, i: number) => {
            dataRow = {};
            dataRow.id = i;
            Object.keys(row).forEach((prop: string) => {
                dataRow[prop] = row[prop];
            });

            rows.push(dataRow);
        });
        setCardDetailsRow(rows);
            
     }, [cardDetailsList]);



    const copyContentToClipBoard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('Content copied to clipboard');
        }).catch((err) => {
            console.error('Error copying content to clipboard:', err);
        });
    };

    const onDeleteCardDetails = (cardNumber: string) => {
        setCardDetailsList((prev) => prev.filter((item) => item.CardNumber !== cardNumber));
    };

    const onShowAddCardDetailsPanel = (event: any) => {
        setCardDetails(defaultCardDetails);
        setShowAddCardDetailsModal(true);
    }
    const onShowEditCardDetailsPanel = (row: any) => {
        setCardDetails(row);
        setShowAddCardDetailsModal(true);
    };

    const cardDetailInfoColumns = [
        { field: 'IssuingBank', headerName: 'Issuing Bank', flex: 1 },
        { field: 'CardName', headerName: 'Card Name', flex: 1 },
        { field: 'CardHolderName', headerName: 'Card HolderName', flex: 1 },
        {
            field: 'CardNumber',
            headerName: 'Card Number',
            flex: 1,
            renderCell: (params: any) => (
                <div style={{ display: 'flex' }}>
                    <div>
                        {params.row.CardNumber}
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="secondary" title='Copy Value' onClick={() => copyContentToClipBoard(params.row.CardNumber)} aria-label="copy">
                            <ContentCopy />
                        </IconButton>
                    </div>
                </div>
            )
        },
        { field: 'ExpiryDate', headerName: 'Expiry Date', flex: 1 },
        {
            field: 'CVV',
            headerName: 'CVV',
            flex: 1,
            renderCell: (params: any) => <MaskedCell value={params.value} />
        },
        {
            field: 'Pin',
            headerName: 'Pin',
            flex: 1,
            renderCell: (params: any) => <MaskedCell value={params.value} />
        },
        { field: 'LastUpdatedOn', headerName: 'LastUpdatedOn', flex: 1 },
        {
            field: 'modify',
            headerName: 'Modify',
            flex: 0.5,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
                <div style={{ display: 'flex' }}>
                    <div>
                        <IconButton color="secondary" title='Copy Value' onClick={() => onShowEditCardDetailsPanel(params.row)} aria-label="copy">
                            <EditIcon />
                        </IconButton>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <IconButton color="error" onClick={() => onDeleteCardDetails(params.row.CardNumber)} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>

            ),

        },
    ];
    
    const onAddCardDetails = (details: ICardDetails) => {
        var index = cardDetailsList.findIndex(item => item.CardNumber === details.CardNumber);
        if (index === -1){
            // Add New Card
            cardDetailsList.push({ ...details });
            setCardDetailsList([...cardDetailsList]);
            return; 
        }

        // Update Existing Card
        cardDetailsList[index] = { ...details };
        setCardDetailsList([...cardDetailsList]);
    };

    return (
        <Grid sx={{ width: '100%', paddingTop: 1 }}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Typography variant="subtitle1" sx={{ minWidth: 140, mr: 2 }}>Add Card Details</Typography>
                <Button variant="contained" color="secondary" sx={{ width: 120, maxHeight: 30 }} onClick={onShowAddCardDetailsPanel}>
                    Add New
                </Button>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
                <DataGrid
                    rows={cardDetailsRow}
                    columns={cardDetailInfoColumns}
                    initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } }, }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight={false} />
            </Box>
            <Modal open={showAddCardDetailsModal} onClose={() => setShowAddCardDetailsModal(false)}>
                <AddCardDetailsComponent
                    onAddCardDetails={onAddCardDetails}
                    onClose={() => setShowAddCardDetailsModal(false)} cardDetails={cardDetails} />
            </Modal>
            
            

        </Grid>

    );
};

export default CardDetailsComponent;
