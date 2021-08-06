import React, { } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Grid, FormControl, InputLabel, MenuItem, Select, Paper, Avatar, Badge } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import Header from './Header';
import logo from '../../assets/quick_trailer_logo.PNG'
import CricketCard from './CricketCard'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: '#eff0f5',
      
    },
    paper_featured_match: {
        height: '250px',
        width: '100%',
        margin: '0 auto 10px',
        borderRadius: 10,
        padding: '10px',
        boxShadow: 'none',

    },
    paper_upcoming_match: {
        height: '250px',
        width: '100%',
        margin: '10px auto 0',
        borderRadius: 10,
        padding: '10px',
        boxShadow: 'none',
    },
    right_section: {
        margin: '20px',
        borderRadius: '10px',
        background: '#eff0f5',
    },
    left_section: {
        margin: '20px',
        borderRadius: '10px',
        background: '#ffffff',
        padding: '12px',

    },
}))
//#e1e4ed
//#373b40 -- header active
//#adb3c6 -- header normal
//#202529 -- headining color
//#f94226 -- live match card color
const CricketHome = () => {

    const classes = useStyles();
    const listPageState = useSelector((state) => state.ListPageReducer)
    const { upcomingMovieListData, currentPage, total_pages, emptyData, searchMovieData, searchFlag, searchValue } = listPageState
    const dispatch = useDispatch()

    const randomColor = () => {
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor
    }

    useEffect(() => {
        //  setemptyData(false)
          let url = `https://cricapi.com/api/${cricket}?apikey=R6yNZaThxLkaKVcI292ZnImlRfcY2`
          axios.get(url)
              .then(function (response) {
                  // handle success
                    
              })
              .catch(function (error) {
                  // handle error
                  console.log(error);
              })
      }, [])



    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} md={3} className={classes.left_section} spacing={2}>
                    <h2>Live Match</h2>
                    <CricketCard></CricketCard>
                </Grid>
                <Grid item xs={12} md={8} className={classes.right_section}>
                    <Header></Header>
                    <div>
                        <Paper className={classes.paper_featured_match}>
                            <h2>Featured match</h2>
                        </Paper>
                    </div>
                    <div>

                        <Paper className={classes.paper_upcoming_match}>
                            <h2>Upcoming match</h2>
                        </Paper>
                    </div>

                </Grid>
            </Grid>
        </div>
    )
}

export default CricketHome

// let tree = {
//     name: "A",
//     children:  [
//       {
//         name: "B",
//         children: [
//           {
//             name: "E",
//             children: [
//               {
//                   name:'H'
//               }
//             ]
//           }    
//         ]
//       },
//       {
//         name: "C",
//         children: [
//           {
//             name: "F",
//             children: [
//                 {
//                     name:'I'
//                 }
//             ]
//           }    
//         ]
//       },
//       {
//         name: "D",
//         children: [
//           {
//             name: "G",
//             children: [{
//               name:"J"
//             }]
//           }    
//         ]
//       }
//     ]
//   }
  