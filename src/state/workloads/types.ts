export type Status = 'WORKING' | 'SUCCESS' | 'FAILURE' | 'CANCELED';

export enum ActionsTypes {
    WORKLOAD_SUBMIT = 'WORKLOAD_SUBMIT',
    WORKLOAD_CREATED = 'WORKLOAD_CREATED',
    WORKLOAD_CANCEL = 'WORKLOAD_CANCEL',
    WORKLOAD_CHECK_STATUS = 'WORKLOAD_CHECK_STATUS',
    WORKLOAD_UPDATE_STATUS = 'WORKLOAD_UPDATE_STATUS'
}

export type Action = WORKLOAD_SUBMIT
    | WORKLOAD_CREATED
    | WORKLOAD_CANCEL
    | WORKLOAD_CHECK_STATUS
    | WORKLOAD_UPDATE_STATUS

export type WORKLOAD_SUBMIT = {
    type: ActionsTypes.WORKLOAD_SUBMIT,
    payload: {
        complexity: number
    }
}

export type WORKLOAD_CREATED = {
    type: ActionsTypes.WORKLOAD_CREATED;
    payload: {
        id: number;
        complexity: number;
        completeDate: Date;
    }
}

export type WORKLOAD_CANCEL = {
    type: ActionsTypes.WORKLOAD_CANCEL,
    payload: {
        id: number
    },
}

export type WORKLOAD_CHECK_STATUS = {
    type: ActionsTypes.WORKLOAD_CHECK_STATUS,
    payload: {
        id: number
    }
}

export type WORKLOAD_UPDATE_STATUS = {
    type: ActionsTypes.WORKLOAD_UPDATE_STATUS,
    payload: {
        id: number,
        status: Status
    }
}