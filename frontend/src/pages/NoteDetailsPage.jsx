import {useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router"
import api from "../lib/axios.js"
import toast from "react-hot-toast"
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react"

const NoteDetailsPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  
  //?how to get the id from the url we put on App.jsx
  //we can use the useParams hook from react-router

  const { id } = useParams();
  // console.log({id}); <-- good way to console log an object to see the key and value. just wrap it like this

  //whenevr the id changds, we want to fetch the note details again
  //we use a useEffect for that
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error fetching note details:", error);
        toast.error("Failed to fetch note details.");        
      } finally {
        setLoading(false);//what is setting loading to false here?
        //bc, whether the fetch is successful or fails, we want to stop showing the loading state
      }
    };

    fetchNote();
  }, [id]);
  //?what is the dependency array for here?
  //so that whenever the id changes, the useEffect runs again to fetch the new note details
  //this is useful if the component stays mounted and the id changes (like navigating to a different note)
  //?in here, can u only have an array of dependencies?
  //yes, the dependency array is specifically for listing dependencies that the useEffect relies on
  //it tells React to re-run the effect whenever any of the dependencies change
  //?is that why we only use an array and not an object or other data structures?
  //yes, exactly. The dependency array is designed to be a simple list of values that React can easily compare
  //using an object or other data structures would complicate the comparison process and could lead to unexpected behavior

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error deleting note:", error);
      toast.error("Failed to delete the note");      
    }
  };
  const handleSave = async () => {
    if(!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);//set saving state to true when we start saving

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully!");
      navigate("/");//navigate back to homepage after saving
    } catch (error) {
      console.log("Error saving note:", error);
      toast.error("Failed to update the note");
    } finally {
      setSaving(false);//reset saving state after saving is done
    }
  };
  
  //loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
             <Link to="/" className="btn btn-ghost btn-secondary mb-6">
             <ArrowLeftIcon className="h-5 w-5"/>
             Back to Notes
             </Link>
             <button onClick={handleDelete} 
                     className="btn btn-error btn-outline">
                     <Trash2Icon className="h-5 w-5 "/>
                     Delete Note
             </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text mb-2">Title</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Your title"
                  className="input input-bordered w-full" 
                  value={note.title} 
                  //so here what happens is when u type, it will only update the title
                  onChange={(e) => setNote({...note, title: e.target.value})}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text mb-2">Content</span>
                </label>
                <textarea 
                  placeholder="Write your note here..." 
                  className="textarea textarea-bordered h-32 w-full" 
                  value={note.content} 
                  //so here what happens is when u type, it will only update the title
                  onChange={(e) => setNote({...note, content: e.target.value})}
                />
              </div>

              <div className="card-actions mt-8">
                <button className="btn btn-primary btn-lg w-full"
                        disabled={saving} onClick={handleSave}>
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetailsPage