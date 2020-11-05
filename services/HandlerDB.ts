"use strict";
// @ts-ignore
import Datastore from 'nedb-promise';
import {entryObjectType} from "../model/ObjectEntry.js";

let dbRef : any;
export class HandlerDB {
    private readonly _myDb;

    constructor() {
        this._myDb = new Datastore({filename: './data/database.db', autoload: true});
        dbRef = this._myDb;
    }
    async addObjectToDB(object : entryObjectType) {
        const newDoc = await this._myDb.insert(object);
        await this._myDb.update(
                {_id: newDoc._id},
                {
                    $set: {
                        id: newDoc._id.toString()
                    }
                },
                {multi: false});
        newDoc.id = newDoc._id;
        return newDoc;
    }

    async removeObject(id : string) {
        await this._myDb.remove({_id: id}, {}); //Warnung muss sein!!!
        await this._myDb.compactDatafile();
    }

    async updateObjectFromEditPage(id : string, title : string, description : string, importance : number) {
        await this._myDb.update({_id: id}, {
            $set: {
                "title": title,
                "description": description,
                "importance": importance,

            }
        }, {returnUpdatedDocs: false});
    }

    async updateFinishState(id : string, finishedTime : number, isFinished : boolean) {
        await this._myDb.update({_id: id}, {
            $set: {
                "finishedTime": finishedTime,
                "isFinished": isFinished
            }
        }, {returnUpdatedDocs: false});
    }

    async getObjectFromDB(id : string) {
        return  await this._myDb.findOne({_id: id});
    }

    async getAllObjects() {
        return await this._myDb.find({});
    }

    //Warnung muss sein!!!
    async removeAllObject() {
        await this._myDb.remove({}, {multi: true});
    }
}


export const handlerDB = new HandlerDB();