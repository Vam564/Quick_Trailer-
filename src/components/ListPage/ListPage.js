import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Grid, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { setApiData, setIncrementPage, setDecrementPage, setSearchData, setEmptyData } from '../../store/actions/ListPageActionTypes'
import List from './List'
import Header from '../Header/Header'
import '../../App.css'
// import GooglePayUPI from '../PaymentGateway/GooglePayUPI';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
    button_wrapper: {
        display: "flex",
        justifyContent: 'center',
        padding: '10px 0',
        margin: '10px 0'
    },
    btns: {
        margin: "0 5px"
    },
    page_title: {
        paddingLeft: 30,
        color: '#4d4d4d',
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    filter_section: {
        display: 'flex',
        justifyContent: 'center'
    },
    no_data: {
        display: 'flex',
        justifyContent: 'center',
    }
}));


const ListPage = () => {

    const classes = useStyles();
    const listPageState = useSelector((state) => state.ListPageReducer)
    const { upcomingMovieListData, currentPage, total_pages,emptyData, searchMovieData, searchFlag, searchValue } = listPageState
    const dispatch = useDispatch()
    const [movieListFilter, setMovieListFilter] = React.useState('popular');
    //const [emptyData, setemptyData] = React.useState(emptyData)

    const handleChange = (event) => {
        setMovieListFilter(event.target.value);
    };

    useEffect(() => {
      //  setemptyData(false)
        let url = searchFlag ? (`https://api.themoviedb.org/3/search/movie?api_key=88428b2a9e9d271ea540df7c3fa4dac3&query=${searchValue}&page=${currentPage}`)
            : (`https://api.themoviedb.org/3/movie/${movieListFilter}?api_key=88428b2a9e9d271ea540df7c3fa4dac3&page=${currentPage}`)

        axios.get(url)
            .then(function (response) {
                // handle success
                response.data?.results ?
                    (response.data.results.length === 0 ?
                        (dispatch(setEmptyData()))
                        : (searchFlag ? dispatch(setSearchData(response.data)) : dispatch(setApiData(response.data)))) :
                    (dispatch(setEmptyData()))
                // if(response.data?.results){
                //     searchFlag ? dispatch(setSearchData(response.data)) : dispatch(setApiData(response.data))
                // }
                // else{
                //     setemptyData(true)
                // }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }, [currentPage, searchFlag, movieListFilter, dispatch, searchValue])

    return (
        <div>
            <Header></Header>
            
            {searchFlag ? (
                <h2 className={`${classes.page_title} list_page_title`}> Search Results for "{searchValue}"</h2>
            ) : (
                <Grid container className={classes.root}>
                <Grid item xs={12} md={9}>
                    <h1 className={`${classes.page_title} list_page_title`}>{movieListFilter} Movies </h1>
                </Grid>
                <Grid item xs={12} md={3} className={classes.filter_section}>
                    <FormControl className={classes.formControl}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Movies to show
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label"
                            value={movieListFilter}
                            onChange={handleChange}
                            displayEmpty
                            className={classes.selectEmpty}
                            autoWidth
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'latest'}>Latest</MenuItem>
                            <MenuItem value={'now_playing'}>Now Playing</MenuItem>
                            <MenuItem value={'popular'}>Popular</MenuItem>
                            <MenuItem value={'top_rated'}>Top Rated</MenuItem>
                            <MenuItem value={'upcoming'}>Upcoming</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            )}
           
            { !emptyData && <div className={classes.button_wrapper}>
                <Fab size="medium" color="secondary" aria-label="previous" className={classes.btns} onClick={() => dispatch(setDecrementPage())} disabled={currentPage === 1 ? true : false} >
                    <ChevronLeftIcon />
                </Fab>
                <Fab size="medium" color="secondary" aria-label="next" className={classes.btns} onClick={() => dispatch(setIncrementPage())} disabled={currentPage === total_pages ? true : false}>
                    <ChevronRightIcon />
                </Fab>
            </div>}
            <Grid container className={classes.root} >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" >
                        {
                            !emptyData ? (searchFlag ? (
                                searchMovieData && searchMovieData.map((value) => (
                                    <Grid key={value.id} item>
                                        <List data={value} />
                                    </Grid>
                                ))
                            ) : (
                                upcomingMovieListData && upcomingMovieListData.map((value) => (
                                    <Grid key={value.id} item>
                                        <List data={value} />
                                    </Grid>
                                ))
                            )) : (
                                <div className={classes.no_data}>
                                    <h2>No Data Found</h2>
                                </div>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
            { !emptyData && <div className={classes.button_wrapper}>
                <Fab size="medium" color="secondary" aria-label="previous" className={classes.btns} onClick={() => dispatch(setDecrementPage())} disabled={currentPage === 1 ? true : false} >
                    <ChevronLeftIcon />
                </Fab>
                <Fab size="medium" color="secondary" aria-label="next"  className={classes.btns} onClick={() => dispatch(setIncrementPage())} disabled={currentPage === total_pages ? true : false}>
                    <ChevronRightIcon />
                </Fab>
            </div>}

        </div>
    )
}

export default ListPage
