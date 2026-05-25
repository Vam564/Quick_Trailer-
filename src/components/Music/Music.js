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
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import RepeatIcon from '@material-ui/icons/Repeat'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import GetAppIcon from '@material-ui/icons/GetApp'
import SearchIcon from '@material-ui/icons/Search'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FastRewindIcon from '@material-ui/icons/FastRewind'
import FastForwardIcon from '@material-ui/icons/FastForward'
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
    duration: Number(t.duration) || 0,
})

const mapAlbum = (a) => ({
    id: a.id,
    name: a.name || '',
    artist: a.artists?.primary?.map(x => x.name).join(', ') || '',
    cover: a.image?.[2]?.url || a.image?.[1]?.url || '',
    year: a.year || '',
    language: a.language || '',
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

// Each query yields up to 40 albums per page; pages keep loading until saavn returns empty
const ALBUM_CATEGORIES = [
    { label: '🎬 Telugu', queries: [
        'telugu movie', 'tollywood', 'telugu film',
        'thaman s', 'devi sri prasad', 'manisharma',
        'mm keeravaani', 'telugu cinema',
    ]},
    { label: '🎪 Hindi', queries: [
        'hindi movie', 'bollywood', 'hindi film',
        'arijit singh', 'pritam', 'vishal shekhar',
        'ar rahman hindi', 'shankar ehsaan loy',
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
        padding: '16px 24px 0',
    },
    page_title: {
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
        margin: 0,
        fontSize: 22,
    },
    tab_bar: {
        display: 'flex',
        borderBottom: '2px solid #e0e0e0',
        margin: '8px 24px 0',
    },
    tab_btn: {
        padding: '10px 24px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 700,
        color: '#999',
        borderBottom: '3px solid transparent',
        marginBottom: -2,
        transition: 'color 0.2s, border-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    tab_btn_active: {
        color: '#1DB954',
        borderBottomColor: '#1DB954',
    },
    search_bar: {
        display: 'flex',
        alignItems: 'center',
        background: '#ebebeb',
        borderRadius: 24,
        padding: '6px 16px',
        gap: 8,
        margin: '12px 24px',
        maxWidth: 480,
    },
    search_input: { color: '#333', flex: 1, fontSize: 14 },
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
    section_title: { color: '#4d4d4d', fontSize: 16, fontWeight: 'bold', margin: 0 },
    song_count: { color: '#999', fontSize: 12 },
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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    play_overlay: {
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s',
        '$card:hover &': { opacity: 1 },
    },
    play_overlay_icon: {
        color: '#1DB954', fontSize: 52, background: '#000', borderRadius: '50%', padding: 4,
    },
    card_content: { padding: '10px 12px 12px !important' },
    song_title: {
        fontSize: 12, fontWeight: 'bold', color: '#333', margin: '0 0 4px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    song_artist: {
        fontSize: 11, color: '#9b9b9b', margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    // ----- Album card -----
    album_card: {
        width: 170,
        background: '#fff',
        borderRadius: 8,
        margin: 10,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
    },
    album_img: { height: 170, objectFit: 'cover', background: '#ddd', borderRadius: '8px 8px 0 0' },
    album_img_placeholder: {
        height: 170,
        background: 'linear-gradient(135deg, #333 0%, #555 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '8px 8px 0 0',
    },
    album_content: { padding: '10px 12px 12px' },
    album_name: {
        fontSize: 12, fontWeight: 'bold', color: '#333', margin: '0 0 4px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    album_artist: {
        fontSize: 11, color: '#9b9b9b', margin: '0 0 4px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    album_year: {
        fontSize: 10, background: '#1DB954', color: '#fff',
        borderRadius: 4, padding: '2px 6px', display: 'inline-block',
    },
    // ----- Album detail (songs list) -----
    album_back_bar: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 24px',
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
    },
    album_detail_cover: {
        width: 64, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
    },
    album_detail_cover_placeholder: {
        width: 64, height: 64, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg, #333 0%, #555 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    album_detail_info: { flex: 1, minWidth: 0 },
    album_detail_name: {
        fontSize: 16, fontWeight: 'bold', color: '#222', margin: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    album_detail_sub: { fontSize: 12, color: '#777', margin: '3px 0 0' },
    // ----- Track list -----
    track_list: { background: '#fff', margin: '12px 0', borderRadius: 0 },
    track_row: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 24px',
        cursor: 'pointer',
        borderBottom: '1px solid #f5f5f5',
        transition: 'background 0.15s',
        '&:hover': { background: '#f9f9f9' },
    },
    track_row_active: { background: '#f0faf4 !important' },
    track_num: { width: 28, fontSize: 12, color: '#aaa', flexShrink: 0, textAlign: 'center' },
    track_thumb: { width: 40, height: 40, borderRadius: 4, objectFit: 'cover', flexShrink: 0, marginRight: 12 },
    track_thumb_placeholder: {
        width: 40, height: 40, borderRadius: 4, flexShrink: 0, marginRight: 12,
        background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    track_info: { flex: 1, minWidth: 0 },
    track_title: {
        fontSize: 13, fontWeight: 600, color: '#333',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
    },
    track_title_active: { color: '#1DB954 !important' },
    track_artist: { fontSize: 11, color: '#999', margin: '2px 0 0' },
    track_duration: { fontSize: 11, color: '#bbb', flexShrink: 0, marginLeft: 12 },
    // ----- Shared -----
    no_data: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: 60, color: '#9b9b9b',
    },
    loading_center: { display: 'flex', justifyContent: 'center', padding: 60 },
    load_more_row: { display: 'flex', justifyContent: 'center', padding: '8px 0 24px' },
    load_more_btn: {
        background: '#e0e0e0', color: '#444', borderRadius: 24, padding: '8px 32px',
        textTransform: 'none', fontWeight: 'bold',
        '&:hover': { background: '#d0d0d0' },
    },
    // ----- Player bar -----
    player_bar: {
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', padding: '10px 20px', zIndex: 1000, gap: 12,
        [theme.breakpoints.down('sm')]: { flexWrap: 'wrap', padding: '8px 12px' },
    },
    player_art: { width: 52, height: 52, borderRadius: 6, objectFit: 'cover', flexShrink: 0 },
    player_art_placeholder: {
        width: 52, height: 52, borderRadius: 6, flexShrink: 0,
        background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
    play_btn: { background: '#1DB954', color: '#fff', padding: 6, '&:hover': { background: '#17a349' } },
    icon_btn: { color: '#9b9b9b', '&:hover': { color: '#333' } },
    icon_active: { color: '#1DB954 !important' },
    player_progress: { flex: 1, minWidth: 80, display: 'flex', alignItems: 'center', gap: 8 },
    time_label: { fontSize: 11, color: '#999', flexShrink: 0, minWidth: 36 },
    volume_section: {
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, width: 120,
        [theme.breakpoints.down('sm')]: { display: 'none' },
    },
    dl_btn: { color: '#9b9b9b', flexShrink: 0, '&:hover': { color: '#1DB954' } },
    loop_btn: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '5px 14px',
        border: '1.5px solid #e0e0e0',
        borderRadius: 20,
        background: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        color: '#aaa',
        transition: 'all 0.2s',
        flexShrink: 0,
        '&:hover': { borderColor: '#1DB954', color: '#1DB954' },
    },
    loop_btn_active: {
        borderColor: '#1DB954 !important',
        color: '#1DB954 !important',
        background: 'rgba(29,185,84,0.1)',
    },
    // ----- Expanded player -----
    expanded_overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #121212 60%)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
    },
    expanded_header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px 4px', flexShrink: 0,
    },
    expanded_header_label: {
        fontSize: 12, fontWeight: 700, color: '#aaa',
        textTransform: 'uppercase', letterSpacing: 1.5,
    },
    expanded_art_wrap: {
        display: 'flex', justifyContent: 'center',
        padding: '12px 32px 16px', flexShrink: 0,
    },
    expanded_art: {
        width: 260, height: 260, borderRadius: 16, objectFit: 'cover',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
    },
    expanded_art_placeholder: {
        width: 260, height: 260, borderRadius: 16,
        background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
    },
    expanded_song_section: {
        textAlign: 'center', padding: '0 32px 10px', flexShrink: 0,
    },
    expanded_song_title: {
        fontSize: 20, fontWeight: 'bold', color: '#fff', margin: '0 0 6px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    expanded_song_artist: { fontSize: 14, color: '#aaa', margin: 0 },
    expanded_progress: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 24px 6px', flexShrink: 0,
    },
    expanded_time: { fontSize: 11, color: '#777', flexShrink: 0, minWidth: 36 },
    expanded_controls: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '4px 24px 8px', flexShrink: 0,
    },
    expanded_play_btn: {
        background: '#1DB954', color: '#fff', padding: 14,
        '&:hover': { background: '#17a349' },
    },
    expanded_icon_btn: { color: '#aaa', '&:hover': { color: '#fff' } },
    expanded_icon_active: { color: '#1DB954 !important' },
    expanded_vol_row: {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 28px 10px', flexShrink: 0,
    },
    expanded_dl_btn: { color: '#aaa', '&:hover': { color: '#1DB954' } },
    expanded_queue: {
        flex: 1, overflowY: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: 2 },
    },
    expanded_queue_header: {
        fontSize: 11, fontWeight: 700, color: '#aaa',
        padding: '10px 24px 6px', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0,
    },
    expanded_queue_row: {
        display: 'flex', alignItems: 'center', padding: '8px 24px', cursor: 'pointer',
        '&:hover': { background: 'rgba(255,255,255,0.05)' },
    },
    expanded_queue_active: { background: 'rgba(29,185,84,0.12) !important' },
    expanded_queue_thumb: {
        width: 40, height: 40, borderRadius: 4, objectFit: 'cover', flexShrink: 0, marginRight: 12,
    },
    expanded_queue_thumb_ph: {
        width: 40, height: 40, borderRadius: 4, flexShrink: 0, marginRight: 12,
        background: 'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    expanded_queue_info: { flex: 1, minWidth: 0 },
    expanded_queue_title: {
        fontSize: 13, fontWeight: 600, color: '#ddd',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
    },
    expanded_queue_title_active: { color: '#1DB954 !important' },
    expanded_queue_artist: { fontSize: 11, color: '#666', margin: '2px 0 0' },
    expanded_queue_dur: { fontSize: 11, color: '#555', flexShrink: 0, paddingLeft: 8 },
    mini_bar_clickable: {
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', flexShrink: 0, minWidth: 0,
        '&:hover $player_title': { color: '#1DB954' },
    },
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

    // ----- Tab -----
    const [activeTab, setActiveTab] = useState('songs')

    // ----- Songs tab -----
    const [songs, setSongs]                           = useState([])
    const [loadingCat, setLoadingCat]                 = useState(false)
    const [loadingMore, setLoadingMore]               = useState(false)
    const [currentCategory, setCurrentCategory]       = useState(CATEGORIES[0])
    const [queryIndex, setQueryIndex]                 = useState(0)
    const [localSearch, setLocalSearch]               = useState('')
    const [localSearchResults, setLocalSearchResults] = useState(null)
    const [localSearchLoading, setLocalSearchLoading] = useState(false)

    // ----- Albums tab -----
    const [albumCategory, setAlbumCategory]         = useState(ALBUM_CATEGORIES[0])
    const [albums, setAlbums]                       = useState([])
    const [loadingAlbums, setLoadingAlbums]         = useState(false)
    const [loadingMoreAlbums, setLoadingMoreAlbums] = useState(false)
    const [albumQueryIndex, setAlbumQueryIndex]     = useState(0)
    const [albumPage, setAlbumPage]                 = useState(1)
    const [albumsExhausted, setAlbumsExhausted]     = useState(false)
    const [selectedAlbum, setSelectedAlbum]         = useState(null)
    const [albumSongs, setAlbumSongs]               = useState([])
    const [loadingAlbumSongs, setLoadingAlbumSongs] = useState(false)
    const [continuousPlay, setContinuousPlay]       = useState(false)
    const [autoLoadingAlbum, setAutoLoadingAlbum]   = useState(false)
    const [albumSearch, setAlbumSearch]             = useState('')
    const [albumSearchResults, setAlbumSearchResults] = useState(null)
    const [albumSearchLoading, setAlbumSearchLoading] = useState(false)

    // ----- Player -----
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
    const [playerExpanded, setPlayerExpanded] = useState(false)

    const openExpanded = () => {
        setPlayerExpanded(true)
        setTimeout(() => {
            if (expandedOverlayRef.current) {
                expandedOverlayRef.current.style.transform = ''
                expandedOverlayRef.current.style.transition = ''
            }
        }, 0)
    }

    const audioRef            = useRef(null)
    const searchTimerRef      = useRef(null)
    const albumSearchTimerRef = useRef(null)
    const loaderRef           = useRef(null)
    const expandedOverlayRef  = useRef(null)
    const swipeTouchStartY    = useRef(0)
    const mediaActionRef      = useRef({})

    // Songs shown in the Songs tab grid
    const displaySongs = musicSearchFlag
        ? musicSearchData
        : localSearchResults !== null
            ? localSearchResults
            : songs

    // Queue the player's skip next/prev navigates through
    const playQueue = (activeTab === 'albums' && selectedAlbum)
        ? albumSongs
        : displaySongs

    const activeSectionLabel = musicSearchFlag
        ? `Results for "${searchValue}"`
        : localSearchResults !== null
            ? `Results for "${localSearch}"`
            : currentCategory.label

    const hasMoreQueries = queryIndex + 1 < currentCategory.queries.length

    const displayAlbums = albumSearchResults !== null ? albumSearchResults : albums

    // ---- Songs tab fetching ----
    const fetchQuery = useCallback((query, append = false) => {
        return axios.get(`${SAAVN_BASE}/search/songs`, { params: { query, limit: 50 } })
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

    // ---- Media Session API (background audio + lock screen controls) ----

    // Keep latest action functions in a ref so handlers registered once always call fresh logic
    useEffect(() => {
        mediaActionRef.current.skipNext = skipNext
        mediaActionRef.current.skipPrev = skipPrev
    })

    // Register play/pause/seek handlers once on mount — these don't depend on song state
    useEffect(() => {
        if (!('mediaSession' in navigator)) return
        navigator.mediaSession.setActionHandler('play', () => {
            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {})
        })
        navigator.mediaSession.setActionHandler('pause', () => {
            audioRef.current?.pause(); setIsPlaying(false)
        })
        navigator.mediaSession.setActionHandler('seekforward', (d) => {
            if (audioRef.current)
                audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + (d.seekOffset || 10))
        })
        navigator.mediaSession.setActionHandler('seekbackward', (d) => {
            if (audioRef.current)
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - (d.seekOffset || 10))
        })
        return () => {
            ['play', 'pause', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward'].forEach(action => {
                try { navigator.mediaSession.setActionHandler(action, null) } catch (_) {}
            })
        }
    // eslint-disable-next-line
    }, [])

    // Update metadata + re-register nexttrack/previoustrack on every song change.
    // iOS drops background handlers; refreshing them per song is required for the
    // next/previous buttons to appear reliably on the lock screen.
    useEffect(() => {
        if (!('mediaSession' in navigator) || !currentSong) return
        navigator.mediaSession.metadata = new window.MediaMetadata({
            title: currentSong.title || '',
            artist: currentSong.artist || '',
            artwork: currentSong.cover
                ? [{ src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' }]
                : [],
        })
        navigator.mediaSession.setActionHandler('nexttrack', () => mediaActionRef.current.skipNext?.())
        navigator.mediaSession.setActionHandler('previoustrack', () => mediaActionRef.current.skipPrev?.())
    }, [currentSong])

    // Keep the lock screen play/pause indicator in sync
    useEffect(() => {
        if (!('mediaSession' in navigator)) return
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
    }, [isPlaying])

    // ---- Albums tab fetching ----
    const dedupAlbums = (arr) => {
        const seen = new Set()
        return arr.filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true })
    }

    const sortByYear = (arr) => [...arr].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))

    const fetchAlbumsPage = useCallback((query, page) =>
        axios.get(`${SAAVN_BASE}/search/albums`, { params: { query, limit: 40, page } })
            .then(res => (res.data?.data?.results || []).map(mapAlbum))
    , [])

    // Reset and load page 1 whenever tab becomes active or category changes
    useEffect(() => {
        if (activeTab !== 'albums') return
        setAlbums([])
        setAlbumQueryIndex(0)
        setAlbumPage(1)
        setAlbumsExhausted(false)
        setSelectedAlbum(null)
        setAlbumSongs([])
        setLoadingAlbums(true)
        fetchAlbumsPage(albumCategory.queries[0], 1)
            .then(data => setAlbums(sortByYear(dedupAlbums(data))))
            .catch(e => console.log(e))
            .finally(() => setLoadingAlbums(false))
        // eslint-disable-next-line
    }, [activeTab, albumCategory])

    const handleAlbumLoadMore = async () => {
        if (loadingMoreAlbums || albumsExhausted) return
        setLoadingMoreAlbums(true)
        try {
            const nextPage = albumPage + 1
            let data = await fetchAlbumsPage(albumCategory.queries[albumQueryIndex], nextPage)
            if (data.length > 0) {
                setAlbums(prev => sortByYear(dedupAlbums([...prev, ...data])))
                setAlbumPage(nextPage)
            } else {
                // current query exhausted — try next query
                const nextQIdx = albumQueryIndex + 1
                if (nextQIdx < albumCategory.queries.length) {
                    data = await fetchAlbumsPage(albumCategory.queries[nextQIdx], 1)
                    setAlbums(prev => sortByYear(dedupAlbums([...prev, ...data])))
                    setAlbumQueryIndex(nextQIdx)
                    setAlbumPage(1)
                    if (data.length === 0) setAlbumsExhausted(true)
                } else {
                    setAlbumsExhausted(true)
                }
            }
        } catch (e) { console.log(e) }
        finally { setLoadingMoreAlbums(false) }
    }

    // ---- Handlers ----
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
            axios.get(`${SAAVN_BASE}/search/songs`, { params: { query: value, limit: 50 } })
                .then((res) => {
                    const data = (res.data?.data?.results || []).map(mapTrack)
                    setLocalSearchResults(data)
                })
                .catch(e => console.log(e))
                .finally(() => setLocalSearchLoading(false))
        }, 500)
    }

    const handleAlbumCategoryClick = (cat) => {
        setAlbumCategory(cat)
        setAlbumSearch('')
        setAlbumSearchResults(null)
    }

    const handleAlbumSearch = (e) => {
        const value = e.target.value
        setAlbumSearch(value)
        if (albumSearchTimerRef.current) clearTimeout(albumSearchTimerRef.current)
        if (!value.trim()) { setAlbumSearchResults(null); return }
        setAlbumSearchLoading(true)
        albumSearchTimerRef.current = setTimeout(() => {
            axios.get(`${SAAVN_BASE}/search/albums`, { params: { query: value, limit: 40 } })
                .then((res) => {
                    const data = (res.data?.data?.results || []).map(mapAlbum)
                    setAlbumSearchResults(sortByYear(data))
                })
                .catch(e => console.log(e))
                .finally(() => setAlbumSearchLoading(false))
        }, 500)
    }

    const handleAlbumClick = async (album) => {
        setSelectedAlbum(album)
        setLoadingAlbumSongs(true)
        setAlbumSongs([])
        try {
            const res = await axios.get(`${SAAVN_BASE}/albums`, { params: { id: album.id } })
            setAlbumSongs((res.data?.data?.songs || []).map(mapTrack))
        } catch (e) { console.log(e) }
        finally { setLoadingAlbumSongs(false) }
    }

    const handleBackFromAlbum = () => {
        setSelectedAlbum(null)
        setAlbumSongs([])
    }

    const handlePrevAlbum = () => {
        if (!selectedAlbum || albums.length < 2) return
        const idx = albums.findIndex(a => a.id === selectedAlbum.id)
        const prevIdx = (idx - 1 + albums.length) % albums.length
        loadAndPlayAlbum(albums[prevIdx])
    }

    const handleNextAlbum = () => {
        if (!selectedAlbum || albums.length < 2) return
        const idx = albums.findIndex(a => a.id === selectedAlbum.id)
        const nextIdx = (idx + 1) % albums.length
        loadAndPlayAlbum(albums[nextIdx])
    }

    // Auto-advances to the next album in the list and plays its first song
    const loadAndPlayAlbum = async (album) => {
        setAutoLoadingAlbum(true)
        setSelectedAlbum(album)
        setAlbumSongs([])
        try {
            const res = await axios.get(`${SAAVN_BASE}/albums`, { params: { id: album.id } })
            const songs = (res.data?.data?.songs || []).map(mapTrack)
            setAlbumSongs(songs)
            if (songs.length > 0) {
                setCurrentSong(songs[0])
                setCurrentIndex(0)
                setStreamUrl(songs[0].previewUrl || '')
            }
        } catch (e) { console.log(e) }
        finally { setAutoLoadingAlbum(false) }
    }

    // ---- Player ----
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
            do { idx = Math.floor(Math.random() * playQueue.length) } while (idx === currentIndex && playQueue.length > 1)
            return idx
        }
        return (currentIndex + 1) % playQueue.length
    }

    const skipNext = () => {
        if (!playQueue.length) return
        const next = getNextIndex()
        playSong(playQueue[next], next)
    }

    const cycleRepeat = () => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')

    const skipPrev = () => {
        if (!playQueue.length) return
        if (audioRef.current && audioRef.current.currentTime > 3) { audioRef.current.currentTime = 0; return }
        const prev = (currentIndex - 1 + playQueue.length) % playQueue.length
        playSong(playQueue[prev], prev)
    }

    const handleEnded = () => {
        if (repeat === 'one') { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}) }
        else if (repeat === 'all' || currentIndex < playQueue.length - 1) skipNext()
        else if (continuousPlay && activeTab === 'albums' && selectedAlbum && albums.length > 1) {
            const currentAlbumIdx = albums.findIndex(a => a.id === selectedAlbum.id)
            const nextAlbumIdx = (currentAlbumIdx + 1) % albums.length
            loadAndPlayAlbum(albums[nextAlbumIdx])
        }
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

    const handleSwipeStart = (e) => {
        swipeTouchStartY.current = e.touches[0].clientY
        if (expandedOverlayRef.current) expandedOverlayRef.current.style.transition = 'none'
    }

    const handleSwipeMove = (e) => {
        const delta = e.touches[0].clientY - swipeTouchStartY.current
        if (delta > 0 && expandedOverlayRef.current) {
            expandedOverlayRef.current.style.transform = `translateY(${delta}px)`
        }
    }

    const handleSwipeEnd = (e) => {
        const delta = e.changedTouches[0].clientY - swipeTouchStartY.current
        if (!expandedOverlayRef.current) return
        if (delta > 80) {
            expandedOverlayRef.current.style.transition = 'transform 0.25s ease'
            expandedOverlayRef.current.style.transform = 'translateY(100%)'
            setTimeout(() => setPlayerExpanded(false), 250)
        } else {
            expandedOverlayRef.current.style.transition = 'transform 0.25s ease'
            expandedOverlayRef.current.style.transform = 'translateY(0)'
        }
    }

    return (
        <div className={classes.page}>
            <Header />

            <div className={classes.top_bar}>
                <h1 className={classes.page_title}>Music</h1>
            </div>

            {/* Tab Bar */}
            <div className={classes.tab_bar}>
                <button
                    className={`${classes.tab_btn} ${activeTab === 'songs' ? classes.tab_btn_active : ''}`}
                    onClick={() => setActiveTab('songs')}
                >
                    <MusicNoteIcon style={{ fontSize: 16 }} /> Songs
                </button>
                <button
                    className={`${classes.tab_btn} ${activeTab === 'albums' ? classes.tab_btn_active : ''}`}
                    onClick={() => setActiveTab('albums')}
                >
                    <LibraryMusicIcon style={{ fontSize: 16 }} /> Albums
                </button>
            </div>

            {/* ===== SONGS TAB ===== */}
            {activeTab === 'songs' && (
                <>
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
                                            <Tooltip title={song.title || ''} placement="top">
                                                <Card
                                                    className={`${classes.card} ${currentSong === song ? classes.card_active : ''}`}
                                                    onClick={() => playSong(song, i)}
                                                >
                                                    <CardActionArea>
                                                        <div style={{ position: 'relative' }}>
                                                            {song.cover ? (
                                                                <CardMedia
                                                                    component="img"
                                                                    image={song.cover}
                                                                    alt={song.title}
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
                                                            <p className={classes.song_title}>{song.title}</p>
                                                            <Typography className={classes.song_artist}>{song.artist}</Typography>
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
                                            ? <Button className={classes.load_more_btn} onClick={handleLoadMore}>Load More</Button>
                                            : songs.length > 0 && (
                                                <span style={{ color: '#555', fontSize: 13 }}>You've seen all songs in this category</span>
                                            )
                                    }
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* ===== ALBUMS TAB ===== */}
            {activeTab === 'albums' && (
                <>
                    {/* Album search bar */}
                    {!selectedAlbum && (
                        <div className={classes.search_bar}>
                            <SearchIcon className={classes.search_icon_color} />
                            <InputBase
                                className={classes.search_input}
                                placeholder="Search albums…"
                                value={albumSearch}
                                onChange={handleAlbumSearch}
                                inputProps={{ 'aria-label': 'search albums' }}
                            />
                            {albumSearchLoading && <CircularProgress size={16} style={{ color: '#1DB954' }} />}
                        </div>
                    )}

                    {/* Album category chips + loop toggle */}
                    {!selectedAlbum && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 0' }}>
                            <div className={classes.categories_row} style={{ padding: 0, flex: 1 }}>
                                {ALBUM_CATEGORIES.map((cat) => (
                                    <Chip
                                        key={cat.label}
                                        label={cat.label}
                                        className={`${classes.chip} ${albumCategory.label === cat.label ? classes.chip_active : ''}`}
                                        onClick={() => handleAlbumCategoryClick(cat)}
                                        clickable
                                    />
                                ))}
                            </div>
                            <Tooltip title={continuousPlay ? 'Continuous album loop: On' : 'Continuous album loop: Off'}>
                                <button
                                    className={`${classes.loop_btn} ${continuousPlay ? classes.loop_btn_active : ''}`}
                                    onClick={() => setContinuousPlay(c => !c)}
                                    style={{ marginLeft: 12, flexShrink: 0 }}
                                >
                                    <AllInclusiveIcon style={{ fontSize: 16 }} />
                                    Loop
                                </button>
                            </Tooltip>
                        </div>
                    )}

                    {selectedAlbum ? (
                        /* ---- Album songs view ---- */
                        <>
                            <div className={classes.album_back_bar}>
                                <IconButton size="small" onClick={handleBackFromAlbum} style={{ color: '#555' }}>
                                    <ArrowBackIcon />
                                </IconButton>
                                {selectedAlbum.cover ? (
                                    <img src={selectedAlbum.cover} alt={selectedAlbum.name} className={classes.album_detail_cover} />
                                ) : (
                                    <div className={classes.album_detail_cover_placeholder}>
                                        <LibraryMusicIcon style={{ color: 'rgba(255,255,255,0.5)', fontSize: 28 }} />
                                    </div>
                                )}
                                <div className={classes.album_detail_info}>
                                    <p className={classes.album_detail_name}>{selectedAlbum.name}</p>
                                    <p className={classes.album_detail_sub}>
                                        {selectedAlbum.artist}{selectedAlbum.year ? ` · ${selectedAlbum.year}` : ''}
                                        {albumSongs.length > 0 ? ` · ${albumSongs.length} songs` : ''}
                                    </p>
                                </div>
                                {albumSongs.length > 0 && (
                                    <Tooltip title="Play all">
                                        <IconButton
                                            style={{ background: '#1DB954', color: '#fff', padding: 8 }}
                                            onClick={() => playSong(albumSongs[0], 0)}
                                        >
                                            <PlayArrowIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>

                            {loadingAlbumSongs || autoLoadingAlbum ? (
                                <div className={classes.loading_center}>
                                    <CircularProgress style={{ color: '#1DB954' }} />
                                </div>
                            ) : albumSongs.length === 0 ? (
                                <div className={classes.no_data}>
                                    <MusicNoteIcon style={{ fontSize: 48, marginBottom: 12 }} />
                                    <span>No songs found in this album</span>
                                </div>
                            ) : (
                                <div className={classes.track_list}>
                                    {albumSongs.map((song, i) => (
                                        <div
                                            key={`${song.id}-${i}`}
                                            className={`${classes.track_row} ${currentSong === song ? classes.track_row_active : ''}`}
                                            onClick={() => playSong(song, i)}
                                        >
                                            <span className={classes.track_num}>
                                                {currentSong === song && isPlaying
                                                    ? <PauseIcon style={{ fontSize: 16, color: '#1DB954' }} />
                                                    : currentSong === song
                                                        ? <PlayArrowIcon style={{ fontSize: 16, color: '#1DB954' }} />
                                                        : i + 1
                                                }
                                            </span>
                                            {song.cover ? (
                                                <img src={song.cover} alt={song.title} className={classes.track_thumb}
                                                    onError={(e) => { e.target.style.display = 'none' }} />
                                            ) : (
                                                <div className={classes.track_thumb_placeholder}>
                                                    <MusicNoteIcon style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }} />
                                                </div>
                                            )}
                                            <div className={classes.track_info}>
                                                <p className={`${classes.track_title} ${currentSong === song ? classes.track_title_active : ''}`}>
                                                    {song.title}
                                                </p>
                                                <p className={classes.track_artist}>{song.artist}</p>
                                            </div>
                                            <span className={classes.track_duration}>{fmt(song.duration)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        /* ---- Albums grid ---- */
                        <>
                            <div className={classes.section_header} style={{ paddingTop: 4 }}>
                                <span className={classes.section_title}>
                                    {albumSearchResults !== null
                                        ? `Results for "${albumSearch}"`
                                        : `${albumCategory.label} Movie Albums`}
                                </span>
                                <span className={classes.song_count}>{displayAlbums.length} albums</span>
                            </div>

                            {loadingAlbums ? (
                                <div className={classes.loading_center}>
                                    <CircularProgress style={{ color: '#1DB954' }} />
                                </div>
                            ) : displayAlbums.length === 0 ? (
                                <div className={classes.no_data}>
                                    <LibraryMusicIcon style={{ fontSize: 48, marginBottom: 12 }} />
                                    <span>{albumSearchResults !== null ? 'No albums found for your search' : 'No albums found'}</span>
                                </div>
                            ) : (
                                <>
                                    <Grid container justifyContent="center" className={classes.grid_wrapper}>
                                        {displayAlbums.map((album, i) => (
                                            <Grid item key={`${album.id}-${i}`}>
                                                <Tooltip title={album.name} placement="top">
                                                    <div className={classes.album_card} onClick={() => handleAlbumClick(album)}>
                                                        {album.cover ? (
                                                            <img src={album.cover} alt={album.name} className={classes.album_img}
                                                                onError={(e) => { e.target.style.display = 'none' }} />
                                                        ) : (
                                                            <div className={classes.album_img_placeholder}>
                                                                <LibraryMusicIcon style={{ color: 'rgba(255,255,255,0.4)', fontSize: 40 }} />
                                                            </div>
                                                        )}
                                                        <div className={classes.album_content}>
                                                            <p className={classes.album_name}>{album.name}</p>
                                                            <p className={classes.album_artist}>{album.artist}</p>
                                                            {album.year && <span className={classes.album_year}>{album.year}</span>}
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {albumSearchResults === null && (
                                        <div className={classes.load_more_row}>
                                            {loadingMoreAlbums
                                                ? <CircularProgress style={{ color: '#1DB954' }} />
                                                : !albumsExhausted
                                                    ? <Button className={classes.load_more_btn} onClick={handleAlbumLoadMore}>Load More</Button>
                                                    : albums.length > 0 && <span style={{ color: '#555', fontSize: 13 }}>All albums loaded</span>
                                            }
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            <audio
                ref={audioRef}
                onTimeUpdate={() => {
                    const a = audioRef.current
                    if (!a) return
                    setCurrentTime(a.currentTime)
                    if ('mediaSession' in navigator && a.duration && isFinite(a.duration)) {
                        try {
                            navigator.mediaSession.setPositionState({
                                duration: a.duration,
                                playbackRate: a.playbackRate || 1,
                                position: a.currentTime,
                            })
                        } catch (_) {}
                    }
                }}
                onDurationChange={() => {
                    const a = audioRef.current
                    if (!a) return
                    setDuration(a.duration || 0)
                    if ('mediaSession' in navigator && a.duration && isFinite(a.duration)) {
                        try {
                            navigator.mediaSession.setPositionState({
                                duration: a.duration,
                                playbackRate: a.playbackRate || 1,
                                position: a.currentTime,
                            })
                        } catch (_) {}
                    }
                }}
                onEnded={handleEnded}
            />

            {/* ===== EXPANDED PLAYER ===== */}
            {currentSong && playerExpanded && (
                <div
                    className={classes.expanded_overlay}
                    ref={expandedOverlayRef}
                    onTouchStart={handleSwipeStart}
                    onTouchMove={handleSwipeMove}
                    onTouchEnd={handleSwipeEnd}
                >
                    <div className={classes.expanded_header}>
                        <IconButton className={classes.expanded_icon_btn} onClick={() => setPlayerExpanded(false)}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        <span className={classes.expanded_header_label}>Now Playing</span>
                        <Tooltip title="Download">
                            <IconButton size="small" className={classes.expanded_dl_btn} onClick={handleDownload} disabled={downloading}>
                                {downloading ? <CircularProgress size={18} style={{ color: '#1DB954' }} /> : <GetAppIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </div>

                    <div className={classes.expanded_art_wrap}>
                        {currentSong.cover ? (
                            <img src={currentSong.cover} alt={currentSong.title} className={classes.expanded_art} />
                        ) : (
                            <div className={classes.expanded_art_placeholder}>
                                <MusicNoteIcon style={{ color: 'rgba(255,255,255,0.4)', fontSize: 72 }} />
                            </div>
                        )}
                    </div>

                    <div className={classes.expanded_song_section}>
                        <p className={classes.expanded_song_title}>{currentSong.title}</p>
                        <p className={classes.expanded_song_artist}>{currentSong.artist}</p>
                    </div>

                    <div className={classes.expanded_progress}>
                        <span className={classes.expanded_time}>{fmt(currentTime)}</span>
                        <Slider min={0} max={duration || 1} value={currentTime} onChange={handleSeek}
                            style={{ color: '#1DB954', flex: 1 }} />
                        <span className={classes.expanded_time}>{fmt(duration)}</span>
                    </div>

                    <div className={classes.expanded_controls}>
                        {activeTab === 'albums' && selectedAlbum && albums.length > 1 && (
                            <Tooltip title="Previous album">
                                <IconButton className={classes.expanded_icon_btn} onClick={handlePrevAlbum}>
                                    <FastRewindIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title={shuffle ? 'Shuffle On' : 'Shuffle Off'}>
                            <IconButton className={`${classes.expanded_icon_btn} ${shuffle ? classes.expanded_icon_active : ''}`} onClick={() => setShuffle(s => !s)}>
                                <ShuffleIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton className={classes.expanded_icon_btn} onClick={skipPrev}>
                            <SkipPreviousIcon style={{ fontSize: 36 }} />
                        </IconButton>
                        <IconButton className={classes.expanded_play_btn} onClick={togglePlay}>
                            {isPlaying ? <PauseIcon style={{ fontSize: 32 }} /> : <PlayArrowIcon style={{ fontSize: 32 }} />}
                        </IconButton>
                        <IconButton className={classes.expanded_icon_btn} onClick={skipNext}>
                            <SkipNextIcon style={{ fontSize: 36 }} />
                        </IconButton>
                        <Tooltip title={repeat === 'none' ? 'Repeat Off' : repeat === 'all' ? 'Repeat All' : 'Repeat One'}>
                            <IconButton className={`${classes.expanded_icon_btn} ${repeat !== 'none' ? classes.expanded_icon_active : ''}`} onClick={cycleRepeat}>
                                {repeat === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                            </IconButton>
                        </Tooltip>
                        {activeTab === 'albums' && selectedAlbum && albums.length > 1 && (
                            <Tooltip title="Next album">
                                <IconButton className={classes.expanded_icon_btn} onClick={handleNextAlbum}>
                                    <FastForwardIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>

                    <div className={classes.expanded_vol_row}>
                        <IconButton size="small" className={classes.expanded_icon_btn} onClick={() => setMuted(m => !m)}>
                            {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                        </IconButton>
                        <Slider min={0} max={1} step={0.01} value={muted ? 0 : volume}
                            onChange={(_, v) => { setVolume(v); setMuted(false) }}
                            style={{ color: '#1DB954', flex: 1 }} />
                    </div>

                    {playQueue.length > 0 && (
                        <div className={classes.expanded_queue}>
                            <p className={classes.expanded_queue_header}>Up Next</p>
                            {playQueue.map((song, i) => (
                                <div
                                    key={`${song.id}-${i}`}
                                    className={`${classes.expanded_queue_row} ${currentSong === song ? classes.expanded_queue_active : ''}`}
                                    onClick={() => playSong(song, i)}
                                >
                                    {song.cover ? (
                                        <img src={song.cover} alt={song.title} className={classes.expanded_queue_thumb}
                                            onError={(e) => { e.target.style.display = 'none' }} />
                                    ) : (
                                        <div className={classes.expanded_queue_thumb_ph}>
                                            <MusicNoteIcon style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }} />
                                        </div>
                                    )}
                                    <div className={classes.expanded_queue_info}>
                                        <p className={`${classes.expanded_queue_title} ${currentSong === song ? classes.expanded_queue_title_active : ''}`}>
                                            {song.title}
                                        </p>
                                        <p className={classes.expanded_queue_artist}>{song.artist}</p>
                                    </div>
                                    <span className={classes.expanded_queue_dur}>{fmt(song.duration)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {currentSong && (
                <div className={classes.player_bar}>
                    <div className={classes.mini_bar_clickable} onClick={openExpanded}>
                        {currentSong.cover ? (
                            <img src={currentSong.cover} alt="" className={classes.player_art} />
                        ) : (
                            <div className={classes.player_art_placeholder}>
                                <MusicNoteIcon style={{ color: 'rgba(255,255,255,0.5)' }} />
                            </div>
                        )}
                        <div className={classes.player_info}>
                            <p className={classes.player_title}>{currentSong.title}</p>
                            <p className={classes.player_artist}>{currentSong.artist}</p>
                        </div>
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

                    <Tooltip title="Download">
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
