import Note from "../models/Note.js";

// export const getAllNotes = (req, res) => {
//     res.status(200).send("You just fetched the notes");
// };

//*or,
export async function getAllNotes(_, res) {
    try {
        const notes = await Note.find().sort({createdAt: -1}); //-1 means descending order
        res.status(200).json(notes);
        } catch(error) {
            console.error("Error in getAllNotes controller", error);
            res.status(500).json({message: "Internal server error"});
        }
    }

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message: "Note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}


export async function createNote(req, res) {
    try {
        const { title, content } = req.body;
        const note = new Note({title, content}); //this is creating a new note instance
        
        const savedNote= await note.save(); //this is saving the note to the database
        res.status(201).json(savedNote);
        } catch (error) { 
            console.error("Error in createNote controller", error);
            res.status(500).json({message: "Internal server error"});        
    }
}

export async function updateNote(req, res) {
    try {
        const {title,content} = req.body; //destructuring the title and content from the request body
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id, //id got from the url
            {title, content},//updating the content by id, .params.id gets the id from url we set up
            {
                new: true, //this option returns the modified document rather than the original
            }
        );
        if(!updatedNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json(updatedNote);

    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function deleteNote(req, res) {
   try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if(!deletedNote) return res.status(404).json({message: "Note not found"});
    res.status(200).json({message: "Note deleted successfully"}); //else part
   }catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message: "Internal server error"});
   }
}