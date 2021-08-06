import React, { useEffect, useState } from 'react';
import { makeStyles, Avatar, AppBar, Toolbar, InputBase, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchData, setSearchFlag, setEmptyData, setSearchValue } from '../../store/actions/ListPageActionTypes'
import axios from 'axios'
import logo from '../../assets/quick_trailer_logo.PNG'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@material-ui/icons/Mic';



const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {

        [theme.breakpoints.up('sm')]: {
            display: 'block',
            fontWeight: 'bold'
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
           width:'190px',
        },
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '60ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    homeIcon: {
        color: '#9b9b9b'
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
    }
}));

const Header = () => {

    //speech recognition
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    const classes = useStyles();
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        transcript &&
            setSearchText(transcript)
        dispatch(setSearchValue(transcript))
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=88428b2a9e9d271ea540df7c3fa4dac3&query=${transcript}`)
            .then(function (response) {
                // handle success
                if (response.data.results.length === 0) {
                    dispatch(setEmptyData())
                }
                else {
                    dispatch(setSearchData(response.data))
                    dispatch(setSearchValue(transcript))
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }, [transcript])


    const handleSearch = (e) => {
        console.log(e.target.value)
        if (e.target.value === '') {
            dispatch(setSearchFlag())
            setSearchText('')
        }
        else {
            dispatch(setSearchValue(e.target.value))
            setSearchText(e.target.value)
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=88428b2a9e9d271ea540df7c3fa4dac3&query=${e.target.value}`)
                .then(function (response) {
                    // handle success
                    if (response.data.results.length === 0) {
                        dispatch(setEmptyData())
                    }
                    else {
                        dispatch(setSearchData(response.data))
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        }
    }
    const onRedirect = () => {
        dispatch(setSearchFlag())
        setSearchText('')
    }


    const handleMicOn = () => {
        SpeechRecognition.startListening()
        setInterval(() => {
            SpeechRecognition.stopListening()
            // resetTranscript()
        }, 10000);
    }

    return (
        <div className={classes.grow}>
            <AppBar position="static" color="transparent" >
                <Toolbar>
                    {/* <Avatar alt="Profile Picture" className={classes.app_logo} src="data:image/png;base64,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" /> */}
                   <Link to="/"> <Avatar alt="Profile Picture" className={classes.app_logo} src={logo} /></Link>
                    {window.location.pathname.split("/")[1] === "detailpage" ? (
                        <Typography variant="h6" className={classes.title} type="h6">
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
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={handleSearch}
                            />
                            <IconButton aria-label="Home" color="inherit" onClick={handleMicOn} className={classes.icon_mic}>
                                <MicIcon className={listening ? classes.mic_icon_on : classes.mic_icon_off} />
                            </IconButton>
                        </div>
                    )}
                    <div className={classes.grow} />
                    <div >
                        <IconButton aria-label="Home" color="inherit" className={classes.homeIcon} onClick={onRedirect}>
                            <Link to="/">
                                <HomeIcon />
                            </Link>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header