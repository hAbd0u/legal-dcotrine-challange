# Legal doctrine challenge
------------

This is a mini project as phase of the interview, you can read the project specs in the coding challenge PDF.

## Endpoints implemented
○ POST /text/                       Upload and store text with a unique Id to the database.

○ GET /text/                        Fetch list of text with the support of pagination.

○ PUT /text/:textId                 Update text content.

○ GET /text/:textId/count           Fetch total word number of given a text

○ GET /text/count/:lang             Fetch total word number based on given text for specific languages ex: fr, ar, en

○ GET /text/mostOccurrent           Get the most recurrent word in the whole text database

○ POST /text/search?q=johnDoe       Search functionalities


## API Documentation
You can read the documentation [here](http://127.0.0.1:8080/docs) after lunching the project from `CLI` or `docker-compose`.

Or you can compile it locally and open it directly via browser:
```
# First install apidoc
npm install -g apidoc

# Generate the docs
cd legal-doctrine-challenge/backend
apidoc -i src -o docs
```


## Requirements

Set the packages that your project may need.
 
- Node 14.0+.
- MongoDb server 5.0+.
- docker-compose.


## Installation

This project has two deployments type, development and production, you can change it by going to the file `backend/env` and changing the variable `DEPLOY` to either `prod` or `dev`.
```
git clone git@github.com:hAbd0u/legal-doctrine-challenge.git
cd legal-doctrine-challenge/backend
npm install
```

For development:
```
npm run dev
```
For production:
```
npm build
cd legal-doctrine-challenge/deploy
docker-compose up --remove-orphans
```

## Usage
You can address the API endpoints via: 
### Dev machine
```
http://127.0.0.1:8000/api/v1.0/
```

### Prod machine
```
http://127.0.0.1:8080/api/v1.0/
```


## TODO 

- [ ] Full coverage of unit testing.
- [ ] One environment file between `backend` and `deploy` folders.
- [ ] Demo database to test the production deployment.
- [ ] Logs system for issues and errors.
- [ ] Auto restart on crash.
- [ ] More errors checking.


## FAQ
To be updated ;).


## Issues
Please report all issues [here](https://github.com/hAbd0u/legal-dcotrine-challange/issues).

## Code of Conduct

This project has adopted the [Open Source Code of Conduct](https://opensource.guide/code-of-conduct/), for more information see the [Code of Conduct FAQ](https://opensource.guide/code-of-conduct/faq/).

## Authors and contributors
- [BELADEL ILYES ABDELRAZAK](https://github.com/hAbd0u)


## License

[![License](https://img.shields.io/badge/License-BSD%202--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)
