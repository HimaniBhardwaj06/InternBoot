import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TaskForm from "../components/TaskForm";
import { useEffect } from "react";
import TaskCard from "../components/TaskCard";
import {addTask, getTasks, deleteTask, updateTask, toggleTaskCompletion} from "../services/taskService";
import toast from "react-hot-toast";
import { auth } from "../firebase/firebase";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";


function Dashboard() {

    const navigate = useNavigate();
    const user = auth.currentUser;
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    const handleAddTask = async (task) => {

        try {

            await addTask({...task, completed: false});
            await loadTasks();

            toast.success("Task added successfully!");

            setShowForm(false);

        } catch (error) {

            console.error(error);

            toast.error("Failed to add task.");

        }

    };

    const handleUpdateTask = async (updatedTask) => {

        try {

            await updateTask(editingTask.id, updatedTask);

            await loadTasks();

            toast.success("Task updated successfully!");

            setEditingTask(null);

            setShowForm(false);

        } catch (error) {

            console.error(error);

            toast.error("Failed to update task.");

        }

    };

    const handleToggleComplete = async (task) => {

        try {

            await toggleTaskCompletion(task.id, task.completed);

            if (!task.completed) {
                launchConfetti();
            }

            await loadTasks();

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete task.");

        }

    };

    const loadTasks = async () => {

        const data = await getTasks();

        setTasks(data);

    };

    useEffect(() => {

        loadTasks();

    }, []);

    useEffect(() => {

        if (darkMode) {

            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");

        } else {

            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");

        }

    }, [darkMode]);

    

    const launchConfetti = () => {

        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 1000,
        };

        let interval = setInterval(() => {

            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            confetti({
                ...defaults,
                particleCount: 50 * (timeLeft / duration),
                origin: {
                    x: Math.random() * 0.6 + 0.2,
                    y: Math.random() - 0.2,
                },
            });

        }, 250);

    };

    const handleLogout = async () => {

        await logoutUser();

        navigate("/");

    };

    const handleDeleteTask = async (id) => {

        const result = await Swal.fire({
            title: "Delete Task?",
            text: "You won't be able to recover this task.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {

            await deleteTask(id);

            await loadTasks();

            toast.success("Task deleted successfully!");

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete task.");

        }

    };

    const filteredTasks = tasks
        .filter((task) => {

            const matchesCategory =
                categoryFilter === "All" ||
                task.category === categoryFilter;

            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;

        })
        .sort((a, b) => {

            const today = new Date().toISOString().split("T")[0];

            // Completed tasks always at the bottom
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            // Overdue tasks first
            const aOverdue = a.deadline < today;
            const bOverdue = b.deadline < today;

            if (aOverdue !== bOverdue) {
                return aOverdue ? -1 : 1;
            }

            // Due today next
            const aToday = a.deadline === today;
            const bToday = b.deadline === today;

            if (aToday !== bToday) {
                return aToday ? -1 : 1;
            }

            // Upcoming tasks sorted by nearest date
            return new Date(a.deadline) - new Date(b.deadline);

        });




    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = tasks.filter(
        (task) => !task.completed
    ).length;

    const highPriorityTasks = tasks.filter(
        (task) => task.priority === "High"
    ).length;

    const today = new Date().toISOString().split("T")[0];

    const todaysTasks = tasks.filter(
        (task) =>
            task.deadline === today &&
            !task.completed
    );

    const overdueTasks = tasks.filter(
        (task) =>
            task.deadline < today &&
            !task.completed
    );

    useEffect(() => {

        if (!("Notification" in window)) return;

        Notification.requestPermission().then((permission) => {

            if (
                permission === "granted" &&
                todaysTasks.length > 0
            ) {

                new Notification("📋 Task Reminder", {

                    body: `You have ${todaysTasks.length} task(s) due today!`,

                    icon: "/vite.svg"

                });

            }

        });

    }, [todaysTasks.length]);

    const getOverdueDays = (deadline) => {

        const today = new Date();

        const dueDate = new Date(deadline);

        const difference = today - dueDate;

        return Math.floor(difference / (1000 * 60 * 60 * 24));

    };

    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    return (

        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">

            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-8 py-6">

                    <div className="text-center md:text-left">

                        <h1 className="text-3xl font-bold">

                            👋 Welcome Back!

                        </h1>

                        <p className="text-slate-300 mt-1">

                            {user?.email}

                        </p>

                        <p className="text-slate-400 text-sm mt-1">

                            Have a productive day 🚀

                        </p>

                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <button onClick={() => setDarkMode(!darkMode)}
                            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition">
                            {darkMode ? "☀️ Light" : "🌙 Dark"}
                        </button>

                        <button onClick={handleLogout}
                            className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-200 px-5 py-2 rounded-xl font-semibold shadow transition">
                            Logout
                        </button>

                    </div>

                </div>

            </div>

            <div className="max-w-6xl mx-auto mt-6 md:mt-10 px-4">

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 md:p-8 transition-colors duration-300">

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">
                        📋 My Tasks
                    </h2>

                    <div
                        className={`mb-8 rounded-2xl shadow-md p-6 transition-all duration-300 ${
                            todaysTasks.length > 0
                                ? "bg-yellow-50 border border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
                                : "bg-green-50 border border-green-300 dark:bg-green-900/20 dark:border-green-700"
                        }`}
                    >

                        {todaysTasks.length > 0 ? (

                            <>
                                <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300">

                                    🔔 Today's Reminder

                                </h3>

                                <p className="mt-2 text-gray-700 dark:text-gray-300">

                                    You have <strong>{todaysTasks.length}</strong> task{todaysTasks.length > 1 ? "s" : ""} due today.

                                </p>

                                <div className="mt-4 space-y-2">

                                    {todaysTasks.map((task) => (

                                        <div
                                            key={task.id}
                                            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow flex flex-col sm:flex-row 
                                                        justify-between items-start sm:items-center gap-3"
                                        >

                                            <div>

                                                <h4 className="font-semibold text-slate-800 dark:text-white">

                                                    📋 {task.title}

                                                </h4>

                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">

                                                    🕒 Due Today

                                                </p>

                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                                                    task.priority === "High"
                                                        ? "bg-red-500"
                                                        : task.priority === "Medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                }`}
                                            >

                                                {task.priority}

                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </>

                        ) : (

                            <>
                                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">

                                    🎉 Great News!

                                </h3>

                                <p className="mt-2 text-gray-700 dark:text-gray-300">

                                    No tasks are due today.

                                </p>

                            </>

                        )}

                    </div>

                    

                        {overdueTasks.length > 0 && (

                        <div className="mb-8 rounded-2xl shadow-md p-6 bg-red-50 border border-red-300 dark:bg-red-900/20 dark:border-red-700">

                            <h3 className="text-xl font-bold text-red-700 dark:text-red-300">

                                ⚠ Needs Attention

                            </h3>

                            <p className="mt-2 text-gray-700 dark:text-gray-300">

                                You have <strong>{overdueTasks.length}</strong> overdue task{overdueTasks.length > 1 ? "s" : ""}.

                            </p>

                            <div className="mt-4 space-y-3">

                                {overdueTasks.map((task) => (

                                    <div
                                        key={task.id}
                                        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow flex flex-col sm:flex-row 
                                                    justify-between items-start sm:items-center gap-3"
                                    >

                                        <div>

                                            <h4 className="font-semibold text-slate-800 dark:text-white">

                                                📋 {task.title}

                                            </h4>

                                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">

                                                ❌ Overdue by {getOverdueDays(task.deadline)} {getOverdueDays(task.deadline) === 1 ? "day" : "days"}

                                            </p>

                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                                                task.priority === "High"
                                                    ? "bg-red-500"
                                                    : task.priority === "Medium"
                                                    ? "bg-yellow-500"
                                                    : "bg-green-500"
                                            }`}
                                        >

                                            {task.priority}

                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                        )}


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                        <div className="bg-blue-100 dark:bg-blue-900 rounded-2xl p-5 text-center shadow-md hover:shadow-xl 
                                        transition-all duration-300">

                            <h3 className="text-gray-600 dark:text-gray-300 text-sm">
                                Total Tasks
                            </h3>

                            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">

                                {totalTasks}

                            </p>

                        </div>

                        <div className="bg-green-100 dark:bg-green-900 rounded-xl p-4 text-center shadow">

                            <h3 className="text-gray-600 dark:text-gray-300 text-sm">
                                ✅ Completed
                            </h3>

                            <p className="text-3xl font-bold text-green-700 dark:text-green-300">

                                {completedTasks}

                            </p>

                        </div>

                        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-xl p-4 text-center shadow">

                            <h3 className="text-gray-600 dark:text-gray-300 text-sm">

                                Pending

                            </h3>

                            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">

                                {pendingTasks}

                            </p>

                        </div>

                        <div className="bg-red-100 dark:bg-red-900 rounded-xl p-4 text-center shadow">

                            <h3 className="text-gray-600 dark:text-gray-300 text-sm">

                                High Priority

                            </h3>

                            <p className="text-3xl font-bold text-red-700 dark:text-red-300">

                                {highPriorityTasks}

                            </p>

                        </div>

                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-8 transition-colors">

                        <div className="flex justify-between mb-3">

                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">

                                📈 Task Progress

                            </h3>

                            <span
                                className={`font-bold ${
                                    completionPercentage <= 30
                                        ? "text-red-500"
                                        : completionPercentage <= 70
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                }`}
                            >
                                {completionPercentage}%
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">

                            <div
                                className={`h-4 rounded-full transition-all duration-700 ${
                                    completionPercentage <= 30
                                        ? "bg-red-500"
                                        : completionPercentage <= 70
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`}
                                style={{
                                    width: `${completionPercentage}%`,
                                }}>

                            </div>

                        </div>

                        <p className="mt-3 text-gray-600 dark:text-gray-300">

                            {completedTasks} of {totalTasks} tasks completed

                            {completionPercentage === 100 && (
                                <span className="ml-2 text-green-600 font-semibold">
                                    🎉 Great job!
                                </span>
                            )}

                        </p>

                    </div>

                    <input
                        type="text"
                        placeholder="🔍 Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black 
                                 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 rounded-xl p-3 mb-6 shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />

                    <button
                        onClick={() => {

                            if (showForm) {

                                setShowForm(false);

                                setEditingTask(null);

                            } else {

                                setEditingTask(null);

                                setShowForm(true);

                            }

                        }}
                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 
                                    hover:shadow-lg transition duration-300">

                        {showForm ? "Close Form" : "+ Add Task"}

                    </button>

                    <div className="flex flex-wrap gap-3 mt-6">

                        <button onClick={() => setCategoryFilter("All")}
                            className={`px-4 py-2 rounded-lg transition ${
                                categoryFilter === "All" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700 dark:text-white"}`}>
                            All
                        </button>

                        <button onClick={() => setCategoryFilter("Personal")}
                            className={`px-4 py-2 rounded-lg transition ${
                                categoryFilter === "Personal" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700 dark:text-white"}`}>
                            Personal
                        </button>

                        <button onClick={() => setCategoryFilter("Study")}
                            className={`px-4 py-2 rounded-lg transition ${
                                categoryFilter === "Study" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700 dark:text-white"}`}>
                            Study
                        </button>

                        <button onClick={() => setCategoryFilter("Work")}
                            className={`px-4 py-2 rounded-lg transition ${
                                categoryFilter === "Work" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-slate-700 dark:text-white"}`}>
                            Work
                        </button>

                    </div>

                    <div className="mt-8">

                        {showForm && (
                            <TaskForm initialData={editingTask} buttonText={editingTask ? "Update Task" : "Save Task"}
                                onAddTask={ editingTask ? handleUpdateTask : handleAddTask} />

                        )}

                        <div className="mt-6">

                            {filteredTasks.length === 0 ? (

                                <p className="text-gray-500">

                                    No Tasks Yet...

                                </p>

                            ) : (

                                filteredTasks.map((task) => (

                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onDelete={handleDeleteTask}
                                    onEdit={(task) => {
                                        setEditingTask(task);
                                        setShowForm(true);
                                    }}
                                    onToggleComplete={handleToggleComplete}
                                />

                                ))

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;