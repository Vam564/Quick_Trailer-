import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Card, CardActionArea, Typography, Dialog, IconButton, AppBar, Toolbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Header from '../../Header/Header'

const CHANNELS = [
    {
        id: 1,
        name: 'Gemini Music',
        description: 'Non-stop Telugu music, film songs and music shows.',
        url: 'https://mhdtvhub.com/ww/sun/play.php?id=194393',
        logo: 'https://sund-images.sunnxt.com/192537/300x300_SunGeminiMoviesHD_192537_acb5d2e8-ab2c-464a-a004-e0e09e7de02d.png',
        gradient: 'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)',
        accent: '#E53935',
    },
]

const useStyles = makeStyles((theme) => ({
    page: {
        minHeight: '100vh',
        background: '#f5f5f5',
    },
    page_title: {
        paddingLeft: 30,
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
    },
    grid_wrapper: {
        padding: '20px 16px 40px',
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            padding: '20px 24px 40px',
        },
    },
    grid_item: {
        padding: '8px 8px',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            padding: '10px 12px',
        },
    },
    card: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
        },
    },
    card_action: {
        display: 'block',
    },
    card_banner: {
        height: 200,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    channel_logo: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: 16,
        display: 'block',
        background: '#fff',
    },
    live_badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(229,9,20,0.9)',
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        padding: '3px 8px',
        borderRadius: 4,
        letterSpacing: 1,
    },
    live_dot: {
        fontSize: 10,
        animation: '$blink 1.2s infinite',
    },
    '@keyframes blink': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.2 },
    },
    card_content: {
        padding: '14px 16px 16px',
        background: '#fff',
    },
    channel_name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222222',
        margin: '0 0 6px',
    },
    channel_desc: {
        fontSize: 13,
        color: '#777777',
        margin: 0,
        lineHeight: 1.5,
    },
    appbar: {
        background: '#111111',
        boxShadow: 'none',
        position: 'relative',
    },
    stream_title: {
        flex: 1,
        color: '#ffffff',
        fontWeight: 'bold',
        paddingLeft: 8,
    },
    live_label: {
        background: '#e50914',
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        padding: '2px 8px',
        borderRadius: 4,
        marginRight: 8,
        letterSpacing: 1,
    },
    close_btn: {
        color: '#ffffff',
    },
    player_wrapper: {
        background: '#000',
        height: 'calc(100vh - 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    no_stream: {
        color: '#fff',
        textAlign: 'center',
        padding: 40,
    },
}))

const LiveMusic = () => {
    const classes = useStyles()
    const [selectedChannel, setSelectedChannel] = useState(null)

    return (
        <div className={classes.page}>
            <Header />
            <h1 className={`${classes.page_title} list_page_title`}>Live Music TV</h1>

            <Grid container className={classes.grid_wrapper}>
                {CHANNELS.map((channel) => (
                    <Grid item key={channel.id} xs={12} sm={6} md={4} className={classes.grid_item}>
                        <Card className={classes.card} onClick={() => setSelectedChannel(channel)}>
                            <CardActionArea className={classes.card_action}>
                                <div
                                    className={classes.card_banner}
                                    style={{ background: channel.gradient }}
                                >
                                    <img
                                        src={channel.logo}
                                        alt={channel.name}
                                        className={classes.channel_logo}
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.parentElement.style.background = channel.gradient
                                        }}
                                    />
                                    <div className={classes.live_badge}>
                                        <FiberManualRecordIcon className={classes.live_dot} />
                                        LIVE
                                    </div>
                                </div>
                                <div className={classes.card_content}>
                                    <p className={classes.channel_name}>{channel.name}</p>
                                    <p className={classes.channel_desc}>{channel.description}</p>
                                </div>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog fullScreen open={!!selectedChannel} onClose={() => setSelectedChannel(null)}>
                <AppBar className={classes.appbar}>
                    <Toolbar variant="dense">
                        <IconButton className={classes.close_btn} onClick={() => setSelectedChannel(null)}>
                            <CloseIcon />
                        </IconButton>
                        <span className={classes.live_label}>LIVE</span>
                        <Typography className={classes.stream_title}>
                            {selectedChannel?.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {selectedChannel && (
                    <div className={classes.player_wrapper}>
                        {selectedChannel.url ? (
                            <iframe
                                src={selectedChannel.url}
                                width="100%"
                                height="100%"
                                allowFullScreen
                                allow="autoplay; encrypted-media; picture-in-picture"
                                title={selectedChannel.name}
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <div className={classes.no_stream}>
                                <Typography variant="h6">Stream coming soon</Typography>
                                <Typography variant="body2" style={{ color: '#aaa', marginTop: 8 }}>
                                    Add the stream URL for {selectedChannel.name} in Music.js
                                </Typography>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default LiveMusic
