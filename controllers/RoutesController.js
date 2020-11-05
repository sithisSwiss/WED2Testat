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
import { listController } from "./ListController.js";
import { cookieHandler } from "../services/CookieHandler.js";
import { createDummyNode, giveStars, getArrow } from "../utils/minorFunctions.js";
import { webStyle } from "../views/styles.js";
export class RoutesController {
    constructor() {
        this._activeButton = {
            sortFinishedTime: false,
            sortCreatedTime: false,
            sortImportance: false,
            sortTitle: false,
            showFinished: true
        };
    }
    showHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield listController.reloadList();
            this.btnHandlerActive();
            res.render("home.hbs", {
                visualWeb: webStyle.getStyle(),
                btnObj: this._activeButton,
                ascArrow: getArrow(cookieHandler.getIsASC()),
                nodes: yield this.giveObjectForPrint()
            });
        });
    }
    giveObjectForPrint() {
        return __awaiter(this, void 0, void 0, function* () {
            const objArr = [];
            const showFinishedNode = cookieHandler.getShowFinished();
            yield listController.getListOfEntries().forEach((entry) => {
                if (showFinishedNode || !entry.data.isFinished)
                    objArr.push(entry.data);
            });
            const DATEOPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            objArr.forEach((item) => {
                item.importance = giveStars(item.importance); //Hack: number -> string
                if (item.finishedTime !== 0)
                    item.finishedTime = new Date(item.finishedTime).toLocaleDateString('de-DE', DATEOPTIONS); //Hack: number -> string
                else
                    item.finishedTime = "not yet finished"; //Hack: number -> string
                item.createdTime = new Date(item.createdTime).toLocaleDateString('de-DE', DATEOPTIONS); //Hack: number -> string
            });
            return objArr;
        });
    }
    showEdit(req, res, newNode = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let nodeInformationTemp;
            const entryObj = yield listController.getEntryByID(req.body.nodeId);
            if (newNode) {
                nodeInformationTemp = {
                    id: 0,
                    title: "",
                    description: "",
                    importance: 1
                };
            }
            else {
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
        });
    }
    pathToEditNodePage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (req.body.btn) {
                case "btn_createNewNode":
                    this.showEdit(req, res);
                    break;
                case "btn_editNode":
                    this.showEdit(req, res, false);
                    break;
                case "btn_changeFinished":
                    yield listController.changeFinishState(req.body.nodeId);
                    res.redirect('/');
                    break;
                default:
            }
        });
    }
    showDeleteMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const entryObj = yield listController.getEntryByID(req.body.nodeId);
            res.render("deleteNode.hbs", {
                visualWeb: webStyle.getStyle(),
                stars: giveStars(entryObj.importance),
                nodeInformation: entryObj
            });
        });
    }
    fromConfirmDeletePageToHome(req, res) {
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
    btnHandlerEditNode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (req.body.btn) {
                case "btn_saveNew":
                    yield listController.addNewEntry(req.body.title, req.body.description, parseInt(req.body.importance, 10));
                    break;
                case "btn_overrideNode":
                    yield listController.updateEntryFromEditPage(req.body.nodeId, req.body.title, req.body.description, parseInt(req.body.importance, 10), req.body.finishedState);
                    break;
                case "btn_deleteNode":
                    this.showDeleteMessage(req, res);
                    return;
                case "btn_saveCancel":
                    break;
                default:
            }
            this.showHome(req, res);
        });
    }
    btnHandlerHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (req.body.btn) {
                case "btn_sortFinishedTime":
                    yield listController.sortListOver(listController.sortingEnum.FinishedTime);
                    break;
                case "btn_sortCreatedTime":
                    yield listController.sortListOver(listController.sortingEnum.CreatedTime);
                    break;
                case "btn_sortImportance":
                    yield listController.sortListOver(listController.sortingEnum.Importance);
                    break;
                case "btn_sortTitle":
                    yield listController.sortListOver(listController.sortingEnum.Title);
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
                    yield createDummyNode();
                    break;
                case "btn_removeAll":
                    yield listController.removeAllEntries();
                    break;
                default:
                    break;
            }
            cookieHandler.updateCookies(res);
            res.redirect('/'); // prevention of POST
        });
    }
    btnHandlerActive() {
        Object.keys(this._activeButton).forEach((key) => {
            this._activeButton[key] = false;
        });
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
