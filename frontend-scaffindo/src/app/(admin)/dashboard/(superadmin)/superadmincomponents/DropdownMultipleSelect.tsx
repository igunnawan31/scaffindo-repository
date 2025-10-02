'use client'

import { useEffect, useRef, useState } from "react";

const DropdownMultipleSelect = ({
    label,
    options,
    selected,
    onChange,
    placeholder = "Select...",
    disabled = false,
}: {
    label?: string;
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (newSelected: string[]) => void;
    placeholder?: string;
    disabled?: boolean
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const toggleOption = (value: string) => {
        const s = new Set(selected);
        if (s.has(value)) s.delete(value);
        else s.add(value);
        onChange(Array.from(s));
    };

    return (
        <div className="relative" ref={ref}>
            {label && <label className="block font-semibold text-blue-900 mb-1">{label}</label>}
            <button
                type="button"
                onClick={() => !disabled && setOpen((v) => !v)}
                className={`w-full px-4 py-3 rounded-full text-sm shadow-md items-center justify-between flex
                    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"}
                `}
                disabled={disabled}
            >
                <div className="flex gap-2 flex-wrap">
                    {selected.length === 0 ? (
                        <span className="text-gray-400">{placeholder}</span>
                    ) : (
                        selected.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                            {options.find((o) => o.value === s)?.label ?? s}
                        </span>
                        ))
                    )}
                    </div>
                {!disabled && (
                    <span className="ml-2 text-sm">▾</span>
                )}
            </button>

            {open && !disabled && (
                <div className="absolute z-40 mt-2 w-full max-h-56 overflow-auto rounded-md border bg-white p-2 shadow">
                    {options.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={selected.includes(opt.value)}
                                onChange={() => toggleOption(opt.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownMultipleSelect