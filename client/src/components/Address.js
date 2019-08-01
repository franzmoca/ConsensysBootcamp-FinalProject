import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
    card: {
      minWidth: 500,
      marginTop: 10,
      marginBottom: 10
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  

const User = (props) => {
    const classes = useStyles();
    const avatarImg = "https://ipfs.io/ipfs/" + props.identity.ipfs_avatar;
    return (
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
       >
    <Grid item xs={3}>
        <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar src={avatarImg} src={avatarImg} onError={(e)=>{e.target.onerror = null; e.target.src="https://ipfs.io/ipfs/QmbdY3vwAUME9eZy1uNWkpk4CaieMYsvDoNRniferFWYhq"}} aria-label="avatar" className={classes.avatar}>
            </Avatar>
          }
          title={props.identity.name}
          subheader={props.address}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
        {props.identity.ens && <span>Ens: {props.identity.ens} </span> }
          </Typography>
        </CardContent>
        </Card>
        </Grid>
        </Grid>
    )
  }
  export default User;