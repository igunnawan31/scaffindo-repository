import Path from "./Path";

const Header = () => {
    return (
        <div className="flex justify-between items-center w-full">
        <div
            className="p-3 bg-blue-900 border-2 border-blue-900 text-white 
            hover:bg-white hover:border-blue-900 hover:text-blue-900
            rounded-lg font-semibold flex items-center text-sm"
        >
            &laquo; Back to Home
        </div>
            <Path />
        </div>
    );
};

export default Header;