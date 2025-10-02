import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function useRoleFromQuery() {
    const searchParams = useSearchParams();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        setRole(searchParams.get("role"));
    }, [searchParams]);

    return role;
}
