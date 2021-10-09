import produce from 'immer'

import { errorHandle } from '../../utils'

export enum BASE {
    SET_VIEW_WIDTH = 'SET_VIEW_WIDTH'
}

export interface IBaseState {
    viewWidth: number
}

export const baseState: IBaseState = {
    viewWidth: document.body.clientWidth
}

export default {
    [BASE.SET_VIEW_WIDTH]: {
        next: produce((draft: IBaseState, action: { payload: number }) => {
            draft.viewWidth = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    }
}
