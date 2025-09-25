'use client'

import { useEffect, useRef, useState } from "react";

const DropdownOneSelect = ({
    label,
    options,
    selected,
    onChange,
    placeholder = "Select...",
}: {
    label?: string;
    options: { value: string; label: string }[];
    selected: string | null;
    onChange: (newSelected: string | null) => void;
    placeholder?: string;
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const handleSelect = (value: string) => {
        onChange(value);
        setOpen(false);
        setSearchTerm("");
    };

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={ref}>
            {label && (
                <label className="block font-semibold text-blue-900 mb-1">
                {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 items-center justify-between flex"
            >
                <span
                    className={`${
                        selected ? "text-gray-700" : "text-gray-400"
                    } truncate`}
                >
                    {selected
                        ? options.find((o) => o.value === selected)?.label ?? selected
                        : placeholder}
                </span>
                <span className="ml-2 text-sm">▾</span>
            </button>

            {open && (
                <div className="absolute z-40 mt-2 w-full max-h-56 overflow-auto rounded-md border bg-white shadow">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                                    selected === opt.value ? "bg-blue-50 font-semibold" : ""
                                }`}
                                >
                                {opt.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-400">No results</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownOneSelect;
