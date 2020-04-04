import { observable, action, computed } from 'mobx';
import moment from 'moment';

export type status = 'resolved'|'partial'|'pending';

export type actionId = number;
export type projectId = number;

export interface actionSource {
    actionId: actionId;
    projectId: projectId;
    modifyTime: number;

    title: string;
    description: string;
    status: status;

    nextActionId: actionId|null;
}

export interface SourceMap {
    [actionId: number]: actionSource;
}

export class Action {
    readonly __data__: Data;

    actionId: actionId;
    projectId: projectId;
    modifyTime: number;

    title: string;
    description: string;
    status: status;

    nextAction: Action|null;

    constructor(actionSource: actionSource, data: Data) {
        this.__data__ = data;

        this.actionId = actionSource.actionId;
        this.projectId = actionSource.projectId;
        this.modifyTime = actionSource.modifyTime;

        this.title = actionSource.title;
        this.description = actionSource.description;
        this.status = actionSource.status;

        this.nextAction = actionSource.nextActionId !== null
            ? data.actionMap[actionSource.nextActionId]
            : null;
    }
}

export interface ActionMap {
    [actionId: number]: Action;
}

export interface ProjectQueue {
    data: Action;
    next: ProjectQueue|null;
}

export interface ProjectMapItem {
    head: ProjectQueue;
    end: ProjectQueue;
}

export interface ProjectMap {
    [projectId: number]: ProjectMapItem;
}

export interface Payload {
    status?: status;
    title?: string;
    description?: string;
}

export interface Params {
    status?: status;
    title: string;
    description?: string;
}

export class Data {
    @observable
    public actionMap: ActionMap = {};
    @observable
    public head: Action|null = null;
    @observable
    public projectMap: ProjectMap = {};

    private actionIdCount: number = 0;
    private projectIdCount: number = 0;

    constructor(dataList: actionSource[]) {
        this.actionIdCount = dataList.length;
        dataList.forEach(actionSource => {
            if (actionSource.projectId > this.projectIdCount - 1) {
                this.projectIdCount = actionSource.projectId + 1;
            }
            this.insertAction(actionSource);
        })
    }

    @computed
    get actionSources(): actionSource[] {
        let pointer = this.head;
        let result: actionSource[] = [];
        while (pointer) {
            result.unshift({
                actionId: pointer.actionId,
                projectId: pointer.projectId,
                modifyTime: pointer.modifyTime,

                status: pointer.status,
                title: pointer.title,
                description: pointer.description,

                nextActionId: pointer.nextAction !== null
                    ? pointer.nextAction.actionId
                    : null,
            });
            pointer = pointer.nextAction;
        }
        return result;
    }

    @action
    updateProject(projectId: projectId, payload: Payload) {
        const lastProjectAction = this.projectMap[projectId].head.data;
        const actionSource: actionSource = {
            actionId: this.actionIdCount++,
            projectId: projectId,
            modifyTime: Date.now(),

            status: payload.status || lastProjectAction.status,
            title: payload.title || lastProjectAction.title,
            description: payload.description || lastProjectAction.description,

            nextActionId: this.head ? this.head.actionId : null
        };
        this.insertAction(actionSource);
    }

    @action
    createProject(params: Params) {
        const actionSource: actionSource = {
            actionId: this.actionIdCount,
            projectId: this.projectIdCount++,
            modifyTime: Date.now(),

            status: params.status || 'pending',
            title: params.title || '',
            description: params.description || '',

            nextActionId: this.head ? this.head.actionId : null
        };
        this.actionIdCount++;
        this.insertAction(actionSource);
    }

    @action
    private insertAction(actionSource: actionSource) {
        const action = new Action(actionSource, this);
        this.actionMap[actionSource.actionId] = action;
        this.head = action;

        const projectQueue = this.projectMap[action.projectId];
        const newProjectQueue: ProjectQueue = { data: action, next: null };
        if (projectQueue) {
            newProjectQueue.next = projectQueue.head;
            projectQueue.head = newProjectQueue;
        } else {
            this.projectMap[action.projectId] = {
                head: newProjectQueue,
                end: newProjectQueue,
            }
        }
    }
}

export class DataByTimeRange {
    @observable
    public __data__: Data;
    @observable
    public minTime: number;
    @observable
    public maxTime: number;

    constructor(data: Data, minTime: number, maxTime: number) {
        this.__data__ = data;
        this.minTime = minTime;
        this.maxTime = maxTime;
    }

    @computed
    get data(): ProjectMapItem[] {
        let result: ProjectMapItem[] = [];
        Object.values(this.__data__.projectMap).forEach((item: ProjectMapItem) => {
            if (!(item.end.data.modifyTime > this.maxTime
                || (
                    item.head.data.modifyTime < this.minTime
                    && !(item.head.data.status !== 'resolved')
                ))) {
                    result.push(item);
            }
        });
        return result;
    }

    getDataByStatus(status: status): ProjectMapItem[] {
        let result: ProjectMapItem[];
        result = this.data.filter(item => item.head.data.status === status);
        return result;
    }

    @computed
    get resolvedData(): ProjectMapItem[] {
        return this.getDataByStatus('resolved');
    }

    @computed
    get pendingData(): ProjectMapItem[] {
        return this.getDataByStatus('pending');
    }

    @computed
    get partialData(): ProjectMapItem[] {
        return this.getDataByStatus('partial');
    }
}

let a = new Data([]);

a.createProject({ title: 'new Project' });
a.createProject({ title: 'new Project' });

console.log(a);
