import textFactory from "../models/textFactory";
import textRepository from "../models/textRepository";
import { Request } from "express";
import { ELanguage } from "../common/language.enum";
import { EStatus } from "../common/status.enum";
import IText from "../common/text.interface";

export default class TextService {
    private textRepo: textRepository;

    constructor() {
        this.textRepo = new textFactory().create();
    }
    
    /**
     * @api {get} /api/v1.0/text                Request for all available documents
     * @apiVersion 1.0.0
     * @apiName Get all texts
     * @apiGroup Grab document(s)
     *
     *
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {Object} description         Object of success. 
     * @apiSuccess {String} _id                 Document id. 
     * @apiSuccess {String} title               Document title. 
     * @apiSuccess {String} content             Document content. 
     * @apiSuccess {String} language            Document language [ 0: Arabic, 1: Frensh, 2: English ]. 
     * @apiSuccess {String} word_count          Total count of words. 
     * @apiSuccess {String} status              Status of document [ 0: Draft, 1: Submitted, 2: Rejected, 3: Approved ]. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Documents found",
     *          "details": {
     *              "description": [
     *                  {
     *                      "_id": "61ca0559d7d29ad7f7277711",
     *                      "title": "title",
     *                      "content": "content",
     *                      "language": 2,
     *                      "word_count": 7,
     *                      "status": 0
     *                  },
     *                  ...
     *              ]
     *          }
     *      }
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": {
     *              "description": "No documents present for now."
     *          }
     *      }
     */
    async findAll(): Promise<string> {
        let response: string = "";
        const textAll = await this.textRepo.findAll();
        if(textAll.length > 0) 
            response = `{
                "status": 200, 
                "success": "Documents found",
                "details": {
                    "description": ${JSON.stringify(textAll)}
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "No documents present for now."
                }
            }`;

        return response;
    }

    /**
     * @api {get} /api/v1.0/text:id             Request for a specific document
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Grab document(s)
     *
     *
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {Object} description         Object of success. 
     * @apiSuccess {String} _id                 Document id. 
     * @apiSuccess {String} title               Document title. 
     * @apiSuccess {String} content             Document content. 
     * @apiSuccess {String} language            Document language [ 0: Arabic, 1: Frensh, 2: English ]. 
     * @apiSuccess {String} word_count          Total count of words. 
     * @apiSuccess {String} status              Status of document [ 0: Draft, 1: Submitted, 2: Rejected, 3: Approved ]. 
     * @apiSuccess {String} id                  Document id searched for.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Document found",
     *          "details": {
     *              "description":  {
     *                      "_id": "61ca0559d7d29ad7f7277711",
     *                      "title": "title",
     *                      "content": "content",
     *                      "language": 2,
     *                      "word_count": 7,
     *                      "status": 0
     *                  },
     *              "id": "${id of document}"
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 400 Invalid Request
     *     {
     *          "status": 400, 
     *          "error": "Invalid request parameter.",
     *          "details": {
     *              "description": "The following errors are found: ..."
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 02:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": {
     *              "description": "Document not found.",
     *              "id": "${id of document}"
     *          }
     *      }
     */
    async findById(id: string): Promise<string> {
        let response: string = "";
        let requestMistakes: string = '';
        if(id.length != 24)
            requestMistakes += 'Invalid document id.';
            
        if(requestMistakes.length > 0) {
            return `{
                "status": 400, 
                "error": "Invalid request parameter.",
                "details": {
                    "description": "The following errors are found: ${requestMistakes}"
                }
            }`;
        }

        const text = await this.textRepo.findById(id);
        if(text.length > 0) 
            response = `{
                "status": 200, 
                "success": "Document found",
                "details": {
                    "description": ${text},
                    "id": "${id}"
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "Document not found",
                    "id": "${id}"
                }
            }`;

        return response;
    }
    
    /**
     * @api {post} /api/v1.0/text               Create a document
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Create
     *
     *
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {Object} description         Object of success. 
     * @apiSuccess {String} id                  Document id. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *          "status": 201,
     *          "success": "Document created",
     *          "details": {
     *              "description": "Document created with id: ${id of document}.",
     *              "id": "${id of document}"
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 400 Invalid Request
     *     {
     *          "status": 400, 
     *          "error": "Invalid request parameter.",
     *          "details": {
     *              "description": "The following fields are missing: ..."
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 02:
     *     HTTP/1.1 400 Invalid Request
     *     {
     *          "status": 400, 
     *          "error": "Invalid request body.",
     *          "details": {
     *              "description": "The following errors are found: ..."
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 03:
     *     HTTP/1.1 500 Invalid error
     *     {
     *          "status": 500, 
     *          "error": "Internal server error",
     *          "details": {
     *              "description": "Failed to create new document, please try after a while"
     *          }
     *     }
     */
    async create(req: Request): Promise<string> {
        let requestMistakes: string = '';
        if(req.body.hasOwnProperty('title') === false)
            requestMistakes += 'title, ';
        
        if(req.body.hasOwnProperty('content') === false)
            requestMistakes += 'content, ';
        
        if(req.body.hasOwnProperty('language') === false)
            requestMistakes += 'language, ';

        if(req.body.hasOwnProperty('status') === false)
            requestMistakes += 'status, ';

        if(requestMistakes.length > 0) {
            requestMistakes = requestMistakes.substring(0, requestMistakes.length - 2);
            return `{
                "status": 400, 
                "error": "Invalid request body",
                "details": {
                    "description": "The following fields are missing: ${requestMistakes}"
                }
            }`;
        }

        
        if(Object.values(ELanguage).includes(Number.parseInt(req.body.language)) === false)
            requestMistakes += 'Language must be of these values: 0: Arabic, 1: Frensh, 2: English.';

        if(Number.parseInt(req.body.status) !== EStatus.Draft)
            requestMistakes += "\n    " + 'Initiale text must be a draft status.';

        if(requestMistakes.length > 0) {
            return `{
                "status": 400, 
                "error": "Invalid request body",
                "details": {
                    "description": "The following errors are found: ${requestMistakes}"
                }
            }`;
        }

        let textNew: IText = {
            title: req.body.title,
            content: req.body.content,
            language: req.body.language,
            status: req.body.status,
            word_count: req.body.content.split(" ").length
        };
        const text = await this.textRepo.create(textNew);
        let response: string = '';
        if(text.length < 1)
            response = `{
                "status": 500, 
                "error": "Internal server error",
                "details": {
                    "description": "Failed to create new document, please try after a while."
                }
            }`;
        else
            response = `{
                "status": 201, 
                "success": "Document created",
                "details": {
                    "description": "Document created with id: ${text}.",
                    "id": "${text}"
                }
            }`;

        return response;
    }

    /**
     * @api {patch} /api/v1.0/text/:id          Update a document
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Update
     *
     * @apiBody {String} title                  Document title. 
     * @apiBody {String} content                Document content. 
     * @apiBody {String} language               Document language [ 0: Arabic, 1: Frensh, 2: English ]. 
     * @apiBody {String} word_count             Total count of words. 
     * @apiBody {String} status                 Status of document [ 0: Draft, 1: Submitted, 2: Rejected, 3: Approved ]. 
     * 
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {Object} description         Object of success. 
     * @apiSuccess {String} id                  Document id. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Document updated",
     *          "details": {
     *              "description": {
     *                      "_id": "61ca0559d7d29ad7f7277711",
     *                      "title": "title",
     *                      "content": "content",
     *                      "language": 2,
     *                      "word_count": 7,
     *                      "status": 0
     *              },
     *              "id": "${id of document}"
     *          }
     *     }
     * 
     *
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 400 Invalid Request
     *     {
     *          "status": 400, 
     *          "error": "Invalid request body/ parameter.",
     *          "details": {
     *              "description": "The following errors are found: ..."
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 02:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": {
     *              "description": "Document not found",
     *              "id": "${id of document}"
     *          }
     *      }
     */
    async update(req: Request): Promise<string> {
        let response: string = "";
        let requestMistakes: string = '';
        if(req.params.id.length != 24)
            requestMistakes += 'Invalid document id, ';

        if(req.body.hasOwnProperty('title') === false)
            requestMistakes += 'title, ';
        
        if(req.body.hasOwnProperty('content') === false)
            requestMistakes += 'content, ';
        
        if(req.body.hasOwnProperty('language') === false)
            requestMistakes += 'language, ';

        if(req.body.hasOwnProperty('status') === false)
            requestMistakes += 'status, ';

        if(Object.values(ELanguage).includes(Number.parseInt(req.body.language)) === false)
            requestMistakes += 'Language must be of these values [ 0: Arabic, 1: Frensh, 2: English ]';

        if(Object.values(EStatus).includes(Number.parseInt(req.body.status)) === false)
            requestMistakes += 'Status must be of these values [ 0: Draft, 1: Submitted, 2: Rejected, 3: Approved ]';

        if(requestMistakes.length > 0) {
            return `{
                "status": 400, 
                "error": "Invalid request body/ parameter",
                "details": {
                    "description": "The following errors are found: ${requestMistakes}"
                }
            }`;
        }

        let textUpdate: IText = {
            title: req.body.title,
            content: req.body.content,
            language: req.body.language,
            status: req.body.status,
            word_count: req.body.content.split(" ").length
        };

        const text = await this.textRepo.update(req.params.id, textUpdate);
        if(text.length > 0) 
            response = `{
                "status": 200, 
                "success": "Document updated",
                "details": {
                    "description": ${text},
                    "id": "${req.params.id}"
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "Document not found",
                    "id": "${req.params.id}"
                }
            }`;

        return response;
    }
    
    /**
     * @api {patch} /api/v1.0/text/:id/count    Get count of word of a document
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Count document
     *
     * 
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {String} description         Object of success. 
     * @apiSuccess {String} id                  Document id. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Document updated",
     *          "details": {
     *              "description": "Total of words: ${text}",
     *              "id": "${id of document}"
     *          }
     *     }
     * 
     *
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 400 Invalid Request
     *     {
     *          "status": 400, 
     *          "error": "Invalid request body/ parameter.",
     *          "details": {
     *              "description": "The following errors are found: ..."
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 02:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": "Document not found",
     *              "id": "${id of document}"
     *          }
     *      }
     */
    async getCountWords(id: string): Promise<string> {
        let response: string = "";
        let requestMistakes: string = '';
        if(id.length != 24)
            requestMistakes += 'Invalid document id.';
            
        if(requestMistakes.length > 0) {
            return `{
                "status": 400, 
                "error": "Invalid request parameter.",
                "details": {
                    "description": "The following errors are found: ${requestMistakes}"
                }
            }`;
        }

        const text = await this.textRepo.getCountWords(id);
        if(text > 0) 
            response = `{
                "status": 200, 
                "success": "Document found",
                "details": {
                    "description": "Total of words: ${text}",
                    "id": "${id}"
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "Document not found",
                    "id": "${id}"
                }
            }`;

        return response;
    }
    
    /**
     * @api {patch} /api/v1.0/text/count/:lang  Get count of words by a language
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Count language
     *
     * 
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {String} description         Description. 
     * @apiSuccess {String} language            Document language. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Document found",
     *          "details": {
     *              "description": "Total of words: ${text}",
     *              "language": "${language of document}"
     *          }
     *     }
     * 
     *
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 400 Invalid Request
     *     {
     *          "status": 400, 
     *          "error": "Invalid request parameter.",
     *          "details": {
     *              "description": "The following errors are found: ..."
     *          }
     *     }
     * 
     * @apiErrorExample Error-Response 02:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": "No document with such language",
     *              "language": "${language of document}"
     *          }
     *      }
     */
    async getCountWordsByLang(lang: number): Promise<string> {
        let response: string = "";
        let requestMistakes: string = '';

        if(Object.values(ELanguage).includes(lang) === false)
            requestMistakes += 'Language must be on of these values [ 0: Arabic, 1: Frensh, 2: English ]';
            
        if(requestMistakes.length > 0) {
            return `{
                "status": 400, 
                "error": "Invalid request parameter.",
                "details": {
                    "description": "The following errors are found: ${requestMistakes}"
                }
            }`;
        }

        const text = await this.textRepo.getCountWordsByLang(lang);
        if(text > 0) 
            response = `{
                "status": 200, 
                "success": "Document found",
                "details": {
                    "description": "Total of words: ${text}",
                    "language": "${Object.keys(ELanguage).find(k => ELanguage[k] === lang)}"
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "No document with such language.",
                    "language": "${Object.keys(ELanguage).find(k => ELanguage[k] === lang)}"
                }
            }`;

        return response;
    }
    
    /**
     * @api {patch} /api/v1.0/text/mostOccurent Get most occurent word
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Most occurent
     *
     * 
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {Object} description         Object of success. 
     * @apiSuccess {String} _id                 Document id. 
     * @apiSuccess {String} title               Document title. 
     * @apiSuccess {String} content             Document content. 
     * @apiSuccess {String} language            Document language [ 0: Arabic, 1: Frensh, 2: English ]. 
     * @apiSuccess {String} word_count          Total count of words. 
     * @apiSuccess {String} status              Status of document [ 0: Draft, 1: Submitted, 2: Rejected, 3: Approved ]. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Most occurent words",
     *          "details": {
     *              "description": [
     *                  {
     *                      "_id": "61ca0559d7d29ad7f7277711",
     *                      "title": "title",
     *                      "content": "content",
     *                      "language": 2,
     *                      "word_count": 7,
     *                      "status": 0
     *                  },
     *                  ...
     *              ]
     *          }
     *      }
     * 
     *
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": "No document with such language",
     *              "language": "${language of document}"
     *          }
     *     }
     * 
     */
    async getMostOccurentWord(): Promise<string> {
        let response: string = "";
        const textAll = await this.textRepo.getMostOccurentWord();
        if(textAll.length > 0) 
            response = `{
                "status": 200, 
                "success": "Most occurent words",
                "details": {
                    "description": ${textAll}
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "No documents present for now."
                }
            }`;

        return response;
    }
/**
     * @api {patch} /api/v1.0/text/search?q=    Search for a pattren
     * @apiVersion 1.0.0
     * @apiName text
     * @apiGroup Search
     *
     * 
     * @apiSuccess {String} status              Response status with success or error.
     * @apiSuccess {String} success             Description of that is successed of. 
     * @apiSuccess {Object} details             Object of success information.
     * @apiSuccess {Object} description         Object of success. 
     * @apiSuccess {String} _id                 Document id. 
     * @apiSuccess {String} title               Document title. 
     * @apiSuccess {String} content             Document content. 
     * @apiSuccess {String} language            Document language [ 0: Arabic, 1: Frensh, 2: English ]. 
     * @apiSuccess {String} word_count          Total count of words. 
     * @apiSuccess {String} status              Status of document [ 0: Draft, 1: Submitted, 2: Rejected, 3: Approved ]. 
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "status": 200,
     *          "success": "Documents found with the query you mentioned",
     *          "details": {
     *              "description": [
     *                  {
     *                      "_id": "61ca0559d7d29ad7f7277711",
     *                      "title": "title",
     *                      "content": "content",
     *                      "language": 2,
     *                      "word_count": 7,
     *                      "status": 0
     *                  },
     *                  ...
     *              ],
     *              "query", "${query}"
     *          }
     *      }
     * 
     *
     * 
     * @apiErrorExample Error-Response 01:
     *     HTTP/1.1 404 Not Found
     *     {
     *          "status": 404, 
     *          "success": "Document not found",
     *          "details": "No documents with the query you mentioned",
     *              "query": "${query}"
     *          }
     *     }
     * 
     */
    async search(query: string): Promise<string> {
        let response: string = "";
        const textAll = await this.textRepo.search(query);
        if(textAll.length > 0) 
            response = `{
                "status": 200, 
                "success": "Documents found with the query you mentioned",
                "details": {
                    "description": ${JSON.stringify(textAll)},
                    "query": "${query}"
                }
            }`;
        else
            response = `{
                "status": 404, 
                "success": "Document not found",
                "details": {
                    "description": "No documents with the query you mentioned.",
                    "query": "${query}"
                }
            }`;

        return response;
    }
}

//export default new TextService;