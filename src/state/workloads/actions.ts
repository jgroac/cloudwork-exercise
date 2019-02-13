import { Status } from './types';

export type WORKLOAD_SUBMIT = {
  type: 'WORKLOAD_SUBMIT',
  payload: {
    complexity: number
  }
}

export type Action = WORKLOAD_SUBMIT | {
  type: 'WORKLOAD_CREATED';
  payload: {
    id: number;
    complexity: number;
    completeDate: Date;
  };
} | {
  type: 'WORKLOAD_CANCEL';
  payload: {
    id: number;
  };
} | {
  type: 'WORKLOAD_CHECK_STATUS';
  payload: {
    id: number;
  };
} | {
  type: 'WORKLOAD_UPDATE_STATUS';
  payload: {
    id: number;
    status: Status;
  };
};

export const submit = ({ complexity }: { complexity: number }): Action => ({
  type: 'WORKLOAD_SUBMIT',
  payload: {
    complexity,
  },
});

export const created = ({ id, complexity, completeDate }: { id: number, complexity: number, completeDate: Date }): Action => ({
  type: 'WORKLOAD_CREATED',
  payload: {
    id,
    completeDate,
    complexity,
  },
});

export const cancel = ({ id }: { id: number }): Action => ({
  type: 'WORKLOAD_CANCEL',
  payload: {
    id,
  },
});

export const checkStatus = ({ id }: { id: number }): Action => ({
  type: 'WORKLOAD_CHECK_STATUS',
  payload: {
    id,
  },
});

export const updateStatus = ({ id, status }: { id: number, status: Status }): Action => ({
  type: 'WORKLOAD_UPDATE_STATUS',
  payload: {
    id,
    status,
  },
});

