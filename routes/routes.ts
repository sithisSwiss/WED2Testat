"use strict";
// @ts-ignore
import express from 'express';
import {routesController} from "../controllers/RoutesController.js";
import {cookieHandler} from "../services/CookieHandler.js";

const router = express.Router();
router.all('/*', function (req : any, res : any, next : any) {
    req.app.locals.layout = 'layout';
    cookieHandler.readCookies(req);
    next();
});


router.get('/',  routesController.showHome.bind(routesController));
router.post('/',  routesController.btnHandlerHome.bind(routesController));
router.post('/deletedNode',  routesController.fromConfirmDeletePageToHome.bind(routesController));
router.post('/editNode', routesController.pathToEditNodePage.bind(routesController));
router.post('/saveNode', routesController.btnHandlerEditNode.bind(routesController));

router.all('/*', (req : any, res : any, next : any)=>{
    res.redirect('/');
    next();
});

export const routes = router;
