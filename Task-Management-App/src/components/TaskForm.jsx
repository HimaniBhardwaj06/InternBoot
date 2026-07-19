import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function TaskForm({ onAddTask, initialData, buttonText = "Save Task" }) {

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Personal");
    const [priority, setPriority] = useState("Medium");
    const [deadline, setDeadline] = useState("");

    useEffect(() => {

        if (initialData) {
            setTitle(initialData.title);
            setCategory(initialData.category);
            setPriority(initialData.priority);
            setDeadline(initialData.deadline);
        }

    }, [initialData]);

    const handleSubmit = (e) => {

        e.preventDefault();

        const today = new Date().toISOString().split("T")[0];

        // Only validate when creating a new task
        if (!initialData && deadline < today) {

            toast.error("Deadline cannot be in the past.");

            return;

        }

        onAddTask({
            title,
            category,
            priority,
            deadline
        });

        if (!initialData) {

            setTitle("");
            setCategory("Personal");
            setPriority("Medium");
            setDeadline("");

        }

    };

    return (

        <form onSubmit={handleSubmit} className="space-y-4">

            <input
                type="text"
                placeholder="Task Title"
                className="w-full border p-3 rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <select
                className="w-full border p-3 rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option>Personal</option>
                <option>Study</option>
                <option>Work</option>
            </select>

            <select
                className="w-full border p-3 rounded-lg"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
            </select>

            <input
                type="date"
                className="w-full border p-3 rounded-lg"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={!initialData ? new Date().toISOString().split("T")[0] : undefined}
            />

            <button
                className="bg-blue-600 text-white px-5 py-3 rounded-lg w-full hover:bg-blue-700">

                {buttonText}

            </button>

        </form>

    );

}

export default TaskForm;