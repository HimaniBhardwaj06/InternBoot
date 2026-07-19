function TaskCard({ task, onDelete, onEdit, onToggleComplete }) {

    const getDueStatus = () => {

        if (task.completed) {

            return {
                text: "✅ Completed",
                color: "text-green-600 dark:text-green-400",
            };

        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(task.deadline);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate - today;

        const diffDays = Math.floor(
            diffTime / (1000 * 60 * 60 * 24)
        );

        if (diffDays > 10) {

            return null;

        }

        if (diffDays > 1) {

            return {
                text: `⏳ ${diffDays} days left`,
                color: "text-yellow-600 dark:text-yellow-400",
            };

        }

        if (diffDays === 1) {

            return {
                text: "🔵 Due Tomorrow",
                color: "text-blue-600 dark:text-blue-400",
            };

        }

        if (diffDays === 0) {

            return {
                text: "🟠 Due Today",
                color: "text-orange-600 dark:text-orange-400",
            };

        }

        return {

            text: `🔴 Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`,
            color: "text-red-600 dark:text-red-400",

        };

    };

    const dueStatus = getDueStatus();


    return (
        <div className={`rounded-2xl shadow-md border p-6 mb-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                task.completed
                    ? "bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"}`}>

            <h2 className={`text-2xl font-bold ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-slate-800 dark:text-white"}`}>
                📋 {task.title}
            </h2>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">

                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">

                    💼 {task.category}

                </span>

                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        task.priority === "High"
                            ? "bg-red-500 dark:bg-red-700"
                            : task.priority === "Medium"
                            ? "bg-yellow-500 dark:bg-yellow-600"
                            : "bg-green-500 dark:bg-green-700"
                    }`}>
                    {task.priority}
                </span>

            </div>

            <div className="mt-4">

                <p className="text-sm md:text-base text-gray-500 dark:text-gray-300 break-words">

                    📅 {new Date(task.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}

                </p>

                {dueStatus && (

                    <p className={`font-semibold mt-1 ${dueStatus.color}`}>

                        {dueStatus.text}

                    </p>

                )}

            </div>

            <hr className="my-5 border-gray-300 dark:border-slate-600" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <button
                    onClick={() => onToggleComplete(task)}
                    className={`w-full px-4 py-2 rounded-xl font-semibold transition ${
                        task.completed
                            ? "bg-gray-500 text-white hover:bg-gray-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                    {task.completed ? "Completed" : "✔ Complete"}
                </button>

                <button
                    onClick={() => onEdit(task)}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-semibold transition"
                >
                    ✏ Edit
                </button>

                <button
                    onClick={() => onDelete(task.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition"
                >
                    🗑 Delete
                </button>

            </div>

        </div>
    );
}

export default TaskCard; 