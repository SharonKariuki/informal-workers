// app/pages/dashboard/page.js

import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import DashboardClient from "../dashboard/DashboardClient/page"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  if (session.user.role !== "admin") {
    return (
      <div className="p-10 text-red-700">
        You are not authorized to view this page.
      </div>
    )
  }

  return <DashboardClient session={session} />
}
