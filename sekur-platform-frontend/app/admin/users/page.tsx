"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { UsersManagement } from "@/components/users-management"

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "ADMIN") {
    return null
  }

  return (
    <AdminLayout>
      <UsersManagement />
    </AdminLayout>
  )
}
