import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Grid, FormControl, InputLabel, MenuItem, Select, Paper, Avatar, Badge } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { flags } from '../Country_Flags/Country_Flags'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: '#eff0f5',
    },
    paper_live_match: {
        height: 125,
        width: '90%',
        margin: '0 auto',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 10,
        padding: '10px',
        textAlign: 'center',
    },
    app_logo: {
        width: 25,
        height: 25,
    },
    team_content: {
        display: 'flex',
        position: 'relative',
        padding: '5px',
        color:'#fff',

    },
    team_text: {
        fontWeight: '700',
        margin: '0 0 0 10px'
    },
    team_score: {
        position: 'absolute',
        right: '20px',
        fontWeight: '700',
    },
    vs: {
        background: '#ecebf0',
        fontWeight: '700',
        color: '#a8abb8',
        fontSize: '10px',
        padding: '5px',
        borderRadius: '2px'
    },
    overs: {
        color: '#a2a3a5',
        marginRight: '5px',
        fontWeight: 'normal',
        fontSize: '12px'
    },
    live_text: {
        padding: '0 5px',
        borderRadius: '5px',
        position: 'absolute',
        top: '2px',
    },
    live_wrapper: {
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: '700',
        position: 'relative'

    },
    live_icon: {
        color: 'red',
        fontSize: '1em',
        border: '2px solid #e9d4db',
        borderRadius: '50%',
        marginTop: '2px',

    }
}))

const CricketCard = () => {
    const classes = useStyles();

    return (
        <div>
            <Paper className={classes.paper_live_match} style={{ background: 'linear-gradient(0deg, rgba(9,9,121,1) 16%, rgba(0,212,255,1) 100%)', border: '1px solid #dedede' }}>
                <div className={classes.live_wrapper}>
                    <p style={{background:'#eff0f5', borderRadius:'10px',padding: '2px 0 0 5px',width:'50px', margin:'1px 0 4px'}}>
                        <FiberManualRecordIcon className={classes.live_icon}></FiberManualRecordIcon> <span className={classes.live_text}>  LIVE</span>
                    </p>
                </div>
                <div className={classes.team_content}>
                    <Avatar alt="Profile Picture" className={classes.app_logo} src={flags.ind} />
                    <span className={classes.team_text}>India</span>
                    <span className={classes.team_score}>264</span>
                </div>
                <div ><span className={classes.vs}>vs</span></div>
                <div className={classes.team_content}>
                    <Avatar alt="Profile Picture" className={classes.app_logo} src={flags.sri} />
                    <span className={classes.team_text}>Srilanka</span>
                    <span className={classes.team_score}><span className={classes.overs}>(48.4 Ov)</span>197</span>
                </div>
            </Paper>
        </div>
    )
}

export default CricketCard
