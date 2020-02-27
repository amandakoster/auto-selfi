import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import { UPDATE_EXPRESSIONS, PHOTO_TAKEN } from "./actionTypeConstants";

const INITIAL_STATE = {
    expressions: [],
    photos: []
}

const rootReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_EXPRESSIONS:
            return {
                ...state,
                expressions: action.payload.expressions
            }
        case PHOTO_TAKEN:
            return {
                ...state,
                photos: [...state.photos, action.payload.photo]
            }
        default:
            return state;
    }
}

export default createStore(rootReducer, applyMiddleware(thunkMiddleware));