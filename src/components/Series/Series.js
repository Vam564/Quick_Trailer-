import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
    Grid, Card, CardActionArea, CardMedia, CardContent,
    Typography, Dialog, AppBar, Toolbar, IconButton,
    FormControl, InputLabel, Select, MenuItem, Fab
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
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

const useStyles = makeStyles((theme) => ({
    page: {
        minHeight: '100vh',
        background: '#f5f5f5',
    },
    top_bar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: '0 16px',
    },
    page_title: {
        paddingLeft: 14,
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
        margin: 0,
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 150,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        gap: 8,
    },
    grid_wrapper: {
        padding: '0 20px 30px',
    },
    card: {
        maxWidth: 200,
        width: '100%',
        borderRadius: 5,
        margin: 15,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        },
    },
    card_img: {
        minHeight: 300,
    },
    card_content: {
        width: 204,
        height: 60,
        padding: '10px !important',
    },
    series_title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9b9b9b',
        margin: '0 0 5px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    rating: {
        fontSize: 12,
        color: '#d2c9c9',
        float: 'right',
    },
    overview: {
        fontSize: 11,
        color: '#aaaaaa',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    // --- Player dialog ---
    appbar: {
        background: '#111111',
        boxShadow: 'none',
        position: 'relative',
    },
    dialog_title: {
        flex: 1,
        color: '#ffffff',
        fontWeight: 'bold',
        paddingLeft: 8,
    },
    close_btn: { color: '#ffffff' },
    player_wrapper: {
        position: 'relative',
        paddingTop: '56.25%',
        background: '#000',
    },
    player_iframe: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
    },
    // --- Detail overlay ---
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
    hero_content: {
        position: 'relative',
        zIndex: 1,
        padding: '30px 30px 30px',
        color: '#fff',
        width: '100%',
    },
    hero_title: {
        fontSize: 28,
        fontWeight: 'bold',
        margin: '0 0 8px',
    },
    hero_meta: {
        fontSize: 13,
        color: '#bbbbbb',
        marginBottom: 10,
    },
    hero_overview: {
        fontSize: 14,
        color: '#dddddd',
        maxWidth: 680,
        lineHeight: 1.6,
        margin: '0 0 16px',
    },
    play_btn: {
        background: '#e50914',
        color: '#fff',
        marginRight: 10,
        '&:hover': { background: '#b0070f' },
    },
    season_label: {
        fontSize: 12,
        color: '#bbbbbb',
        marginTop: 6,
    },
    no_data: {
        display: 'flex',
        justifyContent: 'center',
        padding: 40,
    },
}))

const Series = () => {
    const classes = useStyles()
    const { seriesSearchData, seriesSearchFlag, searchValue } = useSelector(s => s.ListPageReducer)
    const [seriesList, setSeriesList] = useState([])
    const [filter, setFilter] = useState('popular')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selected, setSelected] = useState(null)
    const [season, setSeason] = useState(1)
    const [episode, setEpisode] = useState(1)
    const [playerOpen, setPlayerOpen] = useState(false)
    const [serverIndex, setServerIndex] = useState(0)

    useEffect(() => {
        if (seriesSearchFlag) return
        setSelected(null)
        axios.get(`https://api.themoviedb.org/3/tv/${filter}?api_key=${API_KEY}&page=${currentPage}`)
            .then((res) => {
                setSeriesList(res.data.results || [])
                setTotalPages(res.data.total_pages || 1)
            })
            .catch((err) => console.log(err))
    }, [filter, currentPage, seriesSearchFlag])

    const displayList = seriesSearchFlag ? seriesSearchData : seriesList

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
        setCurrentPage(1)
    }

    const handleCardClick = (show) => {
        setSelected(show)
        setSeason(1)
        setEpisode(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const streamUrl = selected
        ? SERIES_SERVERS[serverIndex].url(selected.id, season, episode)
        : ''

    return (
        <div className={classes.page}>
            <Header />

            {/* Detail hero when a series is selected */}
            {selected && (
                <div
                    className={classes.hero}
                    style={{
                        backgroundImage: selected.backdrop_path
                            ? `url(https://image.tmdb.org/t/p/w1280${selected.backdrop_path})`
                            : 'none',
                        background: selected.backdrop_path ? undefined : '#1a1a1a',
                    }}
                >
                    <div className={classes.hero_overlay} />
                    <div className={classes.hero_content}>
                        <Typography className={classes.hero_title}>
                            {selected.name || selected.original_name}
                        </Typography>
                        <Typography className={classes.hero_meta}>
                            {selected.first_air_date?.split('-')[0]}
                            {selected.vote_average ? ` · ★ ${selected.vote_average}` : ''}
                            {selected.original_language ? ` · ${selected.original_language.toUpperCase()}` : ''}
                        </Typography>
                        <Typography className={classes.hero_overview}>
                            {selected.overview}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <FormControl size="small" style={{ minWidth: 90 }}>
                                <InputLabel style={{ color: '#ccc' }}>Season</InputLabel>
                                <Select
                                    value={season}
                                    onChange={(e) => setSeason(e.target.value)}
                                    style={{ color: '#fff', borderBottom: '1px solid #ccc' }}
                                >
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
                                        <MenuItem key={s} value={s}>Season {s}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" style={{ minWidth: 100 }}>
                                <InputLabel style={{ color: '#ccc' }}>Episode</InputLabel>
                                <Select
                                    value={episode}
                                    onChange={(e) => setEpisode(e.target.value)}
                                    style={{ color: '#fff', borderBottom: '1px solid #ccc' }}
                                >
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

            {/* Filter + title bar */}
            <div className={classes.top_bar}>
                <h1 className={`${classes.page_title} list_page_title`}>
                    {seriesSearchFlag ? `Results for "${searchValue}"` : selected ? 'All Series' : `${FILTERS.find(f => f.value === filter)?.label} Series`}
                </h1>
                {!seriesSearchFlag && (
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink>Show</InputLabel>
                        <Select value={filter} onChange={handleFilterChange} displayEmpty>
                            {FILTERS.map((f) => (
                                <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </div>

            {/* Pagination top */}
            <div className={classes.pagination}>
                <Fab size="medium" color="secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeftIcon />
                </Fab>
                <Fab size="medium" color="secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRightIcon />
                </Fab>
            </div>

            {/* Grid */}
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
                                        image={show.poster_path
                                            ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                                            : default_img}
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

            {/* Pagination bottom */}
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
                                <button
                                    key={s.label}
                                    onClick={() => setServerIndex(i)}
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: 14,
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        background: i === serverIndex ? '#e50914' : '#444',
                                        color: '#fff',
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </Toolbar>
                </AppBar>
                <div className={classes.player_wrapper}>
                    {playerOpen && (
                        <iframe
                            key={serverIndex}
                            src={streamUrl}
                            className={classes.player_iframe}
                            allowFullScreen
                            allow="autoplay; fullscreen"
                            title={selected?.name}
                        />
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default Series
