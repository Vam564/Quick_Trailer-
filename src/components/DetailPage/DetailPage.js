import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Grid, Card, CardMedia, Typography, makeStyles, Fab } from '@material-ui/core';
import axios from 'axios'
import Header from '../Header/Header'
import { setMovieTrailerData } from '../../store/actions/DetailPageActionTypes'
import Media from '../Media/Media'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import default_img from '../../assets/default_img.png'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: "center",
        border: 'none',
        boxShadow: 'none',
        backgroundPosition: 'right -200px top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        borderRadius: 0,
    },
    custom_bg: {
        backgroundImage: 'linear-gradient(to right, rgba(10.98%, 8.63%, 11.37%, 1.00) 150px, rgba(10.98%, 8.63%, 11.37%, 0.84) 100%)',
        paddingTop: 10,
    },
    details: {
        display: 'flex',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: '70%',
        padding: 10,
        height: '90%',
        [theme.breakpoints.up('md')]: {
            width: '100%',
            margin: '0 auto',
            objectFit: 'contain',
        },
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    rating: {
        color: '#d2c9c9',
    },
    image_content: {
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        },
    },
    movie_content: {
        padding: 15,
        margin: '10px',

        [theme.breakpoints.up('md')]: {
            padding: '30px 0 0 50px',
            margin: '10px 0'

        },
    },
    movie_overview_title: {
        color: '#ffffff'
    },
    movie_overview: {
        fontSize: '14px',
        color: '#ffffff'
    },
    movie_cast: {
        fontSize: '14px',
    },
    movie_title: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    movie_details: {
        fontSize: '14px',
    },
    btns: {
        margin: '10px 0',
        padding: '10px',
    },
    trailer_video: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0px 1.0875rem 1.45rem',
    }
}));


const DetailPage = () => {

    const content = useSelector((state) => state.ListPageReducer)
    // const content_detail = useSelector((state) => state.DetailPageReducer)
    const { detailPageData } = content
    const history = useHistory();
    const dispatch = useDispatch()
    const [watchTrailer, setWatchTrailer] = useState(false)
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    useEffect(() => {
        if (Object.entries(detailPageData).length === 0) {
            history.push('/')
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleWatchTrailer = () => {

        console.log("hello")
        let url = `https://api.themoviedb.org/3/movie/${detailPageData.id}/videos?api_key=88428b2a9e9d271ea540df7c3fa4dac3`

        axios.get(url)
            .then(function (response) {
                // handle success
                dispatch(setMovieTrailerData(response.data))
                setWatchTrailer(true)
                handleClickOpen()
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }



    return (
        <div>
            <Header></Header>
            <Card className={classes.root} style={{ backgroundImage: detailPageData.backdrop_path ? `url(http://image.tmdb.org/t/p/w500${detailPageData.backdrop_path})` : `${default_img}`, }}>
                <div className={classes.custom_bg}>
                    <Grid container >
                        <Grid container >
                            <Grid item xs={12} md={2} className={classes.image_content}>
                                <CardMedia
                                    component="img"
                                    alt="Image"
                                    height="150"
                                    className={classes.cover}
                                    image={detailPageData.poster_path ? (`http://image.tmdb.org/t/p/w500${detailPageData.poster_path}`) : (`${default_img}`)}
                                    title="Live from space album cover"
                                />
                            </Grid>
                            <Grid item xs={12} md={9} className={classes.movie_content}>
                                <h2> {detailPageData.original_title} <span className={classes.rating}>({detailPageData.vote_average})</span></h2>
                                <Typography component="p" variant="body2" className={classes.movie_details}>
                                    Year | Length | Director
                                </Typography>
                                <Typography component="p" variant="body2" className={classes.movie_cast}>
                                    Cast : Actor 1, Actor 2 ...
                                </Typography>
                                <h5 className={classes.movie_overview_title}>Overview : </h5>
                                <p className={classes.movie_overview}>
                                    {detailPageData.overview}
                                </p>
                                <Fab variant="extended" size="small" className={classes.btns} onClick={handleWatchTrailer} >
                                    <PlayArrowIcon className={classes.extendedIcon} />
                                    Play Trailer
                                </Fab>
                            </Grid>

                        </Grid>
                    </Grid>
                </div>

            </Card>
            <div className={classes.trailer_video}>
                {watchTrailer && <Media handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} setOpen={setOpen} />}
            </div>
        </div>
    );
}

export default DetailPage






