import Image from "next/image"
import React from "react"

type Problems = {
    id: number;
    name: string;
    description: string;
    image: string;
}

type ProblemsProps = {
    title: string;
    problems: Problems[];
}

const CardSolution: React.FC<ProblemsProps> = ({title, problems}) => {
    const displayedProblems = problems

    return (
       <div className="w-full bg-blue-900/80 py-24 mt-12 rounded-lg">
            <div className="mx-auto p-10">
                <div className="border-b-2 pb-4 border-white">
                    <h1 className="text-4xl font-bold text-blue-900 bg-white inline-block px-4 py-2 rounded">
                        Solutions
                    </h1>
                    <h2 className="text-2xl font-bold text-white mt-6">{title}</h2>
                </div>
                <div className="w-full flex justify-between items-start gap-6 py-6">
                    <div className="flex flex-col gap-6 w-1/2 justify-start items-start">
                        {displayedProblems.map((problem) => (
                            <div
                                key={problem.id}
                                className="w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                            >
                                <div className="p-5">
                                    <h5 className="mb-2 text-center text-2xl font-bold text-gray-900">
                                        {problem.name}
                                    </h5>
                                    <p className="mb-3 text-center font-normal text-gray-700">
                                        {problem.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-1/2">
                        <Image
                            src={'/assets/images/sucofindo-1.jpg'}
                            alt={'Gambar'}
                            width={500}
                            height={300}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardSolution