import React, { useContext, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, RadioGroup, FormControlLabel, Radio, withStyles, RadioProps, Box, Fab, Zoom } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { StoreContext } from '../store/store';
import { status } from '../Data';
import AddIcon from '@material-ui/icons/Add';

const BlueRadio = withStyles({
    root: {
        // color: blue[400],
        '&$checked': {
            color: lightBlue[600],
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
  
export const AddProject = () => {
    const store = useContext(StoreContext);
    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending' as status);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const initValues = () => {
        setTitle('');
        setDescription('');
        setStatus('pending');
        setOpen(false);
    }
    const handleCancel = () => initValues();
    const handleSubscribe = () => {
        store.createProject({ title, description, status });
        initValues();
    }

    return (
    <>
    <Box position="fixed" right={40} bottom={40} zIndex={10} onClick={handleClickOpen}>
        <Zoom in={true}>
            <Fab color="primary">
                <AddIcon />
            </Fab>
        </Zoom>
    </Box>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">ADD PROJECT</DialogTitle>
        <DialogContent>
        <DialogContentText>
            
        </DialogContentText>
            <TextField autoFocus margin="dense" label="title" fullWidth value={title}
                onChange={event => setTitle(event.target.value)}/>
            <TextField margin="dense" label="description" fullWidth multiline rowsMax={4}
                value={description} onChange={event => setDescription(event.target.value)}/>
            <Box mt={2}>
                <RadioGroup row value={status} onChange={event => setStatus(event.target.value as status)}>
                    <FormControlLabel value="pending" control={<BlueRadio size="small" />} label="pending" />
                    <FormControlLabel value="resolved" control={<BlueRadio size="small" />} label="resolved" />
                    <FormControlLabel value="partial" control={<BlueRadio size="small" />} label="partial" />
                </RadioGroup>
            </Box>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCancel} color="primary">
            Cancel
        </Button>
        <Button onClick={handleSubscribe} color="primary">
            Subscribe
        </Button>
        </DialogActions>
    </Dialog>
    </>
    )
}