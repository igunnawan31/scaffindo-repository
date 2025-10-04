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

const CardProblems: React.FC<ProblemsProps> = ({title, problems}) => {
    const displayedProblems = problems

    return (
        <div className="flex flex-col justify-center items-center gap-5 overflow-hidden py-2 w-full">
            <div className="border-b-2 p-4 border-blue-900">
                <h1 className="text-4xl font-bold text-blue-900">Problems</h1>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full">
                {displayedProblems.map((problem) => (
                    <div
                        key={problem.id}
                        className="w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                        <Image
                            src={problem.image}
                            alt={problem.name}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-5">
                            <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900">{problem.name}</h5>
                            <p className="mb-3 text-center font-normal text-gray-700">{problem.description}</p>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CardProblems