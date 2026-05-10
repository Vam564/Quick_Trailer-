import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Card, CardActionArea, Typography, IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import ReactPlayer from 'react-player'
import Header from '../../Header/Header'

const CHANNELS = [
    {
        id: 1,
        name: 'Zee Telugu',
        description: 'Popular Telugu entertainment with serials, movies & reality shows.',
        url: 'https://www.mhdtvhub.com/ww/zee/play.php?id=Zee%20Telugu%20HD',
        logo: 'https://logos-world.net/wp-content/uploads/2023/04/Zee-Telugu-Logo.jpg',
        gradient: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
        accent: '#3949AB',
    },
    {
        id: 2,
        name: 'Gemini TV',
        description: 'Leading Telugu general entertainment channel.',
        url: 'https://mhdtvhub.com/ww/sun/play.php?id=194392',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Sun_Gemini.jpg',
        gradient: 'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)',
        accent: '#E53935',
    },
    {
        id: 3,
        name: 'Gemini Life',
        description: 'Top Telugu dramas, reality shows and blockbuster movies.',
        url: 'https://mhdtvhub.com/ww/sun/play.php?id=194337',
        logo: 'https://i.imgur.com/Oe0GXf6.jpg',
        gradient: 'linear-gradient(135deg, #e65100 0%, #ff6d00 100%)',
        accent: '#FF6D00',
    },
    {
        id: 4,
        name: 'Gemini Comedy',
        description: 'Blockbuster Telugu & Hindi movies around the clock.',
        url: 'https://mhdtvhub.com/ww/sun/play.php?id=194394',
        logo: 'https://jiotvimages.cdn.jio.com/dare_images/images/channel/8ecf1c7a14a5f543ca60013e8d048aaf.png',
        gradient: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
        accent: '#388E3C',
    },
    {
        id: 5,
        name: 'Telugu One',
        description: '24/7 Telugu movie channel with latest and classic hits.',
        url: 'https://mhdtvhub.com/ww/tal/play.php?id=d9791233af2ae980dd22ae865af8b3dd',
        logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/47/32/da/4732da54-8efa-5cc9-c517-1d71669763eb/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/1200x630wa.jpg',
        gradient: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
        accent: '#7B1FA2',
    },
    {
        id: 6,
        name: 'Gemini Movies',
        description: '24/7 Telugu movie channel with latest and classic hits.',
        url: 'https://mhdtvhub.com/ww/sun/play.php?id=194384',
        logo: 'https://sund-images.sunnxt.com/194384/1000x1500_SunGeminiMovies_194384_a897e4e5-6910-48d2-b387-23cab02025b9.jpg',
        gradient: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
        accent: '#7B1FA2',
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
    player_topbar: {
        display: 'flex',
        alignItems: 'center',
        background: '#111111',
        padding: '0 8px',
        height: 48,
        gap: 8,
        flexShrink: 0,
    },
    player_back_btn: {
        color: '#ffffff',
    },
    live_label: {
        background: '#e50914',
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        padding: '2px 8px',
        borderRadius: 4,
        letterSpacing: 1,
        flexShrink: 0,
    },
    player_title: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 15,
        flex: 1,
    },
    player_area: {
        width: '100%',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
    },
    player_frame: {
        height: 'calc(100vh - 113px)',
        aspectRatio: '16/9',
        maxWidth: '100%',
        border: 'none',
        display: 'block',
        background: '#000',
    },
    player_react_wrapper: {
        height: 'calc(100vh - 113px)',
        aspectRatio: '16/9',
        maxWidth: '100%',
        background: '#000',
    },
    no_stream: {
        height: 'calc(100vh - 113px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
    },
}))

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

const Regional = () => {
    const classes = useStyles()
    const [selectedChannel, setSelectedChannel] = useState(null)

    return (
        <div className={classes.page} style={selectedChannel ? { background: '#000' } : {}}>
            <Header />

            {selectedChannel ? (
                <>
                    <div className={classes.player_topbar}>
                        <IconButton className={classes.player_back_btn} onClick={() => setSelectedChannel(null)}>
                            <ArrowBackIcon />
                        </IconButton>
                        <span className={classes.live_label}>LIVE</span>
                        <Typography className={classes.player_title}>{selectedChannel.name}</Typography>
                    </div>
                    {selectedChannel.url && selectedChannel.url.includes('.m3u8') ? (
                        <div className={classes.player_react_wrapper}>
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
                        </div>
                    ) : selectedChannel.url ? (
                        <div className={classes.player_area}>
                            <iframe
                                src={selectedChannel.url}
                                allowFullScreen
                                allow="autoplay; encrypted-media; picture-in-picture"
                                title={selectedChannel.name}
                                className={classes.player_frame}
                            />
                        </div>
                    ) : (
                        <div className={classes.no_stream}>
                            <Typography variant="h6">Stream coming soon</Typography>
                            <Typography variant="body2" style={{ color: '#aaa', marginTop: 8 }}>
                                Add the stream URL for {selectedChannel.name} in Regional.js
                            </Typography>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h1 className={`${classes.page_title} list_page_title`}>Regional Live TV</h1>
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
                </>
            )}
        </div>
    )
}

export default Regional
