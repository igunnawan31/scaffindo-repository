import Link from "next/link"
import HistoryPenjualan from "../retailcomponents/HistoryPenjualan"

const PenjualanCustomerPage = () => {
    return (
        <>
            <div className="w-full py-32 flex justify-center items-center rounded-lg shadow-md bg-white border border-dashed">
                <Link
                    href={'/dashboard/penjualan-customer/create-new-penjualan'}
                    className="p-5 bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer rounded-lg"
                >
                    + Penjualan Baru
                </Link>
            </div>
            <div className="mt-5">
                <HistoryPenjualan />
            </div>
        </>
    )
}

export default PenjualanCustomerPage