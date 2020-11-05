"use strict";

export type entryObjectType = { importance: number; description: string; createdTime: number; finishedTime: number; id: string; title: string; isFinished: boolean }

export class ObjectEntry{
    private _data = {
        id: "",
        title: "",
        description: "",
        importance: 1,
        isFinished: false,
        createdTime: 0,
        finishedTime: 0
    };
    get data(){return this._data;}

    setFullData(id : string, title : string, description : string, importance : number, createdTime : number, finishedTime : number, isFinished : boolean){
        this._data.id = id;
        this._data.title = title;
        this._data.description = description;
        this._data.importance = importance;
        this._data.createdTime = createdTime;
        this._data.finishedTime = finishedTime;
        this._data.isFinished = isFinished;
    }

    constructor(){
        this._data.createdTime = Date.now();
    }
}