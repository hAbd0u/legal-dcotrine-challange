import { textModel } from "../models/textModel";
import IText from "../common/text.interface";

export default class textFactory {

    async findAll(): Promise<string[]> {
        let textAll: string[] = await textModel.find();
        try {
            textAll = await textModel.find();
        } catch(err) {
            console.log('err: ', err);
            textAll = [];
        }
        return textAll;
    }
    
    async findById(id: string): Promise<string> {
        let text: string[] | string = [];
        try {
            text = await textModel.find({ "_id": id });
            if(text.length === 0)
                text = ""
            else 
                text = JSON.stringify(text[0]);
        } catch(err) {
            console.log('err: ', err);
            text = "";
        }

        return text.toString();
    }
    
    async create(textBody: IText): Promise<string> {
        let text: any = null;
        let result: string = '';
        try {
            text = await textModel.create({
                title: textBody.title,
                content: textBody.content,
                language: textBody.language,
                status: textBody.status,
                word_count: textBody.content.length
            });

            if(JSON.parse(JSON.stringify(text)).hasOwnProperty('_id'))
                result =  text._id;
        } catch(err) {
            console.log('err: ', err);
            result = "";
        }

        return result;
    }
    
    async update(id: string, textBody: IText): Promise<string> {
        let text: string = ""
        try {
            text = await textModel.findOneAndUpdate({ _id: id }, {
                title: textBody.title,
                content: textBody.content,
                language: textBody.language,
                status: textBody.status,
                word_count: textBody.content.length
            }, { new: true });

            if(text === null)
                text = ""
            else
                text = JSON.stringify(text)
        } catch(err) {
            console.log('err: ', err);
            text = "";
        }

        return text;
    }
    
    async getCountWords(id: string): Promise<number> {
        try {
            const result = await this.findById(id);
            if(result.length > 0) {
                const countWords = JSON.parse(result);
                return countWords.word_count;
            }

            return 0;
        } catch(err) {
            console.log(err);
        }

        return -1;
    }
    
    async getCountWordsByLang(lang: number): Promise<number> {
        let textAll: string[] | string = [];
        let totalWords: number = 0;
        try {
            textAll = await textModel.find({ "language": lang });
            if(textAll.length === 0)
                textAll = ""
            else {
                textAll.forEach(element => {
                    totalWords += Number.parseInt(JSON.parse(JSON.stringify(element)).word_count);
                });
            }
                
        } catch(err) {
            console.log('err: ', err);
            totalWords = 0;
        }

        return totalWords;
    }
    
    async getMostOccurentWord(): Promise<string> {
        let result: string = '';
        try {
            let words: string[] = [];
            let wordOccur: Map<string, number> = new Map();
            const textAll = await this.findAll();
            if(textAll.length < 1)
                return "";

            textAll.forEach(element => {
                words.push(...JSON.parse(JSON.stringify(element)).content.split(" "))
            });

            words.forEach(word => {
                if(wordOccur.get(word) !== undefined) 
                    wordOccur.set(word, wordOccur.get(word) + 1);
                else
                    wordOccur.set(word, 1);
            });

            let highestCount: number = [...wordOccur.values()].sort().reverse()[0];
            const highestCountWords = Object.entries(Object.fromEntries(wordOccur)).filter(([key, value]) => value === highestCount);
            result = JSON.stringify(highestCountWords);
        } catch(err) {
            console.log('err: ', err);
            result = "";
        }

        return result;
    }
    
    async search(query: string): Promise<string[]> {
        let textAll: string[] = [];
        try {
            //textAll = await textModel.find({ "content": { $regex: new RegExp("*" + query + "*") } });
            textAll = await textModel.find({ "content": { $regex: new RegExp(query,'g') } });
        } catch(err) {
            console.log('err: ', err);
            textAll = [];
        }

        return textAll;
    }
}