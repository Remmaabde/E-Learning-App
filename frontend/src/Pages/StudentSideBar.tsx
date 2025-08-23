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
        to: "/aiAssistant",
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
        <div className="min-h-screen bg-[#F9F0FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors">
            <Header />
            <div className="flex">
                <aside
                    className={`transition-all duration-300 bg-[#f2dfff]/90 dark:bg-gray-900/90 shadow-lg border-r border-[#d2b4e9] dark:border-gray-800 p-4 flex flex-col ${
                        open ? "w-64" : "w-16"
                    }`}
                >
                    <button
                        className="mb-6 p-2 rounded-full bg-[#AB51E3] dark:bg-gray-700 hover:bg-[#310055] dark:hover:bg-gray-600 transition-colors self-end text-white"
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
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#AB51E3] border border-[#d2b4e9]"
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
                                                    ? "bg-[#AB51E3] text-white dark:bg-blue-900 dark:text-blue-200"
                                                    : "hover:bg-[#d2b4e9] dark:hover:bg-gray-800 text-black dark:text-white"
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
                    <h2 className="text-3xl font-bold mb-4 text-black dark:text-blue-200">
                        Student Area
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                        Select an item from the sidebar to continue.
                    </p>
                    <section className="mt-6 max-w-md bg-[#f2dfff] dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="font-semibold mb-4 text-black dark:text-white text-lg">Contact Instructor</h3>
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
        <form onSubmit={handleSend} className="flex flex-col gap-3">
            <input 
                className="p-3 rounded-lg border focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none bg-white" 
                placeholder="Instructor email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
            />
            <input 
                className="p-3 rounded-lg border focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none bg-white" 
                placeholder="Subject" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
            />
            <textarea 
                className="p-3 rounded-lg border focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none bg-white min-h-[100px]" 
                placeholder="Message" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
            />
            <div className="flex gap-2">
                <button type="submit" className="px-6 py-3 bg-[#AB51E3] text-white rounded-lg hover:bg-[#310055] transition-colors font-medium">Send</button>
            </div>
        </form>
    );
}
