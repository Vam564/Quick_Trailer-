export const TRAILER_API_SUCCESS = "TRAILER_API_SUCCESS"


export const setMovieTrailerData = (payload) =>{
   return ({type:TRAILER_API_SUCCESS, payload})
}