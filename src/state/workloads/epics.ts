import { combineEpics, Epic, ofType } from 'redux-observable';
import { map, tap, ignoreElements, filter, mergeMap, takeWhile } from 'rxjs/operators';

// Types
import { Action } from '../actions';
import { State } from '../reducer';
import {
  WORKLOAD_SUBMIT,
  WORKLOAD_CANCEL
} from './types';
import { WorkloadService } from './services';

type AppEpic = Epic<Action, Action, State>;

// Actions
import { created, updateStatus } from './actions';


const logWorkloadSubmissions: AppEpic = (action$, state$) => (
  action$.pipe(
    ofType('WORKLOAD_SUBMIT'),
    map(action => action.payload),
    tap((payload) => console.log('Workload submitted', payload)),
    ignoreElements(),
  )
);
interface deps {
  workloadService: WorkloadService
}

export const createNewWorkload: AppEpic = (
  action$,
  state$,
  { workloadService }: deps
) => (
  action$.pipe(
    filter(
      (action: Action): action is WORKLOAD_SUBMIT => action.type === 'WORKLOAD_SUBMIT'
    ),
    map((action) => action.payload),
    mergeMap(({ complexity }) =>
      workloadService
        .create({ complexity })
        .then((workload) => {
          return created(workload);
        })
    ),
  )
);

export const cancelWorkload: AppEpic = (
  action$,
  state$,
  { workloadService }: deps
) => (
  action$.pipe(
    filter(
      (action: Action): action is WORKLOAD_CANCEL => action.type === 'WORKLOAD_CANCEL'
    ),
    map(action => action.payload),
    takeWhile((payload) => state$.value.workloads[payload.id].status === 'WORKING'),
    mergeMap((payload) =>
      workloadService
        .cancel(payload)
        .then(() => updateStatus({
          id: payload.id,
          status: 'CANCELED'
        }))
    ),
  )
);

export const epics = combineEpics(
  logWorkloadSubmissions,
  createNewWorkload,
  cancelWorkload
);

export default epics;