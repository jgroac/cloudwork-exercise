import { TestScheduler } from 'rxjs/testing';
import {
    createNewWorkload,
    cancelWorkload
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


describe('cancelWorkload', () => {
    it(`should call the api to cancel the workload and dispatch the action
    for update workload status`, async () => {
            const id = 1;
            const action$: any = of({
                type: 'WORKLOAD_CANCEL',
                payload: { id }
            });
            const state$: any = { value: { workloads: { 1: { status: 'WORKING' } } } };
            const cancelMock = jest.fn().mockResolvedValue('canceled')
            const workloadServiceMock = {
                cancel: cancelMock
            };

            const dependencies = { workloadService: workloadServiceMock };

            const output$ = await cancelWorkload(action$, state$, dependencies).toPromise();
            expect(output$).toEqual(
                {
                    type: 'WORKLOAD_UPDATE_STATUS',
                    payload: {
                        id,
                        status: 'CANCELED'
                    }
                }
            );
            expect(cancelMock).toHaveBeenCalledTimes(1);
        });

    it(`shouldn't call the API if the workload status is 'SUCCESS'`, async () => {
        const id = 1;
        const action$: any = of({
            type: 'WORKLOAD_CANCEL',
            payload: { id }
        });
        const state$: any = { value: { workloads: { 1: { status: 'SUCCESS' } } } };
        const workloadServiceMock = {
            cancel: jest.fn().mockResolvedValue('canceled')
        };

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await cancelWorkload(action$, state$, dependencies).toPromise();
        expect(workloadServiceMock.cancel).toHaveBeenCalledTimes(0)
    });

    it(`shouldn't call the API if the workload status is 'FAILURE'`, async () => {
        const id = 1;
        const action$: any = of({
            type: 'WORKLOAD_CANCEL',
            payload: { id }
        });
        const state$: any = { value: { workloads: { 1: { status: 'FAILURE' } } } };
        const workloadServiceMock = {
            cancel: jest.fn().mockResolvedValue('canceled')
        };

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await cancelWorkload(action$, state$, dependencies).toPromise();
        expect(workloadServiceMock.cancel).toHaveBeenCalledTimes(0)
    });
})