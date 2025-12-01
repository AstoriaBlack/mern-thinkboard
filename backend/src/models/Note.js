import mongoose from "mongoose";

//1- create a schema
//2-create a model based of that schema

const noteSchema = new mongoose.Schema(
    {
        title: {
            type:String,
            required:true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {timestamps: true} //createdAt, updateAt

);

//creating a model based off the schema
const Note = mongoose.model("Note", noteSchema);

export default Note;