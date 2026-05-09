import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Card, CardActionArea, Typography, Dialog, IconButton, AppBar, Toolbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import ReactPlayer from 'react-player'
import Header from '../../Header/Header'

const CHANNELS = [
    {
        id: 1,
        name: 'TV9 Telugu',
        description: 'Breaking news, live updates and in-depth Telugu reporting.',
        url: 'https://mhdtvhub.com/ww/tal/play.php?id=f4d44e6b6c65474c18f50fdfa7dc95d6',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/TV9TeluguLogo.jpg/250px-TV9TeluguLogo.jpg',
        gradient: 'linear-gradient(135deg, #bf360c 0%, #e64a19 100%)',
        accent: '#E64A19',
    },
    {
        id: 2,
        name: '10 TV Telugu',
        description: 'Trusted Telugu news, politics and current affairs.',
        url: 'https://mhdtvhub.com/ww/tal/play.php?id=749ebb6755d5f7d8aea9b3b470eae991',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnQugW-YIkgrDSyYHIr7K7Wz2edIqPHeDFlg&s',
        gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
        accent: '#1565C0',
    },
    {
        id: 3,
        name: '99 TV News',
        description: '24/7 Telugu news with live political and social coverage.',
        url: 'https://mhdtvhub.com/ww/tal/play.php?id=c7ba0e8f59279be006825dca926eb347',
        logo: 'https://upload.wikimedia.org/wikipedia/en/5/5f/99tv_channel_logo.jpg',
        gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        accent: '#283593',
    },
    {
        id: 4,
        name: 'ETV Telugu',
        description: 'Regional news and entertainment from Eenadu group.',
        url: 'https://mhdtvhub.com/ww/tal/play.php?id=d906fb3609162c2ae3ca523e6d0c7325',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2RNrjFccwhjJV-ort5wgqqvyGs5kpGfVGPg&s',
        gradient: 'linear-gradient(135deg, #006064 0%, #00838f 100%)',
        accent: '#00838F',
    },
    {
        id: 5,
        name: 'T News',
        description: 'Latest Telugu news, debates and live special programmes.',
        url: 'https://mhdtvhub.com/ww/tal/play.php?id=dc9bce1dae2415c6ea9eed126acca928',
        logo: 'https://upload.wikimedia.org/wikipedia/en/1/1a/T_News_logo.png',
        gradient: 'linear-gradient(135deg, #880e4f 0%, #c2185b 100%)',
        accent: '#C2185B',
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

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

const News = () => {
    const classes = useStyles()
    const [selectedChannel, setSelectedChannel] = useState(null)

    return (
        <div className={classes.page}>
            <Header />
            <h1 className={`${classes.page_title} list_page_title`}>Live News TV</h1>

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
                        {selectedChannel.url && selectedChannel.url.includes('.m3u8') ? (
                            <ReactPlayer
                                url={selectedChannel.url}
                                width="100%"
                                height="100%"
                                playing
                                controls
                                playsinline
                                config={{
                                    file: {
                                        forceHLS: !isIOS,
                                        attributes: { playsInline: true },
                                    }
                                }}
                            />
                        ) : selectedChannel.url ? (
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
                                    Add the stream URL for {selectedChannel.name} in News.js
                                </Typography>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default News
