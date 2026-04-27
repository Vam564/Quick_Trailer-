import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const SERVERS = [
    { label: 'Server 1', url: (id) => `https://vidlink.pro/movie/${id}` },
    { label: 'Server 2', url: (id) => `https://ythd.org/embed/${id}` },
]

const useStyles = makeStyles(() => ({
    page: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
    },
    topbar: {
        display: 'flex',
        alignItems: 'center',
        background: '#111',
        padding: '6px 12px',
        gap: 8,
        flexShrink: 0,
        borderBottom: '1px solid #222',
    },
    back_btn: {
        color: '#fff',
        padding: 6,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    server_group: {
        display: 'flex',
        gap: 6,
        flexShrink: 0,
    },
    server_btn: {
        padding: '4px 14px',
        borderRadius: 16,
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 'bold',
        transition: 'background 0.2s',
    },
    server_active: {
        background: '#e50914',
        color: '#fff',
    },
    server_inactive: {
        background: '#333',
        color: '#aaa',
        '&:hover': { background: '#444' },
    },
    player: {
        flex: 1,
        width: '100%',
        border: 'none',
    },
}))

const MoviePlayer = () => {
    const classes = useStyles()
    const history = useHistory()
    const { detailPageData } = useSelector(s => s.ListPageReducer)
    const [serverIndex, setServerIndex] = useState(0)

    if (!detailPageData || !detailPageData.id) {
        history.replace('/')
        return null
    }

    return (
        <div className={classes.page}>
            <div className={classes.topbar}>
                <IconButton className={classes.back_btn} onClick={() => history.goBack()}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography className={classes.title}>
                    {detailPageData.original_title || detailPageData.title}
                </Typography>
                <div className={classes.server_group}>
                    {SERVERS.map((s, i) => (
                        <button
                            key={s.label}
                            className={`${classes.server_btn} ${i === serverIndex ? classes.server_active : classes.server_inactive}`}
                            onClick={() => setServerIndex(i)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>
            <iframe
                key={serverIndex}
                src={SERVERS[serverIndex].url(detailPageData.id)}
                className={classes.player}
                allowFullScreen
                allow="autoplay; fullscreen"
                title={detailPageData.original_title}
            />
        </div>
    )
}

export default MoviePlayer
