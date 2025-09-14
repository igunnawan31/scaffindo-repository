import features from "@/app/data/platformsData"

const Platforms = () => {
    return (
        <section className="bg-blue-900/80 text-white py-16 px-10 flex justify-center mt-12 rounded-lg">
            <div className="w-full">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                        <span role="img" aria-label="rocket">🚀</span>
                        Platform Features
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Comprehensive solution untuk food safety & traceability
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f) => (
                        <div
                            key={f.id}
                            className="bg-gray-800/70 rounded-2xl shadow-lg p-6 flex flex-col"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`${f.bg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold">{f.title}</h3>
                            </div>

                            <ul className="text-gray-300 space-y-2 text-sm flex-1">
                                {f.points.map((p, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                        • {p}
                                    </li>
                                ))}
                            </ul>

                            {/* Badge */}
                            <div className="mt-6">
                                <span className={`${f.badge.color} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                                    {f.badge.text}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Platforms