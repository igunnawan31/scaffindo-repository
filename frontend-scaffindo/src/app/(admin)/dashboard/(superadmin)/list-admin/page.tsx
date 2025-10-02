"use client"

import { Suspense } from "react"
import AdminList from "../superadmincomponents/AdminList"

const ManageAdminPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminList />
        </Suspense>
    )
}

export default ManageAdminPage