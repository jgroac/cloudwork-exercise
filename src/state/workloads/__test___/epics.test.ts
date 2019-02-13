import { TestScheduler } from 'rxjs/testing';
import {
    createNewWorkload,
} from '../epics'
import { of } from 'rxjs';

describe('createNewWorkload', () => {
    it(' should call the api to create a new workload and dispatch the create action', async () => {
        const complexity = 6;
        const action$: any = of({
            type: 'WORKLOAD_SUBMIT',
            payload: { complexity }
        });
        const state$: any = null;
        const workloadMock = {
            id: 1,
            completeDate: '2018-01-01',
            complexity
        }
        const workloadServiceMock = {
            create: jest.fn().mockResolvedValue(workloadMock)
        };

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await createNewWorkload(action$, state$, dependencies).toPromise();
        expect(output$).toEqual(
            {
                type: 'WORKLOAD_CREATED',
                payload: workloadMock
            }
        );
    });
})