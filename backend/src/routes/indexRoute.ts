import { Application, Request, Response } from "express";

export default class IndexRoute {

    constructor() {
    }

    public route(app: Application) {
        app.get('/', async (req: Request, res: Response) => {
            res.status(200).send('Please use the v01 API, for more information read the documentation <a href="http://127.0.0.1:8080/docs/">here</a>.');
        });

        app.get('/api', async (req: Request, res: Response) => {
            res.status(200).send('Please use the v01 API, for more information read the documentation <a href="http://127.0.0.1:8080/docs/">here</a>.');
        });

        /*app.all('/api/^(v1.0)/*', async (req: Request, res: Response) => {
            res.status(404).send('Please use the v01 API, for more information read the documentation <a href="">here</a>.');
        });

        */
    }
}