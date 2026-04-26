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
import { setMusicSource, clearMusicSearch } from '../../store/actions/ListPageActionTypes'

const SPOTIFY_BASE = 'https://spotify.4texasplayz4.workers.dev'
const SC_BASE      = 'https://0.4texasplayz4.workers.dev'

// Each category has multiple query variants. Load More cycles through them.
const CATEGORIES = [
    { label: '🔥 Top Hits', queries: [
        'top hits 2024', 'global top 50 2024', 'best songs 2024',
        'billboard hot 100 2024', 'popular music 2024', 'viral hits 2024',
    ]},
    { label: '📈 Trending', queries: [
        'trending music 2024', 'trending songs this week', 'new music friday 2024',
        'viral songs 2024', 'tiktok hits 2024', 'trending pop 2024',
    ]},
    { label: '🎬 Telugu', queries: [
        'latest telugu hits 2024', 'telugu melody songs', 'telugu mass songs 2024',
        'telugu love songs', 'telugu old songs hits', 'telugu album songs 2024',
        'telugu folk songs', 'telugu beats 2024', 'allu arjun songs',
        'pawan kalyan songs', 'telugu sad songs', 'telugu nonstop hits',
    ]},
    { label: '🎪 Bollywood', queries: [
        'bollywood hits 2024', 'bollywood romantic songs', 'bollywood party songs',
        'hindi songs 2024', 'bollywood old songs', 'bollywood dance songs',
        'arijit singh songs', 'bollywood melody 2024', 'hindi album songs',
        'bollywood sad songs', 'bollywood item songs', 'bollywood nonstop mix',
    ]},
    { label: '🎭 Tamil', queries: [
        'tamil hits 2024', 'tamil melody songs', 'tamil mass songs',
        'tamil love songs', 'tamil old hits', 'vijay songs',
        'anirudh songs', 'tamil album 2024', 'tamil kuthu songs',
    ]},
    { label: '🎤 Hip Hop', queries: [
        'hip hop hits 2024', 'rap songs 2024', 'trap music 2024',
        'drake songs', 'kendrick lamar songs', 'hip hop old school',
        'r&b hip hop mix', 'rap god songs', 'hip hop playlist 2024',
    ]},
    { label: '🌟 Pop', queries: [
        'pop hits 2024', 'pop songs 2024', 'taylor swift songs',
        'ed sheeran songs', 'dua lipa songs', 'the weeknd songs',
        'ariana grande songs', 'pop music chart 2024', 'best pop 2024',
    ]},
    { label: '🎸 Rock', queries: [
        'rock hits', 'classic rock songs', 'rock music 2024',
        'linkin park songs', 'imagine dragons songs', 'rock anthem',
        'alternative rock', 'hard rock hits', 'rock ballads',
    ]},
    { label: '💕 Romantic', queries: [
        'romantic songs 2024', 'love songs playlist', 'romantic hindi songs',
        'romantic telugu songs', 'romantic english songs', 'wedding songs',
        'slow love songs', 'romantic melody 2024', 'best romantic hits',
    ]},
    { label: '🎉 Party Mix', queries: [
        'party mix hits', 'dance party songs 2024', 'edm party hits',
        'club hits 2024', 'party anthems', 'dance floor hits',
        'dj mix 2024', 'party nonstop songs', 'festival hits 2024',
    ]},
    { label: '😴 Chill', queries: [
        'chill lofi music', 'lofi hip hop beats', 'chill songs 2024',
        'relaxing music playlist', 'study music lofi', 'ambient chill',
        'chillout songs', 'lofi chill beats', 'calm music playlist',
    ]},
    { label: '🌍 K-Pop', queries: [
        'kpop hits 2024', 'bts songs', 'blackpink songs',
        'kpop girl group 2024', 'kpop boy band hits', 'stray kids songs',
        'twice songs', 'exo songs', 'kpop playlist 2024',
    ]},
]

const useStyles = makeStyles((theme) => ({
    page: {
        minHeight: '100vh',
        background: '#0f0f0f',
        paddingBottom: 120,
        color: '#fff',
    },
    top_bar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: '16px 24px 8px',
    },
    page_title: {
        color: '#fff',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
        margin: 0,
        fontSize: 22,
    },
    source_toggle: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
    source_btn: {
        padding: '6px 18px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: 12,
        transition: 'all 0.2s',
    },
    source_active: { background: '#1DB954', color: '#fff' },
    source_inactive: { background: '#282828', color: '#aaa' },
    search_bar: {
        display: 'flex',
        alignItems: 'center',
        background: '#282828',
        borderRadius: 24,
        padding: '6px 16px',
        gap: 8,
        margin: '0 24px 12px',
        maxWidth: 480,
    },
    search_input: {
        color: '#fff',
        flex: 1,
        fontSize: 14,
    },
    search_icon_color: { color: '#aaa', fontSize: 18 },
    categories_row: {
        display: 'flex',
        overflowX: 'auto',
        gap: 10,
        padding: '0 24px 16px',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
    },
    chip: {
        background: '#282828',
        color: '#ccc',
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
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 0,
    },
    song_count: {
        color: '#aaa',
        fontSize: 12,
    },
    grid_wrapper: { padding: '0 12px 20px' },
    card: {
        width: 170,
        background: '#181818',
        borderRadius: 8,
        margin: 10,
        transition: 'transform 0.2s ease, background 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', background: '#282828' },
    },
    card_active: { outline: '2px solid #1DB954', background: '#1a2e1f !important' },
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
        color: '#fff',
        margin: '0 0 4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    song_artist: {
        fontSize: 11,
        color: '#aaa',
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
        color: '#aaa',
    },
    loading_center: { display: 'flex', justifyContent: 'center', padding: 60 },
    load_more_row: {
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0 24px',
    },
    load_more_btn: {
        background: '#282828',
        color: '#fff',
        borderRadius: 24,
        padding: '8px 32px',
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': { background: '#383838' },
        '&:disabled': { color: '#555' },
    },
    // ---- Bottom player ----
    player_bar: {
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: '#181818',
        borderTop: '1px solid #282828',
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
        fontSize: 13, fontWeight: 'bold', color: '#fff', margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    player_artist: {
        fontSize: 11, color: '#aaa', margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    player_controls: { display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 },
    play_btn: {
        background: '#1DB954', color: '#fff', padding: 6,
        '&:hover': { background: '#17a349' },
    },
    icon_btn: { color: '#aaa', '&:hover': { color: '#fff' } },
    icon_active: { color: '#1DB954 !important' },
    player_progress: {
        flex: 1, minWidth: 80, display: 'flex', alignItems: 'center', gap: 8,
    },
    time_label: { fontSize: 11, color: '#aaa', flexShrink: 0, minWidth: 36 },
    volume_section: {
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, width: 120,
        [theme.breakpoints.down('sm')]: { display: 'none' },
    },
    loading_text: {
        fontSize: 12, color: '#1DB954', padding: '0 10px',
        display: 'flex', alignItems: 'center', gap: 6,
    },
    dl_btn: { color: '#aaa', flexShrink: 0, '&:hover': { color: '#1DB954' } },
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
        const key = s.id || s.url || s.title
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

const Music = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const { musicSearchData, musicSearchFlag, musicSource, searchValue } = useSelector(s => s.ListPageReducer)

    const [songs, setSongs]                             = useState([])
    const [loadingCat, setLoadingCat]                   = useState(false)
    const [loadingMore, setLoadingMore]                 = useState(false)
    const [currentCategory, setCurrentCategory]         = useState(CATEGORIES[0])
    const [queryIndex, setQueryIndex]                   = useState(0)  // which sub-query we're on
    const [localSearch, setLocalSearch]                 = useState('')
    const [localSearchResults, setLocalSearchResults]   = useState(null)
    const [localSearchLoading, setLocalSearchLoading]   = useState(false)

    const [currentSong, setCurrentSong]     = useState(null)
    const [currentIndex, setCurrentIndex]   = useState(-1)
    const [isPlaying, setIsPlaying]         = useState(false)
    const [streamUrl, setStreamUrl]         = useState('')
    const [loadingStream, setLoadingStream] = useState(false)
    const [duration, setDuration]           = useState(0)
    const [currentTime, setCurrentTime]     = useState(0)
    const [volume, setVolume]               = useState(0.8)
    const [muted, setMuted]                 = useState(false)
    const [shuffle, setShuffle]             = useState(false)
    const [repeat, setRepeat]               = useState('none')
    const [downloading, setDownloading]     = useState(false)

    const audioRef       = useRef(null)
    const searchTimerRef = useRef(null)
    const loaderRef      = useRef(null)   // sentinel div for intersection observer

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

    const fetchQuery = useCallback((query, source, append = false) => {
        const base = source === 'spotify' ? SPOTIFY_BASE : SC_BASE
        return axios.get(`${base}/s/${encodeURIComponent(query)}`)
            .then((res) => {
                const data = source === 'spotify' ? (res.data || []) : (res.data?.results || [])
                if (append) {
                    setSongs(prev => dedup([...prev, ...data]))
                } else {
                    setSongs(dedup(data))
                }
                return data
            })
    }, [])

    // Initial load
    useEffect(() => {
        setLoadingCat(true)
        fetchQuery(CATEGORIES[0].queries[0], musicSource)
            .catch(e => console.log(e))
            .finally(() => setLoadingCat(false))
        // eslint-disable-next-line
    }, [])

    // Reload when source changes
    useEffect(() => {
        if (musicSearchFlag || localSearchResults !== null) return
        setLoadingCat(true)
        setQueryIndex(0)
        fetchQuery(currentCategory.queries[0], musicSource)
            .catch(e => console.log(e))
            .finally(() => setLoadingCat(false))
        // eslint-disable-next-line
    }, [musicSource])

    // Sync volume
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = muted ? 0 : volume
    }, [volume, muted])

    // Clear local search when header search fires
    useEffect(() => {
        if (musicSearchFlag) { setLocalSearch(''); setLocalSearchResults(null) }
    }, [musicSearchFlag])

    // Infinite scroll: observe sentinel div
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
        fetchQuery(currentCategory.queries[nextIdx], musicSource, true)
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
        fetchQuery(cat.queries[0], musicSource)
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
            const base = musicSource === 'spotify' ? SPOTIFY_BASE : SC_BASE
            axios.get(`${base}/s/${encodeURIComponent(value)}`)
                .then((res) => {
                    const data = musicSource === 'spotify' ? (res.data || []) : (res.data?.results || [])
                    setLocalSearchResults(data)
                })
                .catch(e => console.log(e))
                .finally(() => setLocalSearchLoading(false))
        }, 500)
    }

    const getSpotifyStream = (song) => setStreamUrl(`${SPOTIFY_BASE}/d/${song.id}`)

    const getSoundCloudStream = async (song) => {
        const parts = song.url?.replace(/\/$/, '').split('/')
        const userSlug  = parts?.[parts.length - 2]
        const trackSlug = parts?.[parts.length - 1]
        if (!userSlug || !trackSlug) return
        const res = await axios.get(`${SC_BASE}/d/${userSlug}/${trackSlug}`)
        setStreamUrl(res.data?.streamUrl || '')
    }

    const playSong = async (song, index) => {
        setCurrentSong(song)
        setCurrentIndex(index)
        setLoadingStream(true)
        setStreamUrl('')
        try {
            if (musicSource === 'spotify') getSpotifyStream(song)
            else await getSoundCloudStream(song)
        } catch (e) { console.log(e) }
        finally { setLoadingStream(false) }
    }

    useEffect(() => {
        if (!streamUrl || !audioRef.current) return
        audioRef.current.src = streamUrl
        audioRef.current.load()
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }, [streamUrl])

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
        else audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }

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

    const handleSourceChange = (src) => {
        dispatch(setMusicSource(src))
        setCurrentSong(null); setStreamUrl(''); setIsPlaying(false)
        setLocalSearchResults(null); setLocalSearch('')
    }

    const handleDownload = async () => {
        if (!currentSong || downloading) return
        setDownloading(true)
        try {
            let url = streamUrl
            if (!url) {
                if (musicSource === 'spotify') url = `${SPOTIFY_BASE}/d/${currentSong.id}`
                else {
                    const parts = currentSong.url?.replace(/\/$/, '').split('/')
                    const res = await axios.get(`${SC_BASE}/d/${parts?.[parts.length - 2]}/${parts?.[parts.length - 1]}`)
                    url = res.data?.streamUrl || ''
                }
            }
            if (!url) return
            const a = document.createElement('a')
            a.href = url; a.download = `${getTitle(currentSong)}.mp3`
            a.target = '_blank'; a.rel = 'noopener noreferrer'
            document.body.appendChild(a); a.click(); document.body.removeChild(a)
        } catch (e) { console.log(e) }
        finally { setDownloading(false) }
    }

    const getArtwork = (song) => song.cover || song.artwork || ''
    const getTitle   = (song) => song.title || ''
    const getArtist  = (song) => song.artist || ''

    return (
        <div className={classes.page}>
            <Header />

            <div className={classes.top_bar}>
                <h1 className={classes.page_title}>Music</h1>
                <div className={classes.source_toggle}>
                    {['spotify', 'soundcloud'].map(src => (
                        <button key={src}
                            className={`${classes.source_btn} ${musicSource === src ? classes.source_active : classes.source_inactive}`}
                            onClick={() => handleSourceChange(src)}
                        >
                            {src === 'spotify' ? 'Spotify' : 'SoundCloud'}
                        </button>
                    ))}
                </div>
            </div>

            {/* In-page search */}
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

            {/* Category chips */}
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
                                <Grid item key={`${song.id || song.url}-${i}`}>
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

                    {/* Infinite scroll sentinel + manual Load More button */}
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
                        <IconButton size="small" className={classes.play_btn} onClick={togglePlay} disabled={loadingStream}>
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

                    {loadingStream ? (
                        <span className={classes.loading_text}>
                            <CircularProgress size={14} style={{ color: '#1DB954' }} /> Loading…
                        </span>
                    ) : (
                        <div className={classes.player_progress}>
                            <span className={classes.time_label}>{fmt(currentTime)}</span>
                            <Slider min={0} max={duration || 1} value={currentTime} onChange={handleSeek} style={{ color: '#1DB954' }} />
                            <span className={classes.time_label}>{fmt(duration)}</span>
                        </div>
                    )}

                    <div className={classes.volume_section}>
                        <IconButton size="small" className={classes.icon_btn} onClick={() => setMuted(m => !m)}>
                            {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                        </IconButton>
                        <Slider min={0} max={1} step={0.01} value={muted ? 0 : volume}
                            onChange={(_, v) => { setVolume(v); setMuted(false) }} style={{ color: '#1DB954' }} />
                    </div>

                    <Tooltip title="Download song">
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
