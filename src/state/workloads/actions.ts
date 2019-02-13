import {
  Status,
  WORKLOAD_SUBMIT,
  WORKLOAD_CREATED,
  WORKLOAD_CANCEL,
  WORKLOAD_CHECK_STATUS,
  WORKLOAD_UPDATE_STATUS,
  ActionsTypes
} from './types';


export const submit = ({ complexity }: { complexity: number }): WORKLOAD_SUBMIT => ({
  type: ActionsTypes.WORKLOAD_SUBMIT,
  payload: {
    complexity,
  },
});

export const created = (
  { id, complexity, completeDate }: { id: number, complexity: number, completeDate: Date }
): WORKLOAD_CREATED => ({
    type: ActionsTypes.WORKLOAD_CREATED,
  payload: {
    id,
    completeDate,
    complexity,
  },
});

export const cancel = ({ id }: { id: number }): WORKLOAD_CANCEL => ({
  type: ActionsTypes.WORKLOAD_CANCEL,
  payload: {
    id,
  },
});

export const checkStatus = ({ id }: { id: number }): WORKLOAD_CHECK_STATUS => ({
  type: ActionsTypes.WORKLOAD_CHECK_STATUS,
  payload: {
    id,
  },
});

export const updateStatus = (
  { id, status }: { id: number, status: Status }
): WORKLOAD_UPDATE_STATUS => ({
    type: ActionsTypes.WORKLOAD_UPDATE_STATUS,
  payload: {
    id,
    status,
  },
});

