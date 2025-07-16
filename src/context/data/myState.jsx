import React, { use, useEffect, useState } from 'react'
import MyContext from './myContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function MyState(props) {
//* Delete Note
const deleteNote = async (id)=>{
  const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/deletenote/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
     } 
  });
// response
const noteData = await res.json();
getAllNotes();
toast.success(noteData.success);


}


   //* Add Note state
   const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');

  //* Loading state
  const [loading, setLoading] = useState(false);

  //* get Notes
  const [allNotes, setAllNotes] = useState([]);
  
  //* Get All Notes Functions
    const getAllNotes = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
        const notesData = await res.json();
        //console.log(notesData)
        setAllNotes(notesData);
        
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
//add note
const addNote = async ()=>{
  const res= await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/notes/addnote`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token') 
  },
body: JSON.stringify({title, description, tag })

});
// response
const noteData = await res.json();

getAllNotes();
if(noteData.error){
  toast.error(noteData.error);
} else {
 navigate('/');
  toast.success("Note added successfully");     

}
    //* after submit data all fields empty
      setTitle("");
      setDescription("");
      setTag("");


}



  return (
       <MyContext.Provider value={{ deleteNote,title, setTitle, description, 
      setDescription, tag, setTag,
      addNote, getAllNotes,allNotes}} >
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState