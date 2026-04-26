import { API_SUCCESS,NO_DATA_FROM_API, ON_PAGE_CHANGE, DETAIL_PAGE_CONTENT, INCREMENT_PAGE, DECREMENT_PAGE, SEARCH_DATA, SEARCH_DATA_FLAG, SEARCH_KEYWORD, SERIES_SEARCH_DATA, SERIES_SEARCH_FLAG, MUSIC_SEARCH_DATA, MUSIC_SEARCH_FLAG, MUSIC_SOURCE } from '../actions/ListPageActionTypes'
const initial_state = {
    fullMovieApiData: {},
    total_pages: 1,
    upcomingMovieListData: [],
    detailPageData: {},
    currentPage: 1,
    searchMovieData: [],
    searchFlag: false,
    searchValue:'',
    emptyData:false,
    seriesSearchData: [],
    seriesSearchFlag: false,
    musicSearchData: [],
    musicSearchFlag: false,
    musicSource: 'spotify',
}

const ListPageReducer = (state = initial_state, { type, payload }) => {

    switch (type) {
        case API_SUCCESS:
            return {
                ...state,
                fullMovieApiData: payload,
                upcomingMovieListData: payload.results,
                total_pages: payload.total_pages,
                currentPage: payload.page,
                emptyData:false
            }

        case ON_PAGE_CHANGE:
            return {
                ...state,
                currentPage: payload
            }

        case DETAIL_PAGE_CONTENT:
            return {
                ...state,
                detailPageData: payload
            }
        case INCREMENT_PAGE:
            return {
                ...state,
                currentPage: state.currentPage + 1
            }
        case DECREMENT_PAGE:
            return {
                ...state,
                currentPage: state.currentPage - 1
            }
        case SEARCH_DATA:
            return {
                ...state,
                searchMovieData: payload.results,
                total_pages: payload.total_pages,
                currentPage: payload.page,
                searchFlag: true,
                emptyData:false
            }
        case SEARCH_DATA_FLAG:
            return {
                ...state,
                searchFlag: false,
                total_pages: state.fullMovieApiData.total_pages,
                currentPage: 1,
                searchValue:''
            }
        case SEARCH_KEYWORD:
            return {
                ...state,
                searchValue: payload,
   
            }
        case NO_DATA_FROM_API:
            return {
                ...state,
                emptyData: true,
            }
        case SERIES_SEARCH_DATA:
            return {
                ...state,
                seriesSearchData: payload.results,
                seriesSearchFlag: true,
            }
        case SERIES_SEARCH_FLAG:
            return { ...state, seriesSearchData: [], seriesSearchFlag: false }
        case MUSIC_SEARCH_DATA:
            return { ...state, musicSearchData: payload, musicSearchFlag: true }
        case MUSIC_SEARCH_FLAG:
            return { ...state, musicSearchData: [], musicSearchFlag: false }
        case MUSIC_SOURCE:
            return { ...state, musicSource: payload }

        default: return state
    }

}

export default ListPageReducer