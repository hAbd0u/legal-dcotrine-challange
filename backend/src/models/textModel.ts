import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
    /*
    _id: {
        type:mongoose.Schema.Types.ObjectId,
    },*/
    title: {
        type: String
    },
    content: {
        type: String
    }, 
    language: {
        type: Number
    },
    word_count: {
        type: Number
    },
    status: {
        type: Number
    },
}, { versionKey: false })

const textModel = mongoose.model('laws', textSchema);

export { textModel };