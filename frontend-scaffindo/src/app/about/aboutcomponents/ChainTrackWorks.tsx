import steps from "@/app/data/chainsData"

const ChainTrackWorks = () => {
    return (
         <section className="w-full text-white flex justify-center mt-12">
            <div className="w-full bg-blue-900/80 rounded-lg p-10 shadow-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">How ChainTrack Works</h2>
                    <p className="text-gray-300 mt-2">
                        End-to-end blockchain tracking dalam 5 tahap simple
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="flex flex-col items-center text-center max-w-[220px]"
                        >
                            <div
                                className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center text-3xl`}
                            >
                                {step.icon}
                            </div>
                            <h3 className="mt-4 font-semibold">{step.id}. {step.title}</h3>
                            <p className="text-sm text-gray-300 mt-2">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-green-800/60 border border-green-500 rounded-xl p-6 mt-12 text-center">
                    <h4 className="text-green-400 font-semibold">🔑 Key Innovation</h4>
                    <p className="text-white font-medium mt-2">
                        1 QR Code, 5 Stakeholders, Complete Transparency
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                        Setiap stakeholder scan QR code yang sama, tapi update blockchain
                        record sesuai role masing-masing
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ChainTrackWorks