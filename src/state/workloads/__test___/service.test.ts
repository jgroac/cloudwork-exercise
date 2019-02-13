import { WorkloadService } from '../services'

describe('workloadService', () => {
    it('create should create a new workload service with the given complexity', async () => {
        const workloadService = new WorkloadService();
        const workload = await workloadService.create({ complexity: 5 });
        expect(workload).toMatchObject({
            id: 0,
            complexity: 5,
            completeDate: expect.any(Date)
        });
    });

    it(`shouldn't update the workload before the working time has being reached`, async () => {
        const workloadService = new WorkloadService();
        const workload = await workloadService.create({ complexity: 4 });

        const workTimeInMilliseconds = 1000;
        const delayOneSec = () => new Promise((resolve, reject) => {
            setTimeout(() => resolve(1), workTimeInMilliseconds)
        });
        await delayOneSec();

        const workloadAfterOneSec = await workloadService.checkStatus({ id: workload.id });
        expect(workloadAfterOneSec.status).toBe('WORKING');
    });

    it('should update the workload when the working time has being reached', async () => {
        const workloadService = new WorkloadService();
        const workload = await workloadService.create({ complexity: 2 });

        const workTimeInMilliseconds = 2000;
        const delayTwoSecs = () => new Promise((resolve, reject) => {
            setTimeout(() => resolve(1), workTimeInMilliseconds)
        });
        await delayTwoSecs();

        const workloadAfterOneSec = await workloadService.checkStatus({ id: workload.id });
        expect(workloadAfterOneSec.status).toBe('SUCCESS');
    });
})