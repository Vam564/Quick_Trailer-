import { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Card, CardActionArea, Typography, IconButton, Tabs, Tab, CircularProgress } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import ReactPlayer from 'react-player'
import Header from '../../Header/Header'

const PPV_API = 'https://api.ppv.to/api/streams'

const CRICKET_CHANNELS = [
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
        url: 'https://nagadu.nettv.fun/tata1212121212/player.php?id=246',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #0d1b6e 0%, #1a3a8f 100%)',
        accent: '#1565C0',
    },
    {
        id: 5,
        name: 'Star Sports Hindi',
        description: 'Live sports commentary & coverage in Hindi.',
        url: 'https://nagadu.nettv.fun/tata1212121212/player.php?id=1033',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)',
        accent: '#E53935',
    },
    {
        id: 6,
        name: 'Star Sports Telugu',
        description: 'Live sports with Telugu commentary — cricket & more.',
        url: 'https://nagadu.nettv.fun/tata1212121212/player.php?id=980',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #e65100 0%, #ff6d00 100%)',
        accent: '#FF6D00',
    },
    {
        id: 7,
        name: 'Star Sports Tamil',
        description: 'Live sports with Tamil commentary — cricket & kabaddi.',
        url: 'https://nagadu.nettv.fun/tata1212121212/player.php?id=24',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Star_Sports_1_HD.png/960px-Star_Sports_1_HD.png',
        gradient: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
        accent: '#388E3C',
    },
]

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

const isStreamLive = (s) => {
    if (s.always_live) return true
    const now = Date.now() / 1000
    return s.starts_at <= now && (!s.ends_at || s.ends_at >= now)
}

const formatMatchTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts * 1000)
    const now = new Date()
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (d.toDateString() === now.toDateString()) return `Today • ${timeStr}`
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timeStr}`
}

const useStyles = makeStyles((theme) => ({
    page: { minHeight: '100vh', background: '#f5f5f5' },
    tabs_bar: {
        background: '#fff',
        borderBottom: '2px solid #e0e0e0',
    },
    tabs_root: { maxWidth: 360 },
    tab_root: { textTransform: 'none', fontWeight: 'bold', fontSize: 15, minWidth: 120 },
    page_title: {
        paddingLeft: 30,
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
    },
    grid_wrapper: {
        padding: '20px 16px 100px',
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: { padding: '20px 24px 40px' },
    },
    grid_item: {
        padding: '8px',
        width: '100%',
        [theme.breakpoints.up('sm')]: { padding: '10px 12px' },
    },
    // Cricket channel cards
    card: {
        width: '100%', borderRadius: 12, overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 40px rgba(0,0,0,0.22)' },
    },
    card_action: { display: 'block' },
    card_banner: { height: 200, position: 'relative', overflow: 'hidden' },
    channel_logo: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    card_content: { padding: '14px 16px 16px', background: '#fff' },
    channel_name: { fontSize: 16, fontWeight: 'bold', color: '#222', margin: '0 0 6px' },
    channel_desc: { fontSize: 13, color: '#777', margin: 0, lineHeight: 1.5 },
    // Football match cards
    match_card: {
        width: '100%', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        background: '#111',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' },
    },
    match_poster: { position: 'relative', height: 190, background: '#222', overflow: 'hidden' },
    match_poster_img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    match_poster_overlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.05) 55%)',
    },
    match_tag: {
        position: 'absolute', top: 10, left: 10,
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
        color: '#fff', fontSize: 11, fontWeight: 'bold',
        padding: '3px 9px', borderRadius: 4, letterSpacing: 0.5,
        border: '1px solid rgba(255,255,255,0.2)',
    },
    match_info: { padding: '11px 14px 14px', background: '#1a1a1a' },
    match_name: { fontSize: 14, fontWeight: 'bold', color: '#fff', margin: '0 0 5px', lineHeight: 1.35 },
    match_meta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    match_time: { fontSize: 12, color: '#999', margin: 0 },
    match_viewers: { fontSize: 11, color: '#777' },
    // Shared badges
    live_badge: {
        position: 'absolute', top: 10, right: 10,
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(229,9,20,0.92)', color: '#fff',
        fontSize: 11, fontWeight: 'bold', padding: '3px 8px',
        borderRadius: 4, letterSpacing: 1,
    },
    upcoming_badge: {
        position: 'absolute', top: 10, right: 10,
        background: 'rgba(0,0,0,0.6)', color: '#ccc',
        fontSize: 11, fontWeight: 600, padding: '3px 8px',
        borderRadius: 4, letterSpacing: 0.5,
    },
    live_dot: { fontSize: 10, animation: '$blink 1.2s infinite' },
    '@keyframes blink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.2 } },
    // States
    loading_box: { display: 'flex', justifyContent: 'center', padding: '80px 0' },
    empty_box: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '80px 24px', color: '#999', textAlign: 'center',
    },
    // Player
    player_topbar: {
        display: 'flex', alignItems: 'center',
        background: '#111', padding: '0 8px', height: 48, gap: 8, flexShrink: 0,
    },
    player_back_btn: { color: '#fff' },
    live_label: {
        background: '#e50914', color: '#fff', fontSize: 11,
        fontWeight: 'bold', padding: '2px 8px', borderRadius: 4,
        letterSpacing: 1, flexShrink: 0,
    },
    upcoming_label: {
        background: '#555', color: '#ddd', fontSize: 11,
        fontWeight: 'bold', padding: '2px 8px', borderRadius: 4,
        letterSpacing: 1, flexShrink: 0,
    },
    player_title: { color: '#fff', fontWeight: 'bold', fontSize: 15, flex: 1 },
    player_area: { width: '100%', background: '#000', display: 'flex', justifyContent: 'center' },
    player_frame: {
        height: 'calc(100vh - 113px)', aspectRatio: '16/9',
        maxWidth: '100%', border: 'none', display: 'block', background: '#000',
    },
    player_react_wrapper: {
        height: 'calc(100vh - 113px)', aspectRatio: '16/9', maxWidth: '100%', background: '#000',
    },
}))

const Sports = () => {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)
    const [footballStreams, setFootballStreams] = useState([])
    const [loadingFootball, setLoadingFootball] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        setLoadingFootball(true)
        axios.get(PPV_API)
            .then((res) => {
                const cat = (res.data.streams || []).find((s) => s.category === 'Football')
                setFootballStreams(cat ? cat.streams : [])
            })
            .catch(() => setFootballStreams([]))
            .finally(() => setLoadingFootball(false))
    }, [])

    const openChannel = (channel) => {
        setSelectedItem({
            name: channel.name,
            url: channel.url,
            type: channel.url.includes('.m3u8') ? 'hls' : 'iframe',
            live: true,
        })
    }

    const openMatch = (match) => {
        setSelectedItem({
            name: match.name,
            url: match.iframe,
            type: 'iframe',
            live: isStreamLive(match),
        })
    }

    if (selectedItem) {
        return (
            <div style={{ background: '#000', minHeight: '100vh' }}>
                <Header />
                <div className={classes.player_topbar}>
                    <IconButton className={classes.player_back_btn} onClick={() => setSelectedItem(null)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <span className={selectedItem.live ? classes.live_label : classes.upcoming_label}>
                        {selectedItem.live ? 'LIVE' : 'UPCOMING'}
                    </span>
                    <Typography className={classes.player_title}>{selectedItem.name}</Typography>
                </div>
                {selectedItem.type === 'hls' ? (
                    <div className={classes.player_react_wrapper}>
                        <ReactPlayer
                            url={selectedItem.url}
                            width="100%"
                            height="100%"
                            playing
                            controls
                            playsinline
                            config={{ file: { forceHLS: !isIOS, attributes: { playsInline: true } } }}
                        />
                    </div>
                ) : (
                    <div className={classes.player_area}>
                        <iframe
                            src={selectedItem.url}
                            allowFullScreen
                            allow="autoplay; encrypted-media; picture-in-picture"
                            title={selectedItem.name}
                            className={classes.player_frame}
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={classes.page}>
            <Header />
            <h1 className={`${classes.page_title} list_page_title`}>Live Sports</h1>

            <div className={classes.tabs_bar}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    indicatorColor="primary"
                    textColor="primary"
                    className={classes.tabs_root}
                >
                    <Tab label="Cricket" className={classes.tab_root} />
                    <Tab label="Football" className={classes.tab_root} />
                </Tabs>
            </div>

            {activeTab === 0 && (
                <Grid container className={classes.grid_wrapper}>
                    {CRICKET_CHANNELS.map((channel) => (
                        <Grid item key={channel.id} xs={12} sm={6} md={4} className={classes.grid_item}>
                            <Card className={classes.card} onClick={() => openChannel(channel)}>
                                <CardActionArea className={classes.card_action}>
                                    <div className={classes.card_banner} style={{ background: channel.gradient }}>
                                        <img
                                            src={channel.logo}
                                            alt={channel.name}
                                            className={classes.channel_logo}
                                            onError={(e) => { e.target.style.display = 'none' }}
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
            )}

            {activeTab === 1 && (
                loadingFootball ? (
                    <div className={classes.loading_box}>
                        <CircularProgress color="primary" />
                    </div>
                ) : footballStreams.length === 0 ? (
                    <div className={classes.empty_box}>
                        <Typography variant="h6" style={{ color: '#555' }}>No matches scheduled</Typography>
                        <Typography variant="body2" style={{ marginTop: 8 }}>
                            Check back later for live and upcoming football streams
                        </Typography>
                    </div>
                ) : (
                    <Grid container className={classes.grid_wrapper}>
                        {footballStreams.map((match) => {
                            const live = isStreamLive(match)
                            const viewers = parseInt(match.viewers || '0')
                            return (
                                <Grid item key={match.id} xs={12} sm={6} md={4} className={classes.grid_item}>
                                    <div className={classes.match_card} onClick={() => openMatch(match)}>
                                        <div className={classes.match_poster}>
                                            <img
                                                src={match.poster}
                                                alt={match.name}
                                                className={classes.match_poster_img}
                                            />
                                            <div className={classes.match_poster_overlay} />
                                            {match.tag && <span className={classes.match_tag}>{match.tag}</span>}
                                            {live ? (
                                                <div className={classes.live_badge}>
                                                    <FiberManualRecordIcon className={classes.live_dot} />
                                                    LIVE
                                                </div>
                                            ) : (
                                                <div className={classes.upcoming_badge}>UPCOMING</div>
                                            )}
                                        </div>
                                        <div className={classes.match_info}>
                                            <p className={classes.match_name}>{match.name}</p>
                                            <div className={classes.match_meta}>
                                                <p className={classes.match_time}>{formatMatchTime(match.starts_at)}</p>
                                                {viewers > 0 && (
                                                    <span className={classes.match_viewers}>{viewers.toLocaleString()} watching</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        })}
                    </Grid>
                )
            )}
        </div>
    )
}

export default Sports
