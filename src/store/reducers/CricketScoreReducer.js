import { TRAILER_API_SUCCESS} from '../actions/DetailPageActionTypes'
const initial_state = {
   movieTrailerData:{},
}

const ListPageReducer = (state = initial_state, { type, payload }) => {

    switch (type) {
        case TRAILER_API_SUCCESS:
            return {
                ...state,
                movieTrailerData:payload.results
            }

        

        default: return state
    }

}

export default ListPageReducer