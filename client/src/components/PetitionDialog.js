import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Address from './Address';

const useStyles = makeStyles(theme => ({
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  imgSize: {
    width: 405 ,
    height: 360,
  },
  center:{
    textAlign: "center"
  }

}));

export default function PetitionDialog(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const p = props.petition;

  const [array, setArray] = React.useState([])
  const [disabled, setDisabled] = React.useState(false);
  
  function  handleClickOpen() {
    setOpen(true);
  }

  useEffect(() => {
    async function fetchData() {
    const signatures = await props.fetchSignatures(props.index, p.totalSigns)
    setArray([...signatures])
    console.log(array)
    const searchIndex = array.findIndex(x => x.userAddress === props.myAddress)
    console.log(searchIndex)
    if(searchIndex === -1){
      setDisabled(false)
    }else{
      setDisabled(true)
    }
    }
    fetchData();
  }, [open])

  useEffect(() => {
    async function checkSignatures() {
    const searchIndex = array.findIndex(x => x.userAddress === props.myAddress)
    console.log(searchIndex)
    if(searchIndex === -1){
      setDisabled(false)
    }else{
      setDisabled(true)
    }
    }
    checkSignatures();
  }, [array])


  function handleClose() {
    setOpen(false);
  }

  function handleSign(e){
    e.preventDefault()

    props.handleSignPetition(props.index)
    setDisabled(true)
    handleClose()
  }

  return (

    <div>
      <IconButton  onClick={handleClickOpen} className={classes.icon}>
        <InfoIcon />
      </IconButton>
     <Dialog fullWidth={true} maxWidth={"xl"}
     open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Sign Petition!</DialogTitle>
        <DialogContent className={classes.center}>
            <img className={classes.imgSize} src={p.ipfs_banner === "" ? "https://ipfs.io/ipfs/QmcZ7ZRbof1NEqch8cJ6qnDtA8CTuMdStN5kqhTv9hvhfq" : "https://ipfs.io/ipfs/"+ p.ipfs_banner } alt={p.name} />
            <h1 > {p.name} </h1>
            Proposed by
            <Address address={p.creator} identity={p.identity}/>

            <h3 > {p.totalSigns} / {p.targetSigns} subscriptions so far! </h3>
            
            <h4 > Description: {p.description} </h4>

            Submitting this form will trigger a transaction to sign the petition!

            <h2> Signatures: </h2>
            { array.map( address =>(
            <Address key={address.userAddress} identity = {{name: address.name, ens: address.ens, ipfs_avatar: address.ipfs_avatar}} address={address.userAddress} />

          )) }
            
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button disabled={disabled} onClick={handleSign} color="primary">
            Sign Petition
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}