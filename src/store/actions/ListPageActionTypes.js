 export const API_SUCCESS = "API_SUCCESS"
 export const ON_PAGE_CHANGE = "ON_PAGE_CHANGE"
 export const DETAIL_PAGE_CONTENT = "DETAIL_PAGE_CONTENT"
 export const INCREMENT_PAGE = "INCREMENT_PAGE"
 export const DECREMENT_PAGE = "DECREMENT_PAGE"
 export const SEARCH_DATA = "SEARCH_DATA"
 export const SEARCH_DATA_FLAG = "SEARCH_DATA_FLAG"
 export const SEARCH_KEYWORD = "SEARCH_KEYWORD"
 export const NO_DATA_FROM_API = "NO_DATA_FROM_API"

 // middleware usage
// export const setIncrementCount = (payload) => async (dispatch) =>{
//         dispatch( {type:INCREMENT_COUNT,payload})
// }

export const setApiData = (payload) =>{
    return ({type:API_SUCCESS, payload})
}

export const setCurrentPageList = (payload) =>{
    return ({type:ON_PAGE_CHANGE, payload})
}

export const setDetailPageContent = (payload) =>{
    return ({type:DETAIL_PAGE_CONTENT, payload})
}

export const setIncrementPage = (payload) =>{
    return ({type:INCREMENT_PAGE, payload})
}

export const setDecrementPage = (payload) =>{
    return ({type:DECREMENT_PAGE, payload})
}
export const setSearchData = (payload) =>{
    return ({type:SEARCH_DATA, payload})
}

export const setSearchFlag = (payload) =>{
    return ({type:SEARCH_DATA_FLAG, payload})
}

export const setSearchValue = (payload) =>{
    return ({type:SEARCH_KEYWORD, payload})
}

export const setEmptyData= (payload) =>{
    return ({type:NO_DATA_FROM_API, payload})
}

