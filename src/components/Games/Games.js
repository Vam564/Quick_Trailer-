import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Grid, Card, CardActionArea, CardContent, CardMedia,
    Typography, Dialog, IconButton, AppBar, Toolbar
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import Header from '../Header/Header'

const GAMES = [
    {
        id: 1,
        title: 'GTA Vice City',
        description: 'Play the classic GTA Vice City adventure directly in your browser.',
        url: 'https://vc.quenq.com/',
        thumbnail: 'https://vc.quenq.com/cover.jpg',
        tag: 'Action',
    },
    {
        id: 2,
        title: 'The Race',
        description: 'High speed racing action straight in your browser.',
        url: 'https://cinevo-therace.netlify.app/',
        thumbnail: 'https://therace.montblanclegend.com/share/share_en-us.png?v=798ddcc2',
        tag: 'Racing',
    },
    {
        id: 3,
        title: 'Deadshot',
        description: 'First-person aim trainer and shooting game.',
        url: 'https://deadshot.io/',
        thumbnail: 'https://deadshot.io/promo/thumbnail.png',
        tag: 'Shooter',
    },
    {
        id: 4,
        title: 'EaglyMC',
        description: 'Minecraft-style block building adventure playable in browser.',
        url: 'https://4texas4.github.io/EaglyMC/',
        thumbnail: 'https://geometry-games.io/data/image/game/eaglercraft/eaglercraft.png',
        tag: 'Adventure',
    },
    {
        id: 5,
        title: 'Subway Surfers',
        description: 'Sprint through the subway, dodge trains and collect coins.',
        url: 'https://szhong.4399.com/4399swf//upload_swf/ftp35/liuxinyu/20210324/jj01/index.html',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BNWRkNGNmMDgtMmU5MC00MjgzLWFmZTQtNTdhZDYzMGUzN2I0XkEyXkFqcGc@._V1_.jpg',
        tag: 'Action',
    },
    {
        id: 6,
        title: 'Hill Climb Racing',
        description: 'Drive uphill without flipping your vehicle — addictive physics fun.',
        url: 'https://4texas4.github.io/zenith/games/hillclimbracing.html',
        thumbnail: 'https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=600,height=600,fit=cover,f=auto/b87616bb88c0e3cb4c150c59fdc767fa/hill-climb-racing-lite.png',
        tag: 'Racing',
    },
    {
        id: 7,
        title: 'Angry Birds',
        description: 'The legendary slingshot physics game — fling birds to smash pigs.',
        url: 'https://funhtml5games.com/angrybirds/index.html',
        thumbnail: 'https://www.angrybirds.com/wp-content/uploads/2022/06/AB_Classic_1920x1080_TitlePicture_Vector-1300x731.png',
        tag: 'Casual',
    },
]

const useStyles = makeStyles(() => ({
    page: {
        minHeight: '100vh',
        background: '#f5f5f5',
    },
    page_title: {
        paddingLeft: 30,
        color: '#4d4d4d',
        fontFamily: "'Righteous', cursive",
        textTransform: 'uppercase',
    },
    grid_wrapper: {
        padding: '10px 20px 30px',
    },
    card: {
        maxWidth: 220,
        width: '100%',
        borderRadius: 8,
        margin: 12,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
        },
    },
    card_img: {
        height: 140,
        objectFit: 'cover',
    },
    card_content: {
        padding: '10px 12px',
        height: 80,
    },
    game_title: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333333',
        margin: '0 0 4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    game_tag: {
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#e50914',
        background: 'rgba(229,9,20,0.08)',
        borderRadius: 4,
        padding: '2px 6px',
        marginBottom: 4,
    },
    game_desc: {
        fontSize: 11,
        color: '#9b9b9b',
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        margin: 0,
    },
    appbar: {
        background: '#1a1a1a',
        boxShadow: 'none',
        position: 'relative',
    },
    game_title_bar: {
        flex: 1,
        color: '#ffffff',
        fontWeight: 'bold',
        paddingLeft: 8,
    },
    close_btn: {
        color: '#ffffff',
    },
    fullscreen_btn: {
        color: '#ffffff',
    },
    iframe: {
        width: '100%',
        height: 'calc(100vh - 56px)',
        border: 'none',
        display: 'block',
        background: '#000',
    },
}))

const Games = () => {
    const classes = useStyles()
    const [selectedGame, setSelectedGame] = useState(null)
    const iframeRef = React.useRef(null)

    const handleOpen = (game) => setSelectedGame(game)
    const handleClose = () => setSelectedGame(null)

    const handleFullscreen = () => {
        if (iframeRef.current) {
            if (iframeRef.current.requestFullscreen) {
                iframeRef.current.requestFullscreen()
            } else if (iframeRef.current.webkitRequestFullscreen) {
                iframeRef.current.webkitRequestFullscreen()
            }
        }
    }

    return (
        <div className={classes.page}>
            <Header />
            <h1 className={`${classes.page_title} list_page_title`}>Games</h1>

            <Grid container className={classes.grid_wrapper} justifyContent="center">
                {GAMES.map((game) => (
                    <Grid item key={game.id}>
                        <Card className={classes.card} onClick={() => handleOpen(game)}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt={game.title}
                                    className={classes.card_img}
                                    image={game.thumbnail}
                                    title={game.title}
                                />
                                <CardContent className={classes.card_content}>
                                    <span className={classes.game_tag}>{game.tag}</span>
                                    <p className={classes.game_title}>{game.title}</p>
                                    <Typography component="p" className={classes.game_desc}>
                                        {game.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog fullScreen open={!!selectedGame} onClose={handleClose}>
                <AppBar className={classes.appbar}>
                    <Toolbar variant="dense">
                        <IconButton className={classes.close_btn} onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography className={classes.game_title_bar}>
                            {selectedGame?.title}
                        </Typography>
                        <IconButton className={classes.fullscreen_btn} onClick={handleFullscreen} aria-label="fullscreen">
                            <FullscreenIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {selectedGame && (
                    <iframe
                        ref={iframeRef}
                        src={selectedGame.url}
                        className={classes.iframe}
                        title={selectedGame.title}
                        allow="fullscreen; autoplay"
                        allowFullScreen
                    />
                )}
            </Dialog>
        </div>
    )
}

export default Games
