import api from "../lib/axios.js";
import { ArrowLeftIcon } from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";


const CreatePage = () => {
    //a state to keep a track on input fields
    const [title, setTitle] = useState(""); 
    const [content, setContent] = useState("");

    const [loading,setLoading] = useState(false);
    //laoding state to manage the submit button state

    const navigate = useNavigate();
    //useNavigate hook to navigate the user after successful note creation

    const handleSubmit = async (e) => {
        e.preventDefault();
        // this prevents the default behavior of form submission which is to reload the page

        if (!title.trim() || !content.trim()) {
            //  trim() method removes whitespace from both ends of a string
            toast.error("All fields are required!");
            return;
        }

        //?why does this custom validation is necessary when we can do 500 internal server error when creating a note?
        //(what i mean is the catch block)
        //bc, this validation is client side, so the console does not have any errors
        //if a client tries to submit an empty form, this validation will catch it before sending a request to the server
        //it is a good practice to hide the sensitive server errors from the client side
        //so even if some errors may inevitably handled by the server, we provide a better user experience by validating inputs on the client side first

        setLoading (true);
        try {
            await api.post("/notes", {
                title,
                content
            })
            toast.success("Note created successfully!");
            navigate("/")
        } catch (error) {
            console.log("Error creating note:", error);
            if (error.response.status === 429) {
                toast.error("Slow down! You're creating too fast", {
                    //we are setting a custom icon and duration for this toast notification
                    duration: 4000, 
                    //this is we are setting the duration of the toast to 4 seconds
                    icon: '💀',
                });
            } else {
                toast.error("Failed to create note. Please try again!");
            }                 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Link to={"/"} className="btn btn-ghost btn-secondary mb-6">
                    <ArrowLeftIcon  className="size-5 "/>
                    Back to Notes
                    </Link>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-3xl mb-8 text-primary">Create New Note</h2>
                            <form onSubmit={handleSubmit} className="space-y-6"> 
                                {/* Title Field */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base font-semibold">Title</span>
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="Enter your note title..."
                                        className="input input-bordered w-full input-lg focus:input-primary"
                                        value={title}
                                        onChange={(e)=> setTitle(e.target.value)}
                                       
                                    />
                                </div>

                                {/* Content Field */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base font-semibold">Content</span>
                                    </label>
                                    <textarea
                                        placeholder="Write your note content here..."
                                        className="textarea textarea-bordered w-full h-40 text-base focus:textarea-primary"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        // required--> in here we don't use HTML% validation (which is what we call required) bc we wanna use toast notifications and handling the validation manually
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="card-action mt-8">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg w-full"
                                        disabled={loading}
                                    >
                                    {/* disabled = {loading means the button is disabled when loading is true} */}
                                        {loading ? "Creating..." : "Create Note"} 
                                        {/* what this means is when loading is true the button will show "Creating..." otherwise it will show "Create Note" */}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    
}

export default CreatePage;