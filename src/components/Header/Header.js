import React, { useEffect, useState } from 'react';
import { makeStyles, Avatar, AppBar, Toolbar, InputBase, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import MovieIcon from '@material-ui/icons/Movie';
import TvIcon from '@material-ui/icons/Tv';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import SportsIcon from '@material-ui/icons/Sports';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import CloseIcon from '@material-ui/icons/Close';
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchData, setSearchFlag, setEmptyData, setSearchValue, setSeriesSearchData, clearSeriesSearch, setMusicSearchData, clearMusicSearch } from '../../store/actions/ListPageActionTypes'
import axios from 'axios'
import logo from '../../assets/quick_trailer_logo.PNG'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@material-ui/icons/Mic';

const NAV_ITEMS = [
    { label: 'Movies',  path: '/',       icon: <MovieIcon /> },
    { label: 'Series',  path: '/series', icon: <TvIcon /> },
    { label: 'Music',   path: '/music',  icon: <MusicNoteIcon /> },
    { label: 'Sports',  path: '/sports', icon: <SportsIcon /> },
    { label: 'Games',   path: '/games',  icon: <SportsEsportsIcon /> },
]

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    title: {
        color: '#333333',
        fontWeight: 'bold',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#DFDFDF',
        '&:hover': {
            backgroundColor: '#DFDFDF',
        },
        marginRight: theme.spacing(0),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(4),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        color: '#9b9b9b',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        [theme.breakpoints.down('md')]: {
            width: '190px',
        },
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '60ch',
        },
    },
    app_logo: {
        width: 65,
        height: 65,
    },
    mic_icon_on: {
        color: '#3fde3f',
    },
    mic_icon_off: {
        color: '#9b9b9b',
    },
    icon_mic: {
        [theme.breakpoints.down('md')]: {
            position: 'absolute',
            right: '-6px',
            bottom: '-7px',
        },
    },
    hamburger: {
        color: '#555555',
    },
    drawer_paper: {
        width: 240,
    },
    drawer_header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
    },
    drawer_title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333333',
    },
    nav_item: {
        padding: '10px 20px',
        '&:hover': {
            background: 'rgba(229,9,20,0.06)',
        },
    },
    nav_item_active: {
        background: 'rgba(229,9,20,0.1)',
        borderRight: '3px solid #e50914',
        '& $nav_icon': { color: '#e50914' },
        '& $nav_text': { color: '#e50914', fontWeight: 'bold' },
    },
    nav_icon: {
        color: '#777777',
        minWidth: 40,
    },
    nav_text: {
        color: '#333333',
        fontSize: 15,
    },
}));

const Header = () => {
    const { transcript, listening } = useSpeechRecognition();
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [searchText, setSearchText] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const currentPath = window.location.pathname;

    useEffect(() => {
        transcript &&
            setSearchText(transcript)
        dispatch(setSearchValue(transcript))
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=88428b2a9e9d271ea540df7c3fa4dac3&query=${transcript}`)
            .then(function (response) {
                if (response.data.results.length === 0) {
                    dispatch(setEmptyData())
                } else {
                    dispatch(setSearchData(response.data))
                    dispatch(setSearchValue(transcript))
                }
            })
            .catch(function (error) { console.log(error) })
    }, [transcript, dispatch]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (typingTimeout) clearTimeout(typingTimeout);
        const path = window.location.pathname;
        setTypingTimeout(
            setTimeout(() => {
                if (value === '') {
                    if (path === '/series') dispatch(clearSeriesSearch());
                    else if (path === '/music') dispatch(clearMusicSearch());
                    else dispatch(setSearchFlag());
                } else if (path === '/series') {
                    axios.get(`https://api.themoviedb.org/3/search/tv?api_key=88428b2a9e9d271ea540df7c3fa4dac3&query=${value}`)
                        .then((res) => {
                            dispatch(setSearchValue(value))
                            dispatch(setSeriesSearchData(res.data))
                        })
                        .catch((err) => console.log(err));
                } else if (path === '/music') {
                    dispatch(setSearchValue(value));
                    axios.get(`https://spotify.4texasplayz4.workers.dev/s/${encodeURIComponent(value)}`)
                        .then((res) => dispatch(setMusicSearchData(res.data)))
                        .catch((err) => console.log(err));
                } else {
                    dispatch(setSearchValue(value));
                    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=88428b2a9e9d271ea540df7c3fa4dac3&query=${value}`)
                        .then((res) => {
                            if (res.data.results.length === 0) dispatch(setEmptyData());
                            else dispatch(setSearchData(res.data));
                        })
                        .catch((err) => console.log(err));
                }
            }, 500)
        );
    };

    const handleMicOn = () => {
        SpeechRecognition.startListening();
        setTimeout(() => SpeechRecognition.stopListening(), 10000);
    };

    const handleNavClick = (path) => {
        dispatch(setSearchFlag())
        dispatch(clearSeriesSearch())
        dispatch(clearMusicSearch())
        setSearchText('')
        setDrawerOpen(false)
        history.push(path)
    }

    const isDetailPage = currentPath.split('/')[1] === 'detailpage'

    return (
        <div className={classes.grow}>
            <AppBar position="static" color="default" style={{ background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Toolbar>
                    <Link to="/"><Avatar alt="Quick Trailer" className={classes.app_logo} src={logo} /></Link>

                    {isDetailPage ? (
                        <Typography variant="h6" className={classes.title}>
                            Movie Details
                        </Typography>
                    ) : (
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                value={searchText}
                                classes={{ root: classes.inputRoot, input: classes.inputInput }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={handleSearch}
                            />
                            <IconButton onClick={handleMicOn} className={classes.icon_mic}>
                                <MicIcon className={listening ? classes.mic_icon_on : classes.mic_icon_off} />
                            </IconButton>
                        </div>
                    )}

                    <div className={classes.grow} />

                    <IconButton className={classes.hamburger} onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                classes={{ paper: classes.drawer_paper }}
            >
                <div className={classes.drawer_header}>
                    <span className={classes.drawer_title}>Menu</span>
                    <IconButton size="small" onClick={() => setDrawerOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider />
                <List disablePadding>
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentPath === item.path
                        return (
                            <ListItem
                                button
                                key={item.label}
                                className={`${classes.nav_item} ${isActive ? classes.nav_item_active : ''}`}
                                onClick={() => handleNavClick(item.path)}
                            >
                                <ListItemIcon className={classes.nav_icon}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    classes={{ primary: classes.nav_text }}
                                />
                            </ListItem>
                        )
                    })}
                </List>
            </Drawer>
        </div>
    );
}

export default Header
