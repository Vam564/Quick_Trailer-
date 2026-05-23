import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
    Grid, Card, CardActionArea, CardMedia, CardContent,
    Typography, IconButton, Slider, Tooltip, Chip,
    InputBase, CircularProgress, Button
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import RepeatIcon from '@material-ui/icons/Repeat'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import GetAppIcon from '@material-ui/icons/GetApp'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import Header from '../Header/Header'
import { clearMusicSearch } from '../../store/actions/ListPageActionTypes'

const SAAVN_BASE = 'https://jiosavan-api2.vercel.app/api'

const mapTrack = (t) => ({
    id: t.id,
    title: t.name || '',
    artist: t.artists?.primary?.map(a => a.name).join(', ') || '',
    cover: t.image?.[2]?.url || t.image?.[1]?.url || '',
    previewUrl: t.downloadUrl?.[4]?.url || t.downloadUrl?.[3]?.url || t.downloadUrl?.[2]?.url || '',
})

const CATEGORIES = [
    { label: '🔥 Top Hits', queries: [
        'top hits', 'billboard hot 100', 'best songs',
        'chart toppers', 'popular music', 'viral hits',
    ]},
    { label: '📈 Trending', queries: [
        'trending music', 'new music friday', 'viral songs',
        'tiktok hits', 'trending pop', 'this week hits',
    ]},
    { label: '🎬 Telugu', queries: [
        'thaman s', 'devi sri prasad', 'allu arjun',
        'mahesh babu songs', 'prabhas songs', 'pawan kalyan songs',
        'sid sriram telugu', 'anirudh telugu', 'ss thaman',
        'manisharma songs', 'mm keeravaani', 'telugu melody',
    ]},
    { label: '🎪 Bollywood', queries: [
        'arijit singh', 'atif aslam', 'shreya ghoshal',
        'sonu nigam songs', 'lata mangeshkar', 'kumar sanu',
        'kishore kumar', 'mohd rafi', 'neha kakkar',
        'yo yo honey singh', 'pritam songs', 'vishal shekhar',
    ]},
    { label: '🎭 Tamil', queries: [
        'anirudh ravichander', 'harris jayaraj', 'ar rahman tamil',
        'ilaiyaraaja', 'g v prakash kumar', 'd imman',
        'sid sriram', 'yuvan shankar raja', 'vijay songs',
        'ajith kumar songs', 'dhanush songs', 'sivakarthikeyan songs',
    ]},
    { label: '🎤 Hip Hop', queries: [
        'drake', 'kendrick lamar', 'j cole songs',
        'travis scott', 'post malone', 'cardi b',
        'nicki minaj', 'eminem', 'rap hits',
    ]},
    { label: '🌟 Pop', queries: [
        'taylor swift', 'ed sheeran', 'dua lipa',
        'the weeknd', 'ariana grande', 'harry styles',
        'billie eilish', 'olivia rodrigo', 'sabrina carpenter',
    ]},
    { label: '🎸 Rock', queries: [
        'linkin park', 'imagine dragons', 'coldplay',
        'green day', 'metallica', 'ac dc',
        'led zeppelin', 'queen songs', 'foo fighters',
    ]},
    { label: '💕 Romantic', queries: [
        'arijit singh romantic', 'shreya ghoshal love songs', 'sid sriram love',
        'romantic hindi songs', 'telugu love songs', 'adele songs',
        'ed sheeran love', 'john legend', 'romantic melody',
    ]},
    { label: '🎉 Party Mix', queries: [
        'dance party hits', 'edm party', 'club hits',
        'david guetta', 'calvin harris', 'martin garrix',
        'party anthems', 'dj snake', 'zedd songs',
    ]},
    { label: '😴 Chill', queries: [
        'lofi hip hop', 'chill songs', 'relaxing music',
        'study music', 'ambient music', 'chillout',
        'coffee shop music', 'peaceful songs', 'calm music',
    ]},
    { label: '🌍 K-Pop', queries: [
        'bts', 'blackpink', 'stray kids',
        'twice', 'exo songs', 'nct 127',
        'aespa', 'ive kpop', 'newjeans',
    ]},
]

const useStyles = makeStyles((theme) => ({
    page: {
        minHeight: '100vh',
        background: '#f5f5f5',
        paddingBottom: 120,
        color: '#333',
    },
    top_bar: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px 8px',
    },
    page_title: {
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
        margin: 0,
        fontSize: 22,
    },
    search_bar: {
        display: 'flex',
        alignItems: 'center',
        background: '#ebebeb',
        borderRadius: 24,
        padding: '6px 16px',
        gap: 8,
        margin: '0 24px 12px',
        maxWidth: 480,
    },
    search_input: {
        color: '#333',
        flex: 1,
        fontSize: 14,
    },
    search_icon_color: { color: '#999', fontSize: 18 },
    categories_row: {
        display: 'flex',
        overflowX: 'auto',
        gap: 10,
        padding: '0 24px 16px',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
    },
    chip: {
        background: '#e0e0e0',
        color: '#555',
        fontWeight: 600,
        cursor: 'pointer',
        flexShrink: 0,
    },
    chip_active: {
        background: '#1DB954 !important',
        color: '#fff !important',
    },
    section_header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px 12px',
    },
    section_title: {
        color: '#4d4d4d',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 0,
    },
    song_count: {
        color: '#999',
        fontSize: 12,
    },
    grid_wrapper: { padding: '0 12px 20px' },
    card: {
        width: 170,
        background: '#fff',
        borderRadius: 8,
        margin: 10,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
    },
    card_active: { outline: '2px solid #1DB954', background: '#f0faf4 !important' },
    card_img: { height: 170, objectFit: 'cover', background: '#333' },
    card_img_placeholder: {
        height: 170,
        background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    play_overlay: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        opacity: 0,
        transition: 'opacity 0.2s',
        '$card:hover &': { opacity: 1 },
    },
    play_overlay_icon: {
        color: '#1DB954',
        fontSize: 52,
        background: '#000',
        borderRadius: '50%',
        padding: 4,
    },
    card_content: { padding: '10px 12px 12px !important' },
    song_title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        margin: '0 0 4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    song_artist: {
        fontSize: 11,
        color: '#9b9b9b',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    no_data: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        color: '#9b9b9b',
    },
    loading_center: { display: 'flex', justifyContent: 'center', padding: 60 },
    load_more_row: {
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0 24px',
    },
    load_more_btn: {
        background: '#e0e0e0',
        color: '#444',
        borderRadius: 24,
        padding: '8px 32px',
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': { background: '#d0d0d0' },
        '&:disabled': { color: '#aaa' },
    },
    player_bar: {
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: '#fff',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        zIndex: 1000,
        gap: 12,
        [theme.breakpoints.down('sm')]: { flexWrap: 'wrap', padding: '8px 12px' },
    },
    player_art: {
        width: 52, height: 52, borderRadius: 6,
        objectFit: 'cover', flexShrink: 0, background: '#333',
    },
    player_art_placeholder: {
        width: 52, height: 52, borderRadius: 6,
        background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    player_info: { minWidth: 0, flex: '0 0 150px' },
    player_title: {
        fontSize: 13, fontWeight: 'bold', color: '#222', margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    player_artist: {
        fontSize: 11, color: '#777', margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    player_controls: { display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 },
    play_btn: {
        background: '#1DB954', color: '#fff', padding: 6,
        '&:hover': { background: '#17a349' },
    },
    icon_btn: { color: '#9b9b9b', '&:hover': { color: '#333' } },
    icon_active: { color: '#1DB954 !important' },
    player_progress: {
        flex: 1, minWidth: 80, display: 'flex', alignItems: 'center', gap: 8,
    },
    time_label: { fontSize: 11, color: '#999', flexShrink: 0, minWidth: 36 },
    volume_section: {
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, width: 120,
        [theme.breakpoints.down('sm')]: { display: 'none' },
    },
    dl_btn: { color: '#9b9b9b', flexShrink: 0, '&:hover': { color: '#1DB954' } },
}))

const fmt = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

const dedup = (arr) => {
    const seen = new Set()
    return arr.filter((s) => {
        const key = s.id || s.title
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

const Music = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { musicSearchData, musicSearchFlag, searchValue } = useSelector(s => s.ListPageReducer)

    const [songs, setSongs]                             = useState([])
    const [loadingCat, setLoadingCat]                   = useState(false)
    const [loadingMore, setLoadingMore]                 = useState(false)
    const [currentCategory, setCurrentCategory]         = useState(CATEGORIES[0])
    const [queryIndex, setQueryIndex]                   = useState(0)
    const [localSearch, setLocalSearch]                 = useState('')
    const [localSearchResults, setLocalSearchResults]   = useState(null)
    const [localSearchLoading, setLocalSearchLoading]   = useState(false)

    const [currentSong, setCurrentSong]   = useState(null)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [isPlaying, setIsPlaying]       = useState(false)
    const [streamUrl, setStreamUrl]       = useState('')
    const [duration, setDuration]         = useState(0)
    const [currentTime, setCurrentTime]   = useState(0)
    const [volume, setVolume]             = useState(0.8)
    const [muted, setMuted]               = useState(false)
    const [shuffle, setShuffle]           = useState(false)
    const [repeat, setRepeat]             = useState('none')
    const [downloading, setDownloading]   = useState(false)

    const audioRef       = useRef(null)
    const searchTimerRef = useRef(null)
    const loaderRef      = useRef(null)

    const displaySongs = musicSearchFlag
        ? musicSearchData
        : localSearchResults !== null
            ? localSearchResults
            : songs

    const activeSectionLabel = musicSearchFlag
        ? `Results for "${searchValue}"`
        : localSearchResults !== null
            ? `Results for "${localSearch}"`
            : currentCategory.label

    const hasMoreQueries = queryIndex + 1 < currentCategory.queries.length

    const fetchQuery = useCallback((query, append = false) => {
        return axios.get(`${SAAVN_BASE}/search/songs`, {
            params: { query, limit: 50 }
        })
        .then((res) => {
            const data = (res.data?.data?.results || []).map(mapTrack)
            if (append) setSongs(prev => dedup([...prev, ...data]))
            else setSongs(dedup(data))
            return data
        })
    }, [])

    useEffect(() => {
        setLoadingCat(true)
        fetchQuery(CATEGORIES[0].queries[0])
            .catch(e => console.log(e))
            .finally(() => setLoadingCat(false))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
    }, [volume, muted])

    useEffect(() => {
        if (musicSearchFlag) { setLocalSearch(''); setLocalSearchResults(null) }
    }, [musicSearchFlag])

    useEffect(() => {
        if (!loaderRef.current) return
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && !loadingCat && hasMoreQueries
                    && !musicSearchFlag && localSearchResults === null) {
                    handleLoadMore()
                }
            },
            { threshold: 0.1 }
        )
        obs.observe(loaderRef.current)
        return () => obs.disconnect()
        // eslint-disable-next-line
    }, [loadingMore, loadingCat, hasMoreQueries, musicSearchFlag, localSearchResults, queryIndex])

    const handleLoadMore = () => {
        const nextIdx = queryIndex + 1
        if (nextIdx >= currentCategory.queries.length) return
        setLoadingMore(true)
        setQueryIndex(nextIdx)
        fetchQuery(currentCategory.queries[nextIdx], true)
            .catch(e => console.log(e))
            .finally(() => setLoadingMore(false))
    }

    const handleCategoryClick = (cat) => {
        setCurrentCategory(cat)
        setQueryIndex(0)
        setLocalSearch('')
        setLocalSearchResults(null)
        if (musicSearchFlag) dispatch(clearMusicSearch())
        setLoadingCat(true)
        fetchQuery(cat.queries[0])
            .catch(e => console.log(e))
            .finally(() => setLoadingCat(false))
    }

    const handleLocalSearch = (e) => {
        const value = e.target.value
        setLocalSearch(value)
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
        if (!value.trim()) { setLocalSearchResults(null); return }
        setLocalSearchLoading(true)
        searchTimerRef.current = setTimeout(() => {
            axios.get(`${SAAVN_BASE}/search/songs`, {
                params: { query: value, limit: 50 }
            })
            .then((res) => {
                const data = (res.data?.data?.results || []).map(mapTrack)
                setLocalSearchResults(data)
            })
            .catch(e => console.log(e))
            .finally(() => setLocalSearchLoading(false))
        }, 500)
    }

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
        else audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    const playSong = (song, index) => {
        if (currentSong === song) { togglePlay(); return }
        setCurrentSong(song)
        setCurrentIndex(index)
        setStreamUrl(song.previewUrl || '')
    }

    useEffect(() => {
        if (!streamUrl || !audioRef.current) return
        audioRef.current.src = streamUrl
        audioRef.current.load()
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }, [streamUrl])

    const getNextIndex = () => {
        if (shuffle) {
            let idx
            do { idx = Math.floor(Math.random() * displaySongs.length) } while (idx === currentIndex && displaySongs.length > 1)
            return idx
        }
        return (currentIndex + 1) % displaySongs.length
    }

    const skipNext = () => {
        if (!displaySongs.length) return
        const next = getNextIndex()
        playSong(displaySongs[next], next)
    }

    const cycleRepeat = () => {
        setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')
    }

    const skipPrev = () => {
        if (!displaySongs.length) return
        if (audioRef.current && audioRef.current.currentTime > 3) { audioRef.current.currentTime = 0; return }
        const prev = (currentIndex - 1 + displaySongs.length) % displaySongs.length
        playSong(displaySongs[prev], prev)
    }

    const handleEnded = () => {
        if (repeat === 'one') { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}) }
        else if (repeat === 'all' || currentIndex < displaySongs.length - 1) skipNext()
        else setIsPlaying(false)
    }

    const handleSeek = (_, val) => {
        if (audioRef.current) { audioRef.current.currentTime = val; setCurrentTime(val) }
    }

    const handleDownload = async () => {
        if (!currentSong || downloading) return
        setDownloading(true)
        try {
            const url = currentSong.previewUrl || ''
            if (!url) return
            const a = document.createElement('a')
            a.href = url; a.download = `${currentSong.title || 'song'}.mp3`
            a.target = '_blank'; a.rel = 'noopener noreferrer'
            document.body.appendChild(a); a.click(); document.body.removeChild(a)
        } catch (e) { console.log(e) }
        finally { setDownloading(false) }
    }

    const getArtwork = (song) => song.cover || ''
    const getTitle   = (song) => song.title || ''
    const getArtist  = (song) => song.artist || ''

    return (
        <div className={classes.page}>
            <Header />

            <div className={classes.top_bar}>
                <h1 className={classes.page_title}>Music</h1>
            </div>

            <div className={classes.search_bar}>
                <SearchIcon className={classes.search_icon_color} />
                <InputBase
                    className={classes.search_input}
                    placeholder="Search songs, artists…"
                    value={localSearch}
                    onChange={handleLocalSearch}
                    inputProps={{ 'aria-label': 'search songs' }}
                />
                {localSearchLoading && <CircularProgress size={16} style={{ color: '#1DB954' }} />}
            </div>

            {!musicSearchFlag && (
                <div className={classes.categories_row}>
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat.label}
                            label={cat.label}
                            className={`${classes.chip} ${currentCategory.label === cat.label && !localSearchResults ? classes.chip_active : ''}`}
                            onClick={() => handleCategoryClick(cat)}
                            clickable
                        />
                    ))}
                </div>
            )}

            <div className={classes.section_header}>
                <span className={classes.section_title}>{activeSectionLabel}</span>
                <span className={classes.song_count}>{displaySongs.length} songs</span>
            </div>

            {loadingCat ? (
                <div className={classes.loading_center}>
                    <CircularProgress style={{ color: '#1DB954' }} />
                </div>
            ) : (
                <>
                    <Grid container justifyContent="center" className={classes.grid_wrapper}>
                        {displaySongs.length === 0 ? (
                            <div className={classes.no_data}>
                                <MusicNoteIcon style={{ fontSize: 48, marginBottom: 12 }} />
                                <span>No songs found</span>
                            </div>
                        ) : (
                            displaySongs.map((song, i) => (
                                <Grid item key={`${song.id}-${i}`}>
                                    <Tooltip title={getTitle(song)} placement="top">
                                        <Card
                                            className={`${classes.card} ${currentSong === song ? classes.card_active : ''}`}
                                            onClick={() => playSong(song, i)}
                                        >
                                            <CardActionArea>
                                                <div style={{ position: 'relative' }}>
                                                    {getArtwork(song) ? (
                                                        <CardMedia
                                                            component="img"
                                                            image={getArtwork(song)}
                                                            alt={getTitle(song)}
                                                            className={classes.card_img}
                                                            onError={(e) => { e.target.style.display = 'none' }}
                                                        />
                                                    ) : (
                                                        <div className={classes.card_img_placeholder}>
                                                            <MusicNoteIcon style={{ color: 'rgba(255,255,255,0.4)', fontSize: 40 }} />
                                                        </div>
                                                    )}
                                                    <div className={classes.play_overlay}>
                                                        {currentSong === song && isPlaying
                                                            ? <PauseIcon className={classes.play_overlay_icon} />
                                                            : <PlayArrowIcon className={classes.play_overlay_icon} />
                                                        }
                                                    </div>
                                                </div>
                                                <CardContent className={classes.card_content}>
                                                    <p className={classes.song_title}>{getTitle(song)}</p>
                                                    <Typography className={classes.song_artist}>{getArtist(song)}</Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Tooltip>
                                </Grid>
                            ))
                        )}
                    </Grid>

                    {!musicSearchFlag && localSearchResults === null && (
                        <div ref={loaderRef} className={classes.load_more_row}>
                            {loadingMore
                                ? <CircularProgress style={{ color: '#1DB954' }} />
                                : hasMoreQueries
                                    ? (
                                        <Button className={classes.load_more_btn} onClick={handleLoadMore}>
                                            Load More
                                        </Button>
                                    )
                                    : songs.length > 0 && (
                                        <span style={{ color: '#555', fontSize: 13 }}>You've seen all songs in this category</span>
                                    )
                            }
                        </div>
                    )}
                </>
            )}

            <audio
                ref={audioRef}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
                onEnded={handleEnded}
            />

            {currentSong && (
                <div className={classes.player_bar}>
                    {getArtwork(currentSong) ? (
                        <img src={getArtwork(currentSong)} alt="" className={classes.player_art} />
                    ) : (
                        <div className={classes.player_art_placeholder}>
                            <MusicNoteIcon style={{ color: 'rgba(255,255,255,0.5)' }} />
                        </div>
                    )}

                    <div className={classes.player_info}>
                        <p className={classes.player_title}>{getTitle(currentSong)}</p>
                        <p className={classes.player_artist}>{getArtist(currentSong)}</p>
                    </div>

                    <div className={classes.player_controls}>
                        <Tooltip title={shuffle ? 'Shuffle On' : 'Shuffle Off'}>
                            <IconButton size="small" className={`${classes.icon_btn} ${shuffle ? classes.icon_active : ''}`} onClick={() => setShuffle(s => !s)}>
                                <ShuffleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <IconButton size="small" className={classes.icon_btn} onClick={skipPrev}>
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton size="small" className={classes.play_btn} onClick={togglePlay}>
                            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton size="small" className={classes.icon_btn} onClick={skipNext}>
                            <SkipNextIcon />
                        </IconButton>
                        <Tooltip title={repeat === 'none' ? 'Repeat Off' : repeat === 'all' ? 'Repeat All' : 'Repeat One'}>
                            <IconButton size="small" className={`${classes.icon_btn} ${repeat !== 'none' ? classes.icon_active : ''}`} onClick={cycleRepeat}>
                                {repeat === 'one' ? <RepeatOneIcon fontSize="small" /> : <RepeatIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </div>

                    <div className={classes.player_progress}>
                        <span className={classes.time_label}>{fmt(currentTime)}</span>
                        <Slider min={0} max={duration || 1} value={currentTime} onChange={handleSeek} style={{ color: '#1DB954' }} />
                        <span className={classes.time_label}>{fmt(duration)}</span>
                    </div>

                    <div className={classes.volume_section}>
                        <IconButton size="small" className={classes.icon_btn} onClick={() => setMuted(m => !m)}>
                            {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                        </IconButton>
                        <Slider min={0} max={1} step={0.01} value={muted ? 0 : volume}
                            onChange={(_, v) => { setVolume(v); setMuted(false) }} style={{ color: '#1DB954' }} />
                    </div>

                    <Tooltip title="Download preview">
                        <IconButton size="small" className={classes.dl_btn} onClick={handleDownload} disabled={downloading}>
                            {downloading ? <CircularProgress size={18} style={{ color: '#1DB954' }} /> : <GetAppIcon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </div>
    )
}

export default Music
