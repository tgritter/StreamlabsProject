import {TYPES} from '../actions/types';

const INITIAL_STATE = {
  screenName: '',
  imageURL: '',
  accessToken: '',
  streamNumber: 1,
  totalViewers: 0
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.screenName: {
      return {
        ...state,
        screenName: action.payload
      };
    }
    case TYPES.imageURL: {
      return {
        ...state,
        imageURL: action.payload
      };
    }
    case TYPES.accessToken: {
      return {
        ...state,
        accessToken: action.payload
      };
    }
    case TYPES.streamNumber: {
      return {
        ...state,
        streamNumber: action.payload
      };
    }
    case TYPES.totalViewers: {
      return {
        ...state,
        totalViewers: action.payload
      };
    }
    default:
      return state;
  }
}
