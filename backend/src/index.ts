import dotenv from 'dotenv';
import { App } from './app';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../', 'env')});

// App
let PORT: number = parseInt(process.env.BACKEND_PORT as string, 10) || 8888;
let backendEntryPoint: string = process.env.BACKEND_ENTRYPOINT || '/api/v1.0';
let dbDataSourceName: string = (process.env.DEPLOY === "prod") ? process.env.DATABASE_DSN : process.env.DATABASE_DSN_DEV;

let BackendApp: App = new App(backendEntryPoint);
(async() => await BackendApp.dbConnect(dbDataSourceName))();
BackendApp.app.listen(PORT, () => {
  console.log(`------------------------------------------`);
  console.log(`    \x17\u2592[server]\u2592\x17 running on port ${PORT}...`);
  console.log(`         API endpoint at ${backendEntryPoint}`);
  console.log(`         Waiting for new requests`);
  console.log(`------------------------------------------`);
});