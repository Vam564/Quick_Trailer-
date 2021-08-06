import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import ReactPlayer from 'react-player'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        paddingTop: '59.25%', /* 56.25% Player ratio: 100 / (1280 / 720) */
        margin: '20px 0',
    },
    react_player: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 10,
    },
    no_video: {
        padding: "50px",
        textAlign: 'center',
    },
    dialogPaper: {
        height: '800px'
    },
    dialog_player: {
        overflow: 'hidden',
    },
    dialog_title: {
        background: 'rgb(0, 0, 0)',
        color: '#ffffff'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

const Media = ({ handleClickOpen, handleClose, open }) => {

    const classes = useStyles()
    const content = useSelector((state) => state.DetailPageReducer)
    const { movieTrailerData } = content




    return (
        <div className={classes.media_content}>
            <div>
                <Dialog
                    fullWidth={"true"}
                    maxWidth={"md"}
                    classes={{ paper: classes.dialogPaper }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                >
                    <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.dialog_title}>
                        Play Trailer
                        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    {
                        movieTrailerData.length === 0 ? (
                            <div className={classes.no_video}>
                                <h3>Sorry, No Trailer Found</h3>
                            </div>
                        ) : (
                            <ReactPlayer
                                className={classes.dialog_player}
                                url={`https://www.youtube.com/embed/${movieTrailerData[0].key}`}
                                width='100%'
                                height='100%'
                                controls={true}
                            />
                        )
                    }
                    {/* {
                movieTrailerData.length === 0 ? (
                    <div className={classes.no_video}>
                        <h3>Sorry, No Trailer Found</h3>
                    </div>
                ) : (
                    <Grid container className={classes.root}>
                        <ReactPlayer
                            className={classes.react_player}
                            url={`https://www.youtube.com/embed/${movieTrailerData[0].key}`}
                            width='100%'
                            height='600px'
                            controls={true}
                        />
                    </Grid>
                )
            } */}
                </Dialog>
            </div>
        </div >
    )
}

export default Media