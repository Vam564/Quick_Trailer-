import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    Fab, Grid, FormControl, MenuItem, Select,
    Drawer, IconButton, Divider, Slider, Typography, Button, Badge, Chip
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import { setApiData, setIncrementPage, setDecrementPage, setSearchData, setEmptyData } from '../../store/actions/ListPageActionTypes'
import List from './List'
import Header from '../Header/Header'
import '../../App.css'

const API_KEY = '88428b2a9e9d271ea540df7c3fa4dac3'

const MOVIE_GENRES = [
    { id: 28,    name: 'Action' },
    { id: 12,    name: 'Adventure' },
    { id: 16,    name: 'Animation' },
    { id: 35,    name: 'Comedy' },
    { id: 80,    name: 'Crime' },
    { id: 99,    name: 'Documentary' },
    { id: 18,    name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14,    name: 'Fantasy' },
    { id: 36,    name: 'History' },
    { id: 27,    name: 'Horror' },
    { id: 9648,  name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878,   name: 'Science Fiction' },
    { id: 53,    name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37,    name: 'Western' },
]

const SORT_OPTIONS = [
    { value: 'popularity.desc',     label: 'Most Popular' },
    { value: 'vote_average.desc',   label: 'Highest Rated' },
    { value: 'release_date.desc',   label: 'Newest First' },
    { value: 'release_date.asc',    label: 'Oldest First' },
    { value: 'revenue.desc',        label: 'Highest Revenue' },
    { value: 'original_title.asc',  label: 'Title A-Z' },
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
    root: { flexGrow: 1 },
    button_wrapper: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        margin: '10px 0',
    },
    btns: { margin: '0 5px' },
    top_bar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: '0 16px 0 30px',
    },
    page_title: {
        color: '#4d4d4d',
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
    filter_icon_btn: {
        color: '#e50914',
    },
    no_data: { display: 'flex', justifyContent: 'center' },
    // Drawer
    drawer_paper: { width: 300 },
    drawer_header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#f5f5f5',
    },
    drawer_title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    drawer_body: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
        flex: 1,
    },
    drawer_footer: {
        padding: '12px 16px',
        display: 'flex',
        gap: 10,
        borderTop: '1px solid #e0e0e0',
    },
    filter_label: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 6,
        display: 'block',
    },
    apply_btn: {
        flex: 1,
        background: '#e50914',
        color: '#fff',
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': { background: '#b0070f' },
    },
    clear_btn: {
        flex: 1,
        background: '#e0e0e0',
        color: '#444',
        textTransform: 'none',
        fontWeight: 'bold',
        '&:hover': { background: '#ccc' },
    },
    rating_row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
}))

const ListPage = () => {
    const classes = useStyles()
    const listPageState = useSelector((state) => state.ListPageReducer)
    const { upcomingMovieListData, currentPage, total_pages, emptyData, searchMovieData, searchFlag, searchValue } = listPageState
    const dispatch = useDispatch()

    const [movieListFilter, setMovieListFilter] = useState('popular')
    const [drawerOpen, setDrawerOpen]           = useState(false)

    // Filter state (pending = inside drawer before Apply)
    const [genre, setGenre]         = useState('')
    const [sortBy, setSortBy]       = useState('popularity.desc')
    const [minRating, setMinRating] = useState(0)
    const [year, setYear]           = useState('')
    const [language, setLanguage]   = useState('')

    // Applied filter state (used in the actual API call)
    const [applied, setApplied] = useState(null)

    const activeFilterCount = applied
        ? [applied.genre, applied.minRating > 0, applied.year, applied.language].filter(Boolean).length
        : 0

    const buildUrl = () => {
        if (searchFlag) {
            return `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchValue}&page=${currentPage}`
        }
        if (applied) {
            const params = new URLSearchParams({
                api_key: API_KEY,
                page: currentPage,
                sort_by: applied.sortBy,
            })
            if (applied.genre)                params.append('with_genres', applied.genre)
            if (applied.minRating > 0)        params.append('vote_average.gte', applied.minRating)
            if (applied.year)                 params.append('primary_release_year', applied.year)
            if (applied.language)             params.append('with_original_language', applied.language)
            return `https://api.themoviedb.org/3/discover/movie?${params}`
        }
        return `https://api.themoviedb.org/3/movie/${movieListFilter}?api_key=${API_KEY}&page=${currentPage}`
    }

    useEffect(() => {
        axios.get(buildUrl())
            .then((response) => {
                if (response.data?.results?.length > 0) {
                    searchFlag
                        ? dispatch(setSearchData(response.data))
                        : dispatch(setApiData(response.data))
                } else {
                    dispatch(setEmptyData())
                }
            })
            .catch((error) => console.log(error))
        // eslint-disable-next-line
    }, [currentPage, searchFlag, movieListFilter, dispatch, searchValue, applied])

    const handleApplyFilters = () => {
        setApplied({ genre, sortBy, minRating, year, language })
        setDrawerOpen(false)
    }

    const handleClearFilters = () => {
        setGenre(''); setSortBy('popularity.desc'); setMinRating(0); setYear(''); setLanguage('')
        setApplied(null)
        setDrawerOpen(false)
    }

    const pageTitle = applied
        ? 'Filtered Movies'
        : `${movieListFilter.replace('_', ' ')} Movies`

    return (
        <div>
            <Header />

            {searchFlag ? (
                <h2 className={`${classes.page_title} list_page_title`}>Search Results for "{searchValue}"</h2>
            ) : (
                <div className={classes.top_bar}>
                    <h1 className={`${classes.page_title} list_page_title`}>{pageTitle}</h1>
                    <div className={classes.chips_row}>
                        {[
                            { label: 'Popular',     value: 'popular' },
                            { label: 'Now Playing', value: 'now_playing' },
                            { label: 'Top Rated',   value: 'top_rated' },
                            { label: 'Upcoming',    value: 'upcoming' },
                        ].map(c => (
                            <Chip
                                key={c.value}
                                label={c.label}
                                clickable
                                className={`${classes.chip} ${!applied && movieListFilter === c.value ? classes.chip_active : ''}`}
                                onClick={() => { setMovieListFilter(c.value); setApplied(null) }}
                            />
                        ))}
                        <Badge badgeContent={activeFilterCount} color="error">
                            <IconButton className={classes.filter_icon_btn} onClick={() => setDrawerOpen(true)}>
                                <FilterListIcon />
                            </IconButton>
                        </Badge>
                    </div>
                </div>
            )}

            {!emptyData && (
                <div className={classes.button_wrapper}>
                    <Fab size="medium" color="secondary" className={classes.btns} onClick={() => dispatch(setDecrementPage())} disabled={currentPage === 1}>
                        <ChevronLeftIcon />
                    </Fab>
                    <Fab size="medium" color="secondary" className={classes.btns} onClick={() => dispatch(setIncrementPage())} disabled={currentPage === total_pages}>
                        <ChevronRightIcon />
                    </Fab>
                </div>
            )}

            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center">
                        {!emptyData ? (
                            (searchFlag ? searchMovieData : upcomingMovieListData)?.map((value) => (
                                <Grid key={value.id} item>
                                    <List data={value} />
                                </Grid>
                            ))
                        ) : (
                            <div className={classes.no_data}><h2>No Data Found</h2></div>
                        )}
                    </Grid>
                </Grid>
            </Grid>

            {!emptyData && (
                <div className={classes.button_wrapper}>
                    <Fab size="medium" color="secondary" className={classes.btns} onClick={() => dispatch(setDecrementPage())} disabled={currentPage === 1}>
                        <ChevronLeftIcon />
                    </Fab>
                    <Fab size="medium" color="secondary" className={classes.btns} onClick={() => dispatch(setIncrementPage())} disabled={currentPage === total_pages}>
                        <ChevronRightIcon />
                    </Fab>
                </div>
            )}

            {/* Filter Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} classes={{ paper: classes.drawer_paper }}>
                <div className={classes.drawer_header}>
                    <span className={classes.drawer_title}>Filter Movies</span>
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
                                {MOVIE_GENRES.map(g => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
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
                        <Slider
                            value={minRating}
                            onChange={(_, v) => setMinRating(v)}
                            min={0} max={9} step={1}
                            marks
                            style={{ color: '#e50914' }}
                        />
                    </div>

                    {/* Release Year */}
                    <div>
                        <span className={classes.filter_label}>Release Year</span>
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

export default ListPage
