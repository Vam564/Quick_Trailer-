import { useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import ReactPlayer from 'react-player'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const MOVIE_SERVERS = [
    { label: 'Server 1', url: (id) => `https://vidlink.pro/movie/${id}` },
    { label: 'Server 2', url: (id) => `https://ythd.org/embed/${id}` },
]

const useStyles = makeStyles((theme) => ({
    no_video: {
        padding: '50px',
        textAlign: 'center',
    },
    dialogPaper: {
        overflow: 'hidden',
        background: '#000',
    },
    player_wrapper: {
        position: 'relative',
        paddingTop: '56.25%',
        width: '100%',
        background: '#000',
    },
    player_inner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
    },
    dialog_title: {
        background: '#000',
        color: '#ffffff',
        padding: '8px 16px',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(0.5),
        color: theme.palette.grey[400],
    },
    server_bar: {
        display: 'flex',
        gap: 8,
        background: '#111',
        padding: '8px 16px',
    },
    server_btn: {
        padding: '4px 14px',
        borderRadius: 16,
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 'bold',
        transition: 'all 0.2s',
    },
    server_active: {
        background: '#e50914',
        color: '#fff',
    },
    server_inactive: {
        background: '#333',
        color: '#aaa',
    },
}));

const Media = ({ handleClickOpen, handleClose, open, isMovie, movieId }) => {
    const classes = useStyles()
    const content = useSelector((state) => state.DetailPageReducer)
    const { movieTrailerData } = content
    const [serverIndex, setServerIndex] = useState(0)

    const handleClose_ = () => {
        setServerIndex(0)
        handleClose()
    }

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            classes={{ paper: classes.dialogPaper }}
            open={open}
            onClose={handleClose_}
            aria-labelledby="media-dialog-title"
        >
            <DialogTitle id="media-dialog-title" className={classes.dialog_title}>
                {isMovie ? 'Watch Movie' : 'Watch Trailer'}
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose_}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {isMovie ? (
                <>
                    <div className={classes.server_bar}>
                        {MOVIE_SERVERS.map((s, i) => (
                            <button
                                key={s.label}
                                className={`${classes.server_btn} ${i === serverIndex ? classes.server_active : classes.server_inactive}`}
                                onClick={() => setServerIndex(i)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <div className={classes.player_wrapper}>
                        <iframe
                            key={serverIndex}
                            src={MOVIE_SERVERS[serverIndex].url(movieId)}
                            className={classes.player_inner}
                            allowFullScreen
                            allow="autoplay; fullscreen"
                            title="Watch Movie"
                        />
                    </div>
                </>
            ) : movieTrailerData.length === 0 ? (
                <div className={classes.no_video}>
                    <h3>Sorry, No Trailer Found</h3>
                </div>
            ) : (
                <div className={classes.player_wrapper}>
                    <ReactPlayer
                        className={classes.player_inner}
                        url={`https://www.youtube.com/watch?v=${movieTrailerData[0].key}`}
                        width="100%"
                        height="100%"
                        controls
                    />
                </div>
            )}
        </Dialog>
    )
}

export default Media
