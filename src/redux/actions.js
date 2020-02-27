import { UPDATE_EXPRESSIONS, PHOTO_TAKEN } from "./actionTypeConstants";

// Action creator functions
export const updateExpressions = (expressions) => ({
    type: UPDATE_EXPRESSIONS,
    payload: {
        expressions
    }
});

export const photoTaken = (url) => ({
    type: PHOTO_TAKEN,
    payload: {
        photo: url
    }
})