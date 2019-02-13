import { combineEpics, Epic, ofType } from 'redux-observable';
import { map, tap, ignoreElements, filter, mergeMap, takeWhile, takeUntil, delay } from 'rxjs/operators';
import moment from 'moment'

// Types
import { Action } from '../actions';
import { State } from '../reducer';
import {
  WORKLOAD_SUBMIT,
  WORKLOAD_CANCEL,
  WORKLOAD_CREATED,
  WORKLOAD_CHECK_STATUS
} from './types';
import { WorkloadService } from './services';

type AppEpic = Epic<Action, Action, State>;

// Actions
import { created, updateStatus, checkStatus } from './actions';
import { of } from 'rxjs';
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

export const checkWorkload: AppEpic = (
  action$,
  state$,
) => (
  action$.pipe(
    filter(
      (action: Action): action is WORKLOAD_CREATED => action.type === 'WORKLOAD_CREATED'
    ),
    map(action => action.payload.id),
    mergeMap((payload) => {
      const workload = state$.value.workloads[payload]
      return of(workload).pipe(
        takeUntil(
          action$.ofType('WORKLOAD_CANCEL').pipe(
            filter(
              (a: Action) => {
                const action = a as WORKLOAD_CANCEL;
                return action.payload.id === workload.id;
              }
            )
          )
        ),
        delay(moment(workload.completeDate).toDate()),
        takeWhile((value) => {
          const workload = state$.value.workloads[value.id];
          return workload.status === 'WORKING';
        }),
        map((value) => checkStatus(value)),
      )
    }),
  )
);

export const updateWorkloadStatusAutomatically: AppEpic = (
  action$,
  state$,
  { workloadService }: deps
) => (
  action$.pipe(
    filter(
      (action: Action): action is WORKLOAD_CHECK_STATUS => action.type === 'WORKLOAD_CHECK_STATUS'
    ),
    map(action => action.payload),
    mergeMap((value) => workloadService.checkStatus(value)),
    mergeMap((workload) => {
      if (workload.status === 'WORKING') {
        return of(workload).pipe(delay(100));
      }

      return of(workload);
    }),
    map(workload => {
      if (workload.status === 'WORKING') {
        return checkStatus(workload);
      }

      return updateStatus({
        id: workload.id,
        status: workload.status
      });
    }),
  )
);

export const epics = combineEpics(
  createNewWorkload,
  cancelWorkload,
  checkWorkload,
  updateWorkloadStatusAutomatically
);

export default epics;