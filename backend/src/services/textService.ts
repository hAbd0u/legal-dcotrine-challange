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