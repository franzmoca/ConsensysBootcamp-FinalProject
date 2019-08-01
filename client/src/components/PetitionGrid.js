import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import PetitionDialog from './PetitionDialog';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1000,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));


export default function TitlebarGridList(props) {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div"> <h1> Petition List </h1> </ListSubheader>
        </GridListTile>
        {(props.petitionData).map((petition,idx) => (
          <GridListTile key={idx}>
            <img src={"https://ipfs.io/ipfs/"+petition.ipfs_banner} onError={(e)=>{e.target.onerror = null; e.target.src="https://ipfs.io/ipfs/QmcZ7ZRbof1NEqch8cJ6qnDtA8CTuMdStN5kqhTv9hvhfq"} } alt={petition.name} />
            <GridListTileBar
              title={petition.name + "("+ petition.totalSigns+"/"+petition.targetSigns+")"}
              subtitle={<span>by: {petition.identity.name}</span>}
              actionIcon={
                <PetitionDialog  handleSignPetition={props.handleSignPetition} petition={petition} index={idx} fetchSignatures={props.fetchSignatures} myAddress={props.myAddress}/>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}