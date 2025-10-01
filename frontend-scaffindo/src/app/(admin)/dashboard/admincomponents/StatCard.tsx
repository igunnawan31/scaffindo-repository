
export function StatCard({ title, value }: { title: string; value: number | string }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <span className="text-gray-600 text-sm">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    );
}