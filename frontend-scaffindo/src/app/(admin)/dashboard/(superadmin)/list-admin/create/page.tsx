"use client"

import { Suspense } from "react"
import CreateAdmin from "../../superadmincomponents/CreateAdmin"

const CreateAdminPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="p-6">Loading...</div>}>
                <CreateAdmin />
            </Suspense>
        </div>
    )
}

export default CreateAdminPage