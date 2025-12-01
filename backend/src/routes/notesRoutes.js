import express from "express";
import { createNote, deleteNote, getAllNotes, updateNote, getNoteById } from "../controllers/notesController.js";

const router = express.Router();

// router.get("/", (req, res) => {
// ?    since we are using middleware in server.js with /api/notes, here we just need "/"
//     res.status(200).send("You just fetched the notes");
// });

router.get("/", getAllNotes);

router.get("/:id", getNoteById);

router.post("/", createNote);

router.put("/:id", updateNote); 

router.delete("/:id", deleteNote);

export default router;