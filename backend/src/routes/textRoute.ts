import { Application, Request, Response } from "express";
import TextService from '../services/textService';
import IResponse from "../common/response.interface";

export default class TextRoute {
    private textService: TextService;

    constructor() {
        this.textService = new TextService();
    }

    route(app: Application) {
        app.get("/api/v1.0/text", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.findAll());
            res.status(result.status).send(result);
        });

        app.get("/api/v1.0/text/mostOccurent", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.getMostOccurentWord());
            res.status(result.status).send(result);
        });

        app.post("/api/v1.0/text", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.create(req));
            res.status(result.status).send(result);
        });

        app.post("/api/v1.0/text/search", async (req: Request, res: Response) => {
            const query = req.query.q;
            let result: IResponse = JSON.parse(await this.textService.search(query.toString()));
            res.status(result.status).send(result);
        });

        app.get("/api/v1.0/text/:id", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.findById(req.params.id));
            res.status(result.status).send(result);
        });

        app.patch("/api/v1.0/text/:id", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.update(req));
            res.status(result.status).send(result);
        });

        app.get("/api/v1.0/text/:id/count", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.getCountWords(req.params.id));
            res.status(result.status).send(result);
        });

        app.get("/api/v1.0/text/count/:lang", async (req: Request, res: Response) => {
            let result: IResponse = JSON.parse(await this.textService.getCountWordsByLang(Number.parseInt(req.params.lang)));
            res.status(result.status).send(result);
        });
    }
}