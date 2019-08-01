import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RegisterForm(props) {
  const [open, setOpen] = React.useState(false);
  const [myAddess,setAddress] = React.useState(props.myAddess)

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit(e){
    e.preventDefault()
    const name = e.target.elements.name.value;
    let ens = e.target.elements.ens.value
    const ipfs = e.target.elements.ipfs.value

    web3.eth.ens.getAddress('ethereum.eth').then(function (address) {
      if(address !== myAddess){
        ens = "";
        alert("ENS specified is not correct!")
        return;
      }
    })
    props.handleRegistration(name,ens,ipfs)

    handleClose()
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Register
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Register</DialogTitle>

        <DialogContent>
        <form id="my-form-id" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Name"
            name = "name"
            fullWidth
          />
            
          <TextField
            margin="dense"
            id="ens"
            label="ENS address"
            name="ens"
            fullWidth
          />
          <TextField
            margin="dense"
            id="ipfs"
            label="Insert ipfs hash of an image for a custom avatar"
            name="ipfs"
            fullWidth
          />
          <DialogContentText>
            Submitting this form will trigger a transaction!
          </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="my-form-id"  label="Submit" color="primary">
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}