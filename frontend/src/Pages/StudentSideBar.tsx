import React, { useState } from "react";
import Header from "../components/Header";
import { api } from "../Axios/axios";
import { Link, useLocation } from "react-router-dom";
import {
    HiOutlineViewGrid,
    HiOutlineBookOpen,
    HiOutlineCollection,
    HiOutlineBell,
    HiOutlineUser,
    HiOutlineSparkles,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineSearch,
} from "react-icons/hi";

const navItems = [
    {
        to: "/student/dashboard",
        label: "Dashboard",
        short: "D",
        icon: <HiOutlineViewGrid className="w-5 h-5" />,
    },
    {
        to: "/courses",
        label: "Browse Courses",
        short: "B",
        icon: <HiOutlineBookOpen className="w-5 h-5" />,
    },
    {
        to: "/student/my-courses",
        label: "My Courses",
        short: "M",
        icon: <HiOutlineCollection className="w-5 h-5" />,
    },
    {
        to: "/student/notifications",
        label: "Notifications",
        short: "N",
        icon: <HiOutlineBell className="w-5 h-5" />,
    },
    {
        to: "/profile",
        label: "Profile",
        short: "P",
        icon: <HiOutlineUser className="w-5 h-5" />,
    },
    {
        to: "/assistant",
        label: "AI Assistant",
        short: "A",
        icon: <HiOutlineSparkles className="w-5 h-5" />,
    },
];

const StudentSideBar: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [search, setSearch] = useState("");
    const location = useLocation();

    const filteredNavItems = navItems.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors">
            <Header />
            <div className="flex">
                <aside
                    className={`transition-all duration-300 bg-white/90 dark:bg-gray-900/90 shadow-lg border-r border-blue-100 dark:border-gray-800 p-4 flex flex-col ${
                        open ? "w-64" : "w-16"
                    }`}
                >
                    <button
                        className="mb-6 p-2 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors self-end"
                        onClick={() => setOpen((o) => !o)}
                        aria-label="Toggle sidebar"
                    >
                        {open ? (
                            <HiOutlineChevronLeft className="w-5 h-5" />
                        ) : (
                            <HiOutlineChevronRight className="w-5 h-5" />
                        )}
                    </button>

                    {open && (
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <HiOutlineSearch className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                    )}

                    <nav className="flex flex-col gap-2">
                        {filteredNavItems.length > 0 ? (
                            filteredNavItems.map((item) => {
                                const active =
                                    location.pathname === item.to ||
                                    (item.to !== "/" && location.pathname.startsWith(item.to));
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors
                                            ${
                                                active
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                    : "hover:bg-blue-50 dark:hover:bg-gray-800"
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        {open ? (
                                            <span className="ml-1">{item.label}</span>
                                        ) : (
                                            <span className="sr-only">{item.label}</span>
                                        )}
                                        {!open && (
                                            <span className="ml-0.5">{item.short}</span>
                                        )}
                                    </Link>
                                );
                            })
                        ) : (
                            <span className="text-gray-400 text-sm px-3 py-2">
                                No results found
                            </span>
                        )}
                    </nav>
                </aside>

                <main className="flex-1 p-8 transition-colors">
                    <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-200">
                        Student Area
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                        Select an item from the sidebar to continue.
                    </p>
                    <section className="mt-6 max-w-md bg-white/80 dark:bg-gray-800 p-4 rounded shadow">
                        <h3 className="font-semibold mb-2">Contact Instructor</h3>
                        <ContactInstructorForm />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default StudentSideBar;

const ContactInstructorForm: React.FC = () => {
    const [email, setEmail] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await api.post("/notifications/send", { toEmail: email, title, message }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Message sent to instructor");
            setEmail(""); setTitle(""); setMessage("");
        } catch (err: any) {
            alert("Failed to send: " + (err?.response?.data?.error || err.message));
        }
    };

    return (
        <form onSubmit={handleSend} className="flex flex-col gap-2">
            <input className="p-2 rounded" placeholder="Instructor email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="p-2 rounded" placeholder="Subject" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="p-2 rounded" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
            <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
            </div>
        </form>
    );
}
