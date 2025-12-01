import React, { useState,useEffect } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI.jsx'
import NoteCard from '../components/NoteCard.jsx'
import NotesNotFound from '../components/NotesNotFound.jsx'
import api from '../lib/axios.js';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
        try {
            // const res = await fetch("http://localhost:5001/api/notes");
            // const data = await res.json();
            //?if u were to use fetch, this is how u do it but we gonna use axios
            const res = await api.get("/notes");

            // console.log(data); -->use if u use fetch
            console.log(res.data);// -->use if u use axios we r just printing to see if it worked
            setNotes(res.data);
            setIsRateLimited(false);//resetting rate limit state if successful
        } catch (error) {
            console.log(error);
            if(error.response?.status ===429){
                setIsRateLimited(true);//set rate limit state to true since we got a 429 error
            } else {
                toast.error("Failed to fetch notes");
            }
        } finally {
                setLoading(false);
        }
        //TODO so here u get a CORS error (user origin resource sharing)
        //?what is CORS?
        //CORS is a browser security rule
        //when a website tries to get data from another website-
        //like the frontend calling an API on a different domain,
        //the browser might block it for security reasons

        //so like localhost:3000 fetching from example.com/api, the browser
        //need to make sure the API allows that request
        //so install a package called cors on the backend
        //and then use it as a middleware in the backend server file
        //like app.use(cors());
        //this tells the browser it's okay to accept requests from other origins
    };
    fetchNotes();
  },[]);

  return (
    <div className='min-h-screen'>
        <Navbar />
        {isRateLimited && <RateLimitedUI />} {/* Show rate limit UI if rate limited */}
        
        <div className='max-w-7xl mx-auto p-4 mt-6'>
            {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}

            {notes.length === 0 && !isRateLimited && <NotesNotFound />}
            {/* showing notes grid after checking if its loaded, has the notes and ratelimited */}
            {notes.length >0 && !isRateLimited && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {notes.map((note) => (
                        <NoteCard key={note._id} note={note} setNotes={setNotes}/> //in notecard we r passing note as a prop
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default HomePage