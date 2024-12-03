import express from 'express';
import { create, deleteChapter, findChaptersByBook, update } from '../controller/chapterController.js';

const route = express.Router();

route.post("/create", create);
route.get("/book=:id", findChaptersByBook);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteChapter);

export default route;