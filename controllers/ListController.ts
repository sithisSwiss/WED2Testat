"use strict";
import {handlerDB} from "../services/HandlerDB.js";
import {ObjectEntry, entryObjectType} from "../model/ObjectEntry.js";
import {cookieHandler} from "../services/CookieHandler.js";


export class ListController {
    private _sortingEnum = {
        CreatedTime: 0,
        FinishedTime: 2,
        Importance: 4,
        Title: 6,
    };
    get sortingEnum() {return this._sortingEnum}

    private _listOfNodes : ObjectEntry[] = [];
    getListOfEntries() : ObjectEntry[] {
        return this._listOfNodes;
    }

    async reloadList() {
        this._listOfNodes = [];
        const array = this._listOfNodes;
        const objects : any = await handlerDB.getAllObjects();
        objects.forEach((item : entryObjectType) => {
                const tempEntry : ObjectEntry = new ObjectEntry();
                tempEntry.setFullData(item.id, item.title, item.description, item.importance, item.createdTime, item.finishedTime, item.isFinished);
                array.push(tempEntry);
            });
        this.sortList();
    }

    async getEntryByID(id : string) {
        return await handlerDB.getObjectFromDB(id);
    }

    async changeFinishState(id : string) {
        const obj : any = await handlerDB.getObjectFromDB(id);
        const isFinished : boolean = !obj.isFinished;
        let finishedtime : number = 0;
        if (isFinished) finishedtime = Date.now();
        await handlerDB.updateFinishState(id, finishedtime, isFinished);
        await this.reloadList();
    }
    async setFinishState(id : string, isFinished : boolean){
        const obj : any = await handlerDB.getObjectFromDB(id);
        if(!(obj.isFinished === isFinished)){
            let finishedtime : number = 0;
            if (isFinished) finishedtime = Date.now();
            await handlerDB.updateFinishState(id, finishedtime, isFinished);
            await this.reloadList();
        }
    }

    async addNewEntry(title : string, description : string, importance : number) {
        const entry : ObjectEntry = new ObjectEntry();
        entry.data.title = title;
        entry.data.description = description;
        entry.data.importance = importance;
        await handlerDB.addObjectToDB(entry.data);
        await this.reloadList();
    }

    async removeEntryByID(id : string) {
        await handlerDB.removeObject(id);
        await this.reloadList();
    }

    async removeAllEntries() {
        await handlerDB.removeAllObject();
        await this.reloadList();
    }

    async updateEntryFromEditPage(id : string, title : string, description : string, importance : number, isFinished : boolean) {
        await handlerDB.updateObjectFromEditPage(id, title, description, importance);
        await this.setFinishState(id, isFinished);
        await this.reloadList();
    }

    sortList() {
        const sortedOver : number = cookieHandler.getListSorted();
        this._listOfNodes.sort((a : ObjectEntry , b : ObjectEntry) => {
            let aValue : any;
            let bValue : any;
            switch(sortedOver){
                case this._sortingEnum.CreatedTime:
                    aValue = a.data.createdTime;
                    bValue = b.data.createdTime;
                    break;
                case this._sortingEnum.FinishedTime:
                    aValue = a.data.finishedTime;
                    bValue = b.data.finishedTime;
                    break;
                case this._sortingEnum.Importance:
                    aValue = a.data.importance;
                    bValue = b.data.importance;
                    break;
                case this._sortingEnum.Title:
                    aValue = a.data.title;
                    bValue = b.data.title;
                    break;
                default:
                    aValue = 1;
                    bValue = 0;
                    break;
            }
            if (aValue > bValue) return 1;
            if (aValue < bValue) return -1;
            return 0;
        });
        if (!cookieHandler.getIsASC())
            this._listOfNodes.reverse();
    }

    async sortListOver(over : number){
        let sortedOver : number = cookieHandler.getListSorted();
        let isASC : boolean = cookieHandler.getIsASC();
        if(sortedOver === over) // already sorting -> change direction
            isASC = !isASC;
        else{
            isASC = true;
            sortedOver = over;
        }
        cookieHandler.setSortingComplete(sortedOver, isASC);
        await this.reloadList();
    }
}


export const listController = new ListController();