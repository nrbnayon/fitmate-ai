import DashboardHeader from "@/components/Shared/DashboardHeader"

function DashboardPage() {
  return (
      <div>
          <DashboardHeader title="Dashboard" description="Welcome to your dashboard" />
         <div className="p-4 md:p-8">
          DashboardPage
         </div>
      </div>
  )
}

export default DashboardPage