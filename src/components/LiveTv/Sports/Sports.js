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
        name: 'Star Sports 1 HD',
        description: 'Live cricket, football & more in HD quality.',
        url: 'https://mut001.myturn1.top:8088/live/starsports01/playlist.m3u8?vidictid=205685854492&id=123144&pk=dbf564881d4a7e41eb02f5766fa3a03262932a2eba36779e5d9599bc8653f16e50d322d67e48aaa4b5f33adbd3144117469ea9a216cf0a7fde969aae5571aad7',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png?_=20221025095646',
        gradient: 'linear-gradient(135deg, #0d1b6e 0%, #1a3a8f 100%)',
        accent: '#1565C0',
    },
    {
        id: 2,
        name: 'Willow TV',
        description: 'Premium cricket coverage from around the world.',
        url: 'https://plu001.myturn1.top:8088/live/webcricwillow/playlist.m3u8?vidictid=20568121379&id=120375&pk=dbf564881d4a7e41eb02f5766fa3a03262932a2eba36779e5d9599bc8653f16e50d322d67e48aaa4b5f33adbd3144117469ea9a216cf0a7fde969aae5571aad7',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbWZIxXUmihcWrgCCVhd-McRNUqiofRyOdig&s',
        gradient: 'linear-gradient(135deg, #1a5c1a 0%, #2e7d32 100%)',
        accent: '#2E7D32',
    },
    {
        id: 3,
        name: 'Sky Sports',
        description: 'Ad-free live sports streaming — cricket, football & more.',
        url: 'https://muc002.myturn1.top:8088/live/webcricn02/playlist.m3u8?id=115656&pk=dbf564881d4a7e41eb02f5766fa3a03262932a2eba36779e5d9599bc8653f16e88aa75085d8dcdd3398efb6598e1dacc4d5c689d9ca5e384cd6d1057967f6298',
        logo: 'https://assets.goal.com/images/v3/blt46f04697e50c5900/sky%20sports%20logo%20image.png?auto=webp&format=pjpg&width=3840&quality=60',
        gradient: 'linear-gradient(135deg, #003c7a 0%, #0057b8 100%)',
        accent: '#0057B8',
    },
    {
        id: 4,
        name: 'Star Sports English',
        description: 'Live sports in English — cricket, football, kabaddi & more.',
        url: 'https://mhdtvhub.com/emb/1.html',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #0d1b6e 0%, #1a3a8f 100%)',
        accent: '#1565C0',
    },
    {
        id: 5,
        name: 'Star Sports Hindi',
        description: 'Live sports commentary & coverage in Hindi.',
        url: 'https://alymize.com/in/index.php?watch=009',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)',
        accent: '#E53935',
    },
    {
        id: 6,
        name: 'Star Sports Telugu',
        description: 'Live sports with Telugu commentary — cricket & more.',
        url: 'https://alymize.com/in/index.php?watch=011',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #e65100 0%, #ff6d00 100%)',
        accent: '#FF6D00',
    },
    {
        id: 7,
        name: 'Star Sports Tamil',
        description: 'Live sports with Tamil commentary — cricket & kabaddi.',
        url: 'https://alymize.com/in/index.php?watch=012',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
        accent: '#388E3C',
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
    },
    channel_logo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
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
}))

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

const Sports = () => {
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
                    {selectedChannel.url.includes('.m3u8') ? (
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
                    ) : (
                        <div className={classes.player_area}>
                            <iframe
                                src={selectedChannel.url}
                                allowFullScreen
                                allow="autoplay; encrypted-media; picture-in-picture"
                                title={selectedChannel.name}
                                className={classes.player_frame}
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h1 className={`${classes.page_title} list_page_title`}>Live Sports TV</h1>
                    <Grid container className={classes.grid_wrapper}>
                        {CHANNELS.map((channel) => (
                            <Grid item key={channel.id} xs={12} sm={6} md={4} className={classes.grid_item}>
                                <Card className={classes.card} onClick={() => setSelectedChannel(channel)}>
                                    <CardActionArea className={classes.card_action}>
                                        <div className={classes.card_banner}>
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

export default Sports
