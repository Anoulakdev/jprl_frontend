"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLocalStorage } from "@/utils/storage";

interface User {
  id: number;
  roleId: number;
  positionId: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
  allowedPositions?: number[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedPositions = [],
}: ProtectedRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const user = getLocalStorage<User>("user");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.roleId)) {
      router.push("/unauthorized");
      return;
    }

    if (
      allowedPositions.length > 0 &&
      !allowedPositions.includes(user.positionId)
    ) {
      router.push("/unauthorized");
      return;
    }

    setIsLoading(false);
  }, [user, router, allowedRoles, allowedPositions]);

  if (isLoading || !user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
