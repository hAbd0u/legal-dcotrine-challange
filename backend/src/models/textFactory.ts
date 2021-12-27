import textRepository from "../models/textRepository";

export default class textFactory {

    create(): textRepository {
        return new textRepository();
    }
}