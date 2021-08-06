import React from 'react'
import {useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux'
import {setDetailPageContent} from '../../store/actions/ListPageActionTypes'
import default_img from '../../assets/default_img.png'
const useStyles = makeStyles({
  root: {
    maxWidth: 200,
    width:"100%",
    borderRadius: 5,
    margin: 15,
  },
  description: {
    whiteSpace: 'nowrap',
    fontSize: 12,
    width: 60,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  lines_text: {
    overflow: "none",
    textOverflow: 'none',
    fontSize: 12,
  },
  movie_title: {
    marginBottom: 0,
    color: '#9b9b9b',
    fontSize: 12,
    fontWeight: 'bold',
    margin: "0 0 5px"
  },
  rating: {
    color: '#d2c9c9',
    fontSize: 12,
    fontWeight: 'normal',
    float: 'right',
  },
  description_wrapper: {
    display: 'flex',
    paddingTop: 5
  },
  movie_content:{
    width:204,
    height:60,
  },
  content_img:{
    height:"100%",
    minHeight:'300px'
  }

});

const List = ({ data }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch()

  const handleDetailPage = () => {
    dispatch(setDetailPageContent(data))
    history.push("/detailpage")
  }

  return (
    <Card className={classes.root} onClick={handleDetailPage}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Image"
          height="150"
          image={data.poster_path ? (`http://image.tmdb.org/t/p/w300/${data.poster_path}`) : (`${default_img}`)}
          title={data.original_title}
          className={classes.content_img}
        />
        <CardContent style={{ padding: '10px' }} className={classes.movie_content} >
          <Grid container spacing={3}>
            <Grid item xs={9}>
            <p className={classes.movie_title}>{data.original_title}</p>
            </Grid>
            <Grid item xs={2}>
            <span className={classes.rating} >({data.vote_average})</span>
            </Grid>
          </Grid>
          <div className={classes.description_wrapper}>
            <Typography variant="body2" color="textSecondary" component="p" className={classes.description}>
              {data.overview}
            </Typography>
            <span className={classes.lines_text}>(2 lines)</span>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default List
