import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

export default function CreatePetitionForm(props) {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit(e){
    e.preventDefault()
    console.log(e)
    const name = e.target.elements.name.value;
    const description = e.target.elements.description.value;
    const link = e.target.elements.link.value;
    //const ipfs = e.target.elements.ens.ipfs.value;
    const target = e.target.elements.target.value;


    props.handleCreatePetition(name,description,link,"",target)
    //TODO VERIFY

    handleClose()
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create Petition!
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"> Create New Petition!</DialogTitle>

        <DialogContent>
        <form id="create-petition-form" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Petition Name"
            name = "name"
            fullWidth
          />

          <TextField 
          required
          margin="dense"
          fullWidth
          label="Insert a short description of your petition!"
          id="description"
          name="description"
          />

          <TextField
            margin="dense"
            id="link"
            label="Insert a link for additional informations!"
            name="link"
            fullWidth
          />

          <TextField
            required
            margin="dense"
            id="target"
            label="Insert the signatures objective!"
            InputProps={{ inputProps: { min: 1} }}
            name="target"
            type="number"
            min="1"
            fullWidth
          />



          <DialogContentText>
            Submitting this form will trigger a transaction and create the petition!
          </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="create-petition-form"  label="Submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}