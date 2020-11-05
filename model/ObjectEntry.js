"use strict";
export class ObjectEntry {
    constructor() {
        this._data = {
            id: "",
            title: "",
            description: "",
            importance: 1,
            isFinished: false,
            createdTime: 0,
            finishedTime: 0
        };
        this._data.createdTime = Date.now();
    }
    get data() { return this._data; }
    setFullData(id, title, description, importance, createdTime, finishedTime, isFinished) {
        this._data.id = id;
        this._data.title = title;
        this._data.description = description;
        this._data.importance = importance;
        this._data.createdTime = createdTime;
        this._data.finishedTime = finishedTime;
        this._data.isFinished = isFinished;
    }
}
