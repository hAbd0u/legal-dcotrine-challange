import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

import IndexRoute  from './routes/indexRoute';
import TextRoute from './routes/textRoute';


export class App {
    private apiUrl: string = '';
    public app: express.Application;
    private indexRoute: IndexRoute;
    private textRoute: TextRoute;


    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.app = express();
        this.appMiddlewares();
        this.appRoutes();
    }

    private appMiddlewares(): void {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(this.apiUrl, (req: express.Request, res: express.Response, next: express.NextFunction) => {
            if(!req.is('application/json')) {
                res.status(406).json({
                    'error': 'Invalid header content type',
                    'details': {
                        'description': 'Content type is not set in the request header.'
                    },
                    'request_time': Date.now()
                })
                return;
            }
            
            next();
        });

        //this.app.use(this.apiUrl + '/', this.app.router());
    }

    private appRoutes(): void {
        this.indexRoute = new IndexRoute();
        this.indexRoute.route(this.app);
        
        this.textRoute = new TextRoute();
        this.textRoute.route(this.app);
    }

    public async dbConnect(dataSourceName: string): Promise<void> {
        try {
            await mongoose.connect(dataSourceName);
            console.log(`Connecting to database at ${dataSourceName}`);
        }
        catch (err) {
            console.log(`Failed to connect to db using DSN provided.
                DSN: ${dataSourceName}.
                Error details: ${err}.`)
        }
    }
}