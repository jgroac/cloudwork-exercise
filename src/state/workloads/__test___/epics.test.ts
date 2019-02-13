import { TestScheduler } from 'rxjs/testing';
import {
    createNewWorkload,
    cancelWorkload,
    checkWorkload,
    updateWorkloadStatusAutomatically
} from '../epics'
import { of } from 'rxjs';
import { ActionsObservable } from 'redux-observable';

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

describe('checkWorkload', () => {
    it(`should dispatch WORKLOAD_CHECK_STATUS some time after the workload was created
        only if the workload status is 'WORKING'`, async () => {
        const workloadMock = {
            id: 1,
            completeDate: '2018-01-01',
            complexity: 5,
            status: 'WORKING'
        }
        const input$ = of({
            type: 'WORKLOAD_CREATED',
            payload: workloadMock
        });

        const action$: any = new ActionsObservable(input$);
        const state$: any = { value: { workloads: { 1: workloadMock } } };
        const workloadServiceMock = {}

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await checkWorkload(action$, state$, dependencies).toPromise();
        expect(output$).toEqual(
            {
                type: 'WORKLOAD_CHECK_STATUS',
                payload: {
                    id: workloadMock.id,
                }
            }
        );
    });

    it(`shouldn't dispatch WORKLOAD_CHECK_STATUS is the workload status is 'WORKING'`, async () => {
        const workloadMock = {
            id: 1,
            completeDate: '2018-01-01',
            complexity: 5,
            status: 'FAILURE'
        }
        const input$ = of({
            type: 'WORKLOAD_CREATED',
            payload: workloadMock
        });

        const action$: any = new ActionsObservable(input$);
        const state$: any = { value: { workloads: { 1: workloadMock } } };
        const workloadServiceMock = {}

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await checkWorkload(action$, state$, dependencies).toPromise();
        expect(output$).toBeUndefined()
    });
})



describe('updateWorkloadStatusAutomatically', () => {
    it(`should check the workload status and update if it's neither 'WORKING' OR 'CANCELED'`, async () => {
        const id = 2;
        const action$: any = of({
            type: 'WORKLOAD_CHECK_STATUS',
            payload: { id }
        });
        const state$: any = null;
        const workloadMock = {
            id,
            completeDate: '2018-01-01',
            complexity: 5,
            status: 'SUCCESS'
        }
        const workloadServiceMock = {
            checkStatus: jest.fn().mockResolvedValue(workloadMock)
        };

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await updateWorkloadStatusAutomatically(action$, state$, dependencies).toPromise();
        expect(output$).toEqual(
            {
                type: 'WORKLOAD_UPDATE_STATUS',
                payload: {
                    id,
                    status: workloadMock.status
                }
            }
        );
    });

    it(`should dispatch a WORKLOAD_CHECK_STATUS action if the workload status is still 'WORKING'`, async () => {
        const id = 2;
        const action$: any = of({
            type: 'WORKLOAD_CHECK_STATUS',
            payload: { id }
        });
        const state$: any = null;
        const workloadMock = {
            id,
            completeDate: '2018-01-01',
            complexity: 5,
            status: 'WORKING'
        }
        const workloadServiceMock = {
            checkStatus: jest.fn().mockResolvedValue(workloadMock)
        };

        const dependencies = { workloadService: workloadServiceMock };

        const output$ = await updateWorkloadStatusAutomatically(action$, state$, dependencies).toPromise();
        expect(output$).toEqual(
            {
                type: 'WORKLOAD_CHECK_STATUS',
                payload: {
                    id
                }
            }
        );
    });
})