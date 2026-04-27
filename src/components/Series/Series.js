import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
    Grid, Card, CardActionArea, CardMedia, CardContent,
    Typography, Dialog, AppBar, Toolbar, IconButton,
    FormControl, InputLabel, Select, MenuItem, Fab,
    Drawer, Divider, Slider, Button, Badge, Chip
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import FilterListIcon from '@material-ui/icons/FilterList'
import axios from 'axios'
import Header from '../Header/Header'
import default_img from '../../assets/default_img.png'

const API_KEY = '88428b2a9e9d271ea540df7c3fa4dac3'

const SERIES_SERVERS = [
    { label: 'Server 1', url: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
    { label: 'Server 2', url: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}` },
]

const FILTERS = [
    { label: 'Popular',      value: 'popular' },
    { label: 'Top Rated',    value: 'top_rated' },
    { label: 'Airing Today', value: 'airing_today' },
    { label: 'On The Air',   value: 'on_the_air' },
]

const TV_GENRES = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16,    name: 'Animation' },
    { id: 35,    name: 'Comedy' },
    { id: 80,    name: 'Crime' },
    { id: 99,    name: 'Documentary' },
    { id: 18,    name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648,  name: 'Mystery' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10768, name: 'War & Politics' },
    { id: 37,    name: 'Western' },
]

const SORT_OPTIONS = [
    { value: 'popularity.desc',       label: 'Most Popular' },
    { value: 'vote_average.desc',     label: 'Highest Rated' },
    { value: 'first_air_date.desc',   label: 'Newest First' },
    { value: 'first_air_date.asc',    label: 'Oldest First' },
    { value: 'name.asc',              label: 'Title A-Z' },
]

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'te', label: 'Telugu' },
    { value: 'ta', label: 'Tamil' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ko', label: 'Korean' },
    { value: 'ja', label: 'Japanese' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - i)

const useStyles = makeStyles(() => ({
    page: { minHeight: '100vh', background: '#f5f5f5' },
    top_bar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: '0 16px 0 30px',
    },
    page_title: {
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
        margin: 0,
    },
    chips_row: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        padding: '8px 0',
    },
    chip: {
        borderRadius: 20,
        fontWeight: 600,
        fontSize: 13,
        border: '1px solid #ddd',
    },
    chip_active: {
        background: '#e50914 !important',
        color: '#fff !important',
        border: '1px solid #e50914 !important',
    },
    filter_icon_btn: { color: '#e50914' },
    pagination: { display: 'flex', justifyContent: 'center', padding: '10px 0', gap: 8 },
    grid_wrapper: { padding: '0 20px 30px' },
    card: {
        maxWidth: 200,
        width: '100%',
        borderRadius: 5,
        margin: 15,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' },
    },
    card_img: { minHeight: 300 },
    card_content: { width: 204, height: 60, padding: '10px !important' },
    series_title: {
        fontSize: 12, fontWeight: 'bold', color: '#9b9b9b',
        margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
    rating: { fontSize: 12, color: '#d2c9c9', float: 'right' },
    overview: { fontSize: 11, color: '#aaaaaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    appbar: { background: '#111111', boxShadow: 'none', position: 'relative' },
    dialog_title: { flex: 1, color: '#ffffff', fontWeight: 'bold', paddingLeft: 8 },
    close_btn: { color: '#ffffff' },
    player_wrapper: { position: 'relative', paddingTop: '56.25%', background: '#000' },
    player_iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
    hero: {
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: 360,
        display: 'flex',
        alignItems: 'flex-end',
    },
    hero_overlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%)',
    },
    hero_content: { position: 'relative', zIndex: 1, padding: '30px', color: '#fff', width: '100%' },
    hero_title: { fontSize: 28, fontWeight: 'bold', margin: '0 0 8px' },
    hero_meta: { fontSize: 13, color: '#bbbbbb', marginBottom: 10 },
    hero_overview: { fontSize: 14, color: '#dddddd', maxWidth: 680, lineHeight: 1.6, margin: '0 0 16px' },
    play_btn: { background: '#e50914', color: '#fff', marginRight: 10, '&:hover': { background: '#b0070f' } },
    no_data: { display: 'flex', justifyContent: 'center', padding: 40 },
    // Drawer
    drawer_paper: { width: 300 },
    drawer_header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#f5f5f5',
    },
    drawer_title: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    drawer_body: {
        padding: '16px', display: 'flex', flexDirection: 'column',
        gap: 20, overflowY: 'auto', flex: 1,
    },
    drawer_footer: {
        padding: '12px 16px', display: 'flex', gap: 10, borderTop: '1px solid #e0e0e0',
    },
    filter_label: { fontSize: 13, fontWeight: 'bold', color: '#555', marginBottom: 6, display: 'block' },
    apply_btn: {
        flex: 1, background: '#e50914', color: '#fff', textTransform: 'none', fontWeight: 'bold',
        '&:hover': { background: '#b0070f' },
    },
    clear_btn: {
        flex: 1, background: '#e0e0e0', color: '#444', textTransform: 'none', fontWeight: 'bold',
        '&:hover': { background: '#ccc' },
    },
    rating_row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
}))

const Series = () => {
    const classes = useStyles()
    const { seriesSearchData, seriesSearchFlag, searchValue } = useSelector(s => s.ListPageReducer)

    const [seriesList, setSeriesList]   = useState([])
    const [filter, setFilter]           = useState('popular')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages]   = useState(1)
    const [selected, setSelected]       = useState(null)
    const [season, setSeason]           = useState(1)
    const [episode, setEpisode]         = useState(1)
    const [playerOpen, setPlayerOpen]   = useState(false)
    const [serverIndex, setServerIndex] = useState(0)
    const [drawerOpen, setDrawerOpen]   = useState(false)

    // Pending filter state (inside drawer)
    const [genre, setGenre]         = useState('')
    const [sortBy, setSortBy]       = useState('popularity.desc')
    const [minRating, setMinRating] = useState(0)
    const [year, setYear]           = useState('')
    const [language, setLanguage]   = useState('')

    // Applied filters
    const [applied, setApplied] = useState(null)

    const activeFilterCount = applied
        ? [applied.genre, applied.minRating > 0, applied.year, applied.language].filter(Boolean).length
        : 0

    useEffect(() => {
        if (seriesSearchFlag) return
        setSelected(null)

        let url
        if (applied) {
            const params = new URLSearchParams({ api_key: API_KEY, page: currentPage, sort_by: applied.sortBy })
            if (applied.genre)          params.append('with_genres', applied.genre)
            if (applied.minRating > 0)  params.append('vote_average.gte', applied.minRating)
            if (applied.year)           params.append('first_air_date_year', applied.year)
            if (applied.language)       params.append('with_original_language', applied.language)
            url = `https://api.themoviedb.org/3/discover/tv?${params}`
        } else {
            url = `https://api.themoviedb.org/3/tv/${filter}?api_key=${API_KEY}&page=${currentPage}`
        }

        axios.get(url)
            .then((res) => {
                setSeriesList(res.data.results || [])
                setTotalPages(res.data.total_pages || 1)
            })
            .catch((err) => console.log(err))
    }, [filter, currentPage, seriesSearchFlag, applied])

    const displayList = seriesSearchFlag ? seriesSearchData : seriesList

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        setCurrentPage(1)
        setApplied(null)
    }

    const handleCardClick = (show) => {
        setSelected(show); setSeason(1); setEpisode(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleApplyFilters = () => {
        setApplied({ genre, sortBy, minRating, year, language })
        setCurrentPage(1)
        setDrawerOpen(false)
    }

    const handleClearFilters = () => {
        setGenre(''); setSortBy('popularity.desc'); setMinRating(0); setYear(''); setLanguage('')
        setApplied(null)
        setDrawerOpen(false)
    }

    const streamUrl = selected ? SERIES_SERVERS[serverIndex].url(selected.id, season, episode) : ''

    const pageTitle = seriesSearchFlag
        ? `Results for "${searchValue}"`
        : selected ? 'All Series'
        : applied ? 'Filtered Series'
        : `${FILTERS.find(f => f.value === filter)?.label} Series`

    return (
        <div className={classes.page}>
            <Header />

            {selected && (
                <div
                    className={classes.hero}
                    style={{
                        backgroundImage: selected.backdrop_path
                            ? `url(https://image.tmdb.org/t/p/w1280${selected.backdrop_path})` : 'none',
                        background: selected.backdrop_path ? undefined : '#1a1a1a',
                    }}
                >
                    <div className={classes.hero_overlay} />
                    <div className={classes.hero_content}>
                        <Typography className={classes.hero_title}>{selected.name || selected.original_name}</Typography>
                        <Typography className={classes.hero_meta}>
                            {selected.first_air_date?.split('-')[0]}
                            {selected.vote_average ? ` · ★ ${selected.vote_average}` : ''}
                            {selected.original_language ? ` · ${selected.original_language.toUpperCase()}` : ''}
                        </Typography>
                        <Typography className={classes.hero_overview}>{selected.overview}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <FormControl size="small" style={{ minWidth: 90 }}>
                                <InputLabel style={{ color: '#ccc' }}>Season</InputLabel>
                                <Select value={season} onChange={(e) => setSeason(e.target.value)} style={{ color: '#fff', borderBottom: '1px solid #ccc' }}>
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
                                        <MenuItem key={s} value={s}>Season {s}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" style={{ minWidth: 100 }}>
                                <InputLabel style={{ color: '#ccc' }}>Episode</InputLabel>
                                <Select value={episode} onChange={(e) => setEpisode(e.target.value)} style={{ color: '#fff', borderBottom: '1px solid #ccc' }}>
                                    {Array.from({ length: 30 }, (_, i) => i + 1).map((ep) => (
                                        <MenuItem key={ep} value={ep}>Episode {ep}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Fab variant="extended" size="small" className={classes.play_btn} onClick={() => setPlayerOpen(true)}>
                                <PlayArrowIcon />&nbsp;Watch S{season} E{episode}
                            </Fab>
                        </div>
                    </div>
                </div>
            )}

            <div className={classes.top_bar}>
                <h1 className={`${classes.page_title} list_page_title`}>{pageTitle}</h1>
                {!seriesSearchFlag && (
                    <div className={classes.chips_row}>
                        {FILTERS.map(f => (
                            <Chip
                                key={f.value}
                                label={f.label}
                                clickable
                                className={`${classes.chip} ${!applied && filter === f.value ? classes.chip_active : ''}`}
                                onClick={() => handleFilterChange({ target: { value: f.value } })}
                            />
                        ))}
                        <Badge badgeContent={activeFilterCount} color="error">
                            <IconButton className={classes.filter_icon_btn} onClick={() => setDrawerOpen(true)}>
                                <FilterListIcon />
                            </IconButton>
                        </Badge>
                    </div>
                )}
            </div>

            <div className={classes.pagination}>
                <Fab size="medium" color="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeftIcon />
                </Fab>
                <Fab size="medium" color="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRightIcon />
                </Fab>
            </div>

            <Grid container justifyContent="center" className={classes.grid_wrapper}>
                {displayList.length === 0 ? (
                    <div className={classes.no_data}><h2>No Data Found</h2></div>
                ) : (
                    displayList.map((show) => (
                        <Grid item key={show.id}>
                            <Card
                                className={classes.card}
                                onClick={() => handleCardClick(show)}
                                style={{ outline: selected?.id === show.id ? '2px solid #e50914' : 'none' }}
                            >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        image={show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : default_img}
                                        alt={show.name}
                                        className={classes.card_img}
                                    />
                                    <CardContent className={classes.card_content}>
                                        <Grid container>
                                            <Grid item xs={9}>
                                                <p className={classes.series_title}>{show.name || show.original_name}</p>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <span className={classes.rating}>({show.vote_average})</span>
                                            </Grid>
                                        </Grid>
                                        <Typography className={classes.overview}>{show.overview}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <div className={classes.pagination}>
                <Fab size="medium" color="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeftIcon />
                </Fab>
                <Fab size="medium" color="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRightIcon />
                </Fab>
            </div>

            {/* Fullscreen player dialog */}
            <Dialog fullScreen open={playerOpen} onClose={() => setPlayerOpen(false)}>
                <AppBar className={classes.appbar}>
                    <Toolbar variant="dense">
                        <IconButton className={classes.close_btn} onClick={() => setPlayerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                        <Typography className={classes.dialog_title}>
                            {selected?.name} — S{season} E{episode}
                        </Typography>
                        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
                            {SERIES_SERVERS.map((s, i) => (
                                <button key={s.label} onClick={() => setServerIndex(i)} style={{
                                    padding: '4px 12px', borderRadius: 14, border: 'none', cursor: 'pointer',
                                    fontSize: 12, fontWeight: 'bold',
                                    background: i === serverIndex ? '#e50914' : '#444', color: '#fff',
                                }}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </Toolbar>
                </AppBar>
                <div className={classes.player_wrapper}>
                    {playerOpen && (
                        <iframe key={serverIndex} src={streamUrl} className={classes.player_iframe}
                            allowFullScreen allow="autoplay; fullscreen" title={selected?.name} />
                    )}
                </div>
            </Dialog>

            {/* Filter Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} classes={{ paper: classes.drawer_paper }}>
                <div className={classes.drawer_header}>
                    <span className={classes.drawer_title}>Filter Series</span>
                    <IconButton size="small" onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
                </div>
                <Divider />
                <div className={classes.drawer_body}>
                    {/* Genre */}
                    <div>
                        <span className={classes.filter_label}>Genre</span>
                        <FormControl fullWidth size="small">
                            <Select value={genre} onChange={(e) => setGenre(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All Genres</em></MenuItem>
                                {TV_GENRES.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Sort By */}
                    <div>
                        <span className={classes.filter_label}>Sort By</span>
                        <FormControl fullWidth size="small">
                            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                {SORT_OPTIONS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Min Rating */}
                    <div>
                        <div className={classes.rating_row}>
                            <span className={classes.filter_label} style={{ marginBottom: 0 }}>Min Rating</span>
                            <Typography variant="body2" style={{ color: '#e50914', fontWeight: 'bold' }}>
                                {minRating > 0 ? `${minRating}+` : 'Any'}
                            </Typography>
                        </div>
                        <Slider value={minRating} onChange={(_, v) => setMinRating(v)}
                            min={0} max={9} step={1} marks style={{ color: '#e50914' }} />
                    </div>

                    {/* First Air Year */}
                    <div>
                        <span className={classes.filter_label}>First Air Year</span>
                        <FormControl fullWidth size="small">
                            <Select value={year} onChange={(e) => setYear(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>Any Year</em></MenuItem>
                                {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Language */}
                    <div>
                        <span className={classes.filter_label}>Language</span>
                        <FormControl fullWidth size="small">
                            <Select value={language} onChange={(e) => setLanguage(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>Any Language</em></MenuItem>
                                {LANGUAGES.map(l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className={classes.drawer_footer}>
                    <Button className={classes.clear_btn} onClick={handleClearFilters}>Clear All</Button>
                    <Button className={classes.apply_btn} onClick={handleApplyFilters}>Apply Filters</Button>
                </div>
            </Drawer>
        </div>
    )
}

export default Series
