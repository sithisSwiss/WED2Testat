"use strict";
import {listController} from "./ListController.js";
import {cookieHandler} from "../services/CookieHandler.js";
import {createDummyNode, giveStars, getArrow} from "../utils/minorFunctions.js";
import {webStyle} from "../views/styles.js";
import {ObjectEntry, entryObjectType} from "../model/ObjectEntry.js";
// @ts-ignore
import {Request} from 'express';


interface MyRequest extends Request{
    body: {nodeId: string, btn: string, title: string, description: string, importance: string, finishedState: boolean};
}
export class RoutesController {
    private _activeButton : { sortImportance: boolean; sortTitle: boolean; sortFinishedTime: boolean; sortCreatedTime: boolean; showFinished: boolean } = {
        sortFinishedTime: false,
        sortCreatedTime: false,
        sortImportance: false,
        sortTitle: false,
        showFinished: true
    };

    async showHome(req : any, res : any) {
        await listController.reloadList();
        this.btnHandlerActive();
        res.render("home.hbs", {
            visualWeb: webStyle.getStyle(),
            btnObj: this._activeButton,
            ascArrow: getArrow(cookieHandler.getIsASC()),
            nodes: await this.giveObjectForPrint()
            });
    }

    async giveObjectForPrint() {
        const objArr : entryObjectType[] = [];
        const showFinishedNode :boolean = cookieHandler.getShowFinished();
        await listController.getListOfEntries().forEach((entry: ObjectEntry ) => {
            if (showFinishedNode || !entry.data.isFinished)
                objArr.push(entry.data);
        });

        const DATEOPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        objArr.forEach((item : any) => {
            item.importance = giveStars(item.importance); //Hack: number -> string
            if(item.finishedTime !== 0)
                item.finishedTime = new Date(item.finishedTime).toLocaleDateString('de-DE', DATEOPTIONS); //Hack: number -> string
            else
                item.finishedTime = "not yet finished"; //Hack: number -> string
            item.createdTime = new Date(item.createdTime).toLocaleDateString('de-DE', DATEOPTIONS); //Hack: number -> string
        });
        return objArr;
    }

    async showEdit(req: MyRequest, res: any, newNode: boolean = true) {
        let nodeInformationTemp;
        const entryObj: entryObjectType = await listController.getEntryByID(req.body.nodeId);
        if (newNode) {
            nodeInformationTemp = {
                id: 0,
                title: "",
                description: "",
                importance: 1
            };
        } else {
            nodeInformationTemp = {
                id: req.body.nodeId,
                title: entryObj.title,
                description: entryObj.description,
                importance: entryObj.importance,
                isFinished: entryObj.isFinished
            };
        }
        res.render("editNode.hbs", {
            visualWeb: webStyle.getStyle(),
            stars: {
                one: giveStars(1),
                two: giveStars(2),
                three: giveStars(3),
                four: giveStars(4),
                five: giveStars(5)
            },
            nodeInformation: nodeInformationTemp,
            createANewNode: newNode
        });
    }

    async pathToEditNodePage(req : MyRequest, res : any) {
        switch (req.body.btn) {
            case "btn_createNewNode":
                this.showEdit(req, res);
                break;
            case "btn_editNode":
                this.showEdit(req, res, false);
                break;
            case "btn_changeFinished":
                await listController.changeFinishState(req.body.nodeId);
                res.redirect('/');
                break;
            default:
        }
    }

    async showDeleteMessage(req: MyRequest, res: any) {
        const entryObj: entryObjectType = await listController.getEntryByID(req.body.nodeId);
        res.render("deleteNode.hbs", {
            visualWeb: webStyle.getStyle(),
            stars: giveStars(entryObj.importance),
            nodeInformation: entryObj
        });
    }

    fromConfirmDeletePageToHome(req : MyRequest, res : any) {
        switch (req.body.btn) {
            case "btn_yes":
                listController.removeEntryByID(req.body.nodeId);
                res.redirect('/');
                break;
            case "btn_no":
            default:
                res.redirect('/');
        }
    }

    async btnHandlerEditNode(req : MyRequest, res : any) {
        switch (req.body.btn) {
            case "btn_saveNew":
                await listController.addNewEntry(req.body.title, req.body.description, parseInt(req.body.importance, 10));
                break;
            case "btn_overrideNode":
                await listController.updateEntryFromEditPage(req.body.nodeId, req.body.title, req.body.description, parseInt(req.body.importance,10), req.body.finishedState);
                break;
            case "btn_deleteNode":
                this.showDeleteMessage(req, res);
                return;
            case "btn_saveCancel":
                break;
            default:
        }
        this.showHome(req, res);
    }

    async btnHandlerHome(req : MyRequest, res : any) {
        switch (req.body.btn) {
            case "btn_sortFinishedTime":
                await listController.sortListOver(listController.sortingEnum.FinishedTime);
                break;
            case "btn_sortCreatedTime":
                await listController.sortListOver(listController.sortingEnum.CreatedTime);
                break;
            case "btn_sortImportance":
                await listController.sortListOver(listController.sortingEnum.Importance);
                break;
            case "btn_sortTitle":
                await listController.sortListOver(listController.sortingEnum.Title);
                break;
            case "btn_showFinished":
                cookieHandler.setShowFinished(!cookieHandler.getShowFinished());
                break;
            case "btn_changeStyle":
                webStyle.nextStyle();
                break;
            case "btn_refresh":
                break;
            case "btn_addDummy":
                await createDummyNode();
                break;
            case "btn_removeAll":
                await listController.removeAllEntries();
                break;
            default:
                break;
        }
        cookieHandler.updateCookies(res);
        res.redirect('/'); // prevention of POST
    }

    btnHandlerActive() {

        Object.keys(this._activeButton).forEach((key) => {// @ts-ignore
            this._activeButton[key] = false});
        switch (cookieHandler.getListSorted()) {
            case listController.sortingEnum.FinishedTime:
                this._activeButton.sortFinishedTime = true;
                break;
            case listController.sortingEnum.CreatedTime:
                this._activeButton.sortCreatedTime = true;
                break;
            case listController.sortingEnum.Importance:
                this._activeButton.sortImportance = true;
                break;
            case listController.sortingEnum.Title:
                this._activeButton.sortTitle = true;
                break;
            default:
        }
        this._activeButton.showFinished = cookieHandler.getShowFinished();
    }
}


export const routesController = new RoutesController();