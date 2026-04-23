import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Grid, CardMedia, Typography, makeStyles, Fab } from '@material-ui/core';
import axios from 'axios'
import Header from '../Header/Header'
import { setMovieTrailerData } from '../../store/actions/DetailPageActionTypes'
import Media from '../Media/Media'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import default_img from '../../assets/default_img.png'

const useStyles = makeStyles((theme) => ({
    hero: {
        position: 'relative',
        minHeight: 'calc(100vh - 80px)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: '#ffffff',
    },
    hero_overlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)',
    },
    header_wrapper: {
        position: 'relative',
        zIndex: 10,
    },
    hero_content: {
        position: 'relative',
        zIndex: 1,
        padding: '0 30px 50px',
        [theme.breakpoints.up('md')]: {
            padding: '0 50px 60px',
        },
    },
    cover: {
        width: '130px',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.8)',
        marginBottom: '16px',
        [theme.breakpoints.up('md')]: {
            width: '160px',
            marginBottom: 0,
        },
    },
    movie_info: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: '30px',
        },
    },
    movie_title: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0 0 8px',
        color: '#ffffff',
        lineHeight: 1.2,
        [theme.breakpoints.up('md')]: {
            fontSize: '42px',
        },
    },
    rating: {
        color: '#c9c9c9',
        fontSize: '24px',
        fontWeight: 'normal',
    },
    movie_details: {
        fontSize: '14px',
        color: '#bbbbbb',
        marginBottom: '10px',
    },
    movie_overview_title: {
        color: '#ffffff',
        margin: '12px 0 4px',
    },
    movie_overview: {
        fontSize: '14px',
        color: '#dddddd',
        lineHeight: 1.7,
        maxWidth: '680px',
        margin: 0,
    },
    btns: {
        margin: '20px 10px 0 0',
        backgroundColor: '#e50914',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#b0070f',
        },
    },
    trailer_section: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 1rem 1.5rem',
    },
}));

const DetailPage = () => {
    const content = useSelector((state) => state.ListPageReducer)
    const { detailPageData } = content
    const history = useHistory()
    const dispatch = useDispatch()
    const [watchTrailer, setWatchTrailer] = useState(false)
    const [isMovie, setIsMovie] = useState(false)
    const [open, setOpen] = useState(false)
    const classes = useStyles()

    useEffect(() => {
        if (Object.entries(detailPageData).length === 0) {
            history.push('/')
        }
    })

    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleWatchTrailer = () => {
        const url = `https://api.themoviedb.org/3/movie/${detailPageData.id}/videos?api_key=88428b2a9e9d271ea540df7c3fa4dac3`
        axios.get(url)
            .then((response) => {
                dispatch(setMovieTrailerData(response.data))
                setIsMovie(false)
                setWatchTrailer(true)
                handleClickOpen()
            })
            .catch((error) => console.log(error))
    }

    const handleWatchMovie = () => {
        setIsMovie(true)
        setWatchTrailer(true)
        handleClickOpen()
    }

    const releaseYear = detailPageData.release_date?.split('-')[0]

    return (
        <div>
            <Header />
            <div
                className={classes.hero}
                style={{
                    backgroundImage: detailPageData.backdrop_path
                        ? `url(http://image.tmdb.org/t/p/original${detailPageData.backdrop_path})`
                        : `url(${default_img})`,
                }}
            >
                <div className={classes.hero_overlay} />

                <div className={classes.hero_content}>
                    <Grid container alignItems="flex-end">
                        <Grid item xs={12} md="auto">
                            <CardMedia
                                component="img"
                                alt={detailPageData.original_title}
                                className={classes.cover}
                                image={
                                    detailPageData.poster_path
                                        ? `http://image.tmdb.org/t/p/w500${detailPageData.poster_path}`
                                        : default_img
                                }
                                title={detailPageData.original_title}
                            />
                        </Grid>
                        <Grid item xs={12} md className={classes.movie_info}>
                            <h1 className={classes.movie_title}>
                                {detailPageData.original_title}
                                {detailPageData.vote_average
                                    ? <span className={classes.rating}> ({detailPageData.vote_average})</span>
                                    : null}
                            </h1>
                            <Typography component="p" variant="body2" className={classes.movie_details}>
                                {releaseYear && <span>{releaseYear}</span>}
                                {detailPageData.runtime ? <span> &bull; {detailPageData.runtime} min</span> : null}
                                {detailPageData.original_language
                                    ? <span> &bull; {detailPageData.original_language.toUpperCase()}</span>
                                    : null}
                            </Typography>
                            <h5 className={classes.movie_overview_title}>Overview</h5>
                            <p className={classes.movie_overview}>{detailPageData.overview}</p>
                            <div>
                                <Fab variant="extended" size="medium" className={classes.btns} onClick={handleWatchTrailer}>
                                    <PlayArrowIcon />&nbsp;Play Trailer
                                </Fab>
                                <Fab variant="extended" size="medium" className={classes.btns} onClick={handleWatchMovie}>
                                    <PlayArrowIcon />&nbsp;Play Movie
                                </Fab>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>

            {watchTrailer && (
                <Media
                    handleClickOpen={handleClickOpen}
                    handleClose={handleClose}
                    open={open}
                    setOpen={setOpen}
                    isMovie={isMovie}
                    movieId={detailPageData.id}
                />
            )}
        </div>
    )
}

export default DetailPage
