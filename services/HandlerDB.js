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
// @ts-ignore
import Datastore from 'nedb-promise';
let dbRef;
export class HandlerDB {
    constructor() {
        this._myDb = new Datastore({ filename: './data/database.db', autoload: true });
        dbRef = this._myDb;
    }
    addObjectToDB(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDoc = yield this._myDb.insert(object);
            yield this._myDb.update({ _id: newDoc._id }, {
                $set: {
                    id: newDoc._id.toString()
                }
            }, { multi: false });
            newDoc.id = newDoc._id;
            return newDoc;
        });
    }
    removeObject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._myDb.remove({ _id: id }, {}); //Warnung muss sein!!!
            yield this._myDb.compactDatafile();
        });
    }
    updateObjectFromEditPage(id, title, description, importance) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._myDb.update({ _id: id }, {
                $set: {
                    "title": title,
                    "description": description,
                    "importance": importance,
                }
            }, { returnUpdatedDocs: false });
        });
    }
    updateFinishState(id, finishedTime, isFinished) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._myDb.update({ _id: id }, {
                $set: {
                    "finishedTime": finishedTime,
                    "isFinished": isFinished
                }
            }, { returnUpdatedDocs: false });
        });
    }
    getObjectFromDB(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._myDb.findOne({ _id: id });
        });
    }
    getAllObjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._myDb.find({});
        });
    }
    //Warnung muss sein!!!
    removeAllObject() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._myDb.remove({}, { multi: true });
        });
    }
}
export const handlerDB = new HandlerDB();
