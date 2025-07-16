import express from 'express';
import fetchUser from '../middleware/fetchUser.js';
import Notes from '../models/Notes.js';
const router= express.Router();

  router.get('/fetchallnotes', fetchUser, async (req,res)=>{
        try {
            const notes = await Notes.find({user: req.userId});
            res.json(notes);    
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Internal server error"});
        }
  } )

router.post('/addnote', fetchUser, async (req,res)=>{
   
    try {
         const {title, description, tag} = req.body;
         if(!title || !description || !tag  ){
            return res.status(400).json({error: "Please provide all required fields"});
         }

         const notes= new Notes({
            title,
            description,
            tag,
            user: req.userId ,
         });
         const savedNote = await notes.save();
         res.json(savedNote);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
} )
// update a note 
router.put('/updatenote/:id', fetchUser, async (req,res)=>{
    const {title, description, tag} = req.body;
    const {id}= req.params;
    try {
        let note=await Notes.findById(id);
        if (!note) {
            return res.status(404).send("Not Found")
        }

        if (note.user.toString() !==  req.userId ) {
            return res.status(401).send("Not Allowed");
        }
        console.log(note);
        const notes =await Notes.findByIdAndUpdate({_id: id},{
            $set:{
                title,
                description,
                tag
            }
        }, {new: true});

       res.json({ note: notes, success: "Note updated successfully" });
            
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
})

// delete a note
router.delete('/deletenote/:id', fetchUser, async (req, res)=>{
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.userId) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted", note: note });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
})
/// get note by id
router.get('/notes/:id', fetchUser, async (req,res)=>{
    const {id} = req.params;
    try {
        const note = await Notes.findById({_id:id});
        if(!note) {
            return res.status(404).json({error: "Note not found"});
        }
        return res.status(200).json(note);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
})



export default router;