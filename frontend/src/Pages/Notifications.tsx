import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { api } from "../Axios/axios";

interface Notification {
    _id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

type FilterType = "all" | "read" | "unread";

const Notifications: React.FC = () => {
    const [notes, setNotes] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get("/notifications", { headers: { Authorization: `Bearer ${token}` } });
                setNotes(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const filteredNotes = notes.filter(n => {
        const matchesSearch =
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.message.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "all" ||
            (filter === "read" && n.read) ||
            (filter === "unread" && !n.read);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Header />
            <div className="p-6">
                <h1 className="text-2xl mb-4">Notifications</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded px-3 py-2 w-full md:w-64 dark:bg-gray-800 dark:border-gray-700"
                    />
                    <div className="flex gap-2">
                        <button
                            className={`px-3 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                            onClick={() => setFilter("all")}
                        >
                            All
                        </button>
                        <button
                            className={`px-3 py-2 rounded ${filter === "read" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                            onClick={() => setFilter("read")}
                        >
                            Read
                        </button>
                        <button
                            className={`px-3 py-2 rounded ${filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                            onClick={() => setFilter("unread")}
                        >
                            Unread
                        </button>
                    </div>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul className="space-y-3">
                        {filteredNotes.length === 0 ? (
                            <li>No notifications found.</li>
                        ) : (
                            filteredNotes.map(n => (
                                <li key={n._id} className={`p-4 rounded shadow-sm ${n.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}`}>
                                    <div className="font-semibold">{n.title}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">{n.message}</div>
                                    <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
