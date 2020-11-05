"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handlerDB } from "../services/HandlerDB.js";
import { ObjectEntry } from "../model/ObjectEntry.js";
import { cookieHandler } from "../services/CookieHandler.js";
export class ListController {
    constructor() {
        this._sortingEnum = {
            CreatedTime: 0,
            FinishedTime: 2,
            Importance: 4,
            Title: 6,
        };
        this._listOfNodes = [];
    }
    get sortingEnum() { return this._sortingEnum; }
    getListOfEntries() {
        return this._listOfNodes;
    }
    reloadList() {
        return __awaiter(this, void 0, void 0, function* () {
            this._listOfNodes = [];
            const array = this._listOfNodes;
            const objects = yield handlerDB.getAllObjects();
            objects.forEach((item) => {
                const tempEntry = new ObjectEntry();
                tempEntry.setFullData(item.id, item.title, item.description, item.importance, item.createdTime, item.finishedTime, item.isFinished);
                array.push(tempEntry);
            });
            this.sortList();
        });
    }
    getEntryByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield handlerDB.getObjectFromDB(id);
        });
    }
    changeFinishState(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield handlerDB.getObjectFromDB(id);
            const isFinished = !obj.isFinished;
            let finishedtime = 0;
            if (isFinished)
                finishedtime = Date.now();
            yield handlerDB.updateFinishState(id, finishedtime, isFinished);
            yield this.reloadList();
        });
    }
    setFinishState(id, isFinished) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield handlerDB.getObjectFromDB(id);
            if (!(obj.isFinished === isFinished)) {
                let finishedtime = 0;
                if (isFinished)
                    finishedtime = Date.now();
                yield handlerDB.updateFinishState(id, finishedtime, isFinished);
                yield this.reloadList();
            }
        });
    }
    addNewEntry(title, description, importance) {
        return __awaiter(this, void 0, void 0, function* () {
            const entry = new ObjectEntry();
            entry.data.title = title;
            entry.data.description = description;
            entry.data.importance = importance;
            yield handlerDB.addObjectToDB(entry.data);
            yield this.reloadList();
        });
    }
    removeEntryByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handlerDB.removeObject(id);
            yield this.reloadList();
        });
    }
    removeAllEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            yield handlerDB.removeAllObject();
            yield this.reloadList();
        });
    }
    updateEntryFromEditPage(id, title, description, importance, isFinished) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handlerDB.updateObjectFromEditPage(id, title, description, importance);
            yield this.setFinishState(id, isFinished);
            yield this.reloadList();
        });
    }
    sortList() {
        const sortedOver = cookieHandler.getListSorted();
        this._listOfNodes.sort((a, b) => {
            let aValue;
            let bValue;
            switch (sortedOver) {
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
            if (aValue > bValue)
                return 1;
            if (aValue < bValue)
                return -1;
            return 0;
        });
        if (!cookieHandler.getIsASC())
            this._listOfNodes.reverse();
    }
    sortListOver(over) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortedOver = cookieHandler.getListSorted();
            let isASC = cookieHandler.getIsASC();
            if (sortedOver === over) // already sorting -> change direction
                isASC = !isASC;
            else {
                isASC = true;
                sortedOver = over;
            }
            cookieHandler.setSortingComplete(sortedOver, isASC);
            yield this.reloadList();
        });
    }
}
export const listController = new ListController();
