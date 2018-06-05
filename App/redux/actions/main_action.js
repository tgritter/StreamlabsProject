import {TYPES} from './types'

export const setUserScreenName = payload => ({ type: TYPES.screenName, payload });
export const setUserImageURL = payload => ({ type: TYPES.imageURL, payload });
export const setAccessToken = payload => ({ type: TYPES.accessToken, payload });

export const setStreamNumber = payload => ({ type: TYPES.streamNumber, payload });
export const setCurrentViewerNumber = payload => ({ type: TYPES.totalViewers, payload });
