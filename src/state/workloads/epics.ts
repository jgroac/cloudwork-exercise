import { combineEpics, Epic, ofType } from 'redux-observable';
import { map, tap, ignoreElements, filter, mergeMap } from 'rxjs/operators';

import { Action } from '../actions';
import { State } from '../reducer';
import { created, WORKLOAD_SUBMIT } from './actions';
import { WorkloadService } from './services';


type AppEpic = Epic<Action, Action, State>;


// import { WorkloadService } from './services';
// const workloadService = new WorkloadService();
// workloadService.create({ complexity: 1 })
//   .then(console.log.bind(console, 'workloadService create'));


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


export const epics = combineEpics(
  logWorkloadSubmissions,
  createNewWorkload
);

export default epics;