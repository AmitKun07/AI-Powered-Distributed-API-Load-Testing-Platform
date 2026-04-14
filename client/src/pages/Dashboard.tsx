import MainLayout from "@/components/layout/MainLayout"
import StatsCard from "@/features/dashboard/components/StatsCards"
import ApiPanel from "@/features/dashboard/components/ApiPanel"
import RecentTestResults from "@/features/dashboard/components/RecentTableResult"
import Sidebar from "@/components/layout/Sidebar"
import { useEffect, useState } from "react"
import { getResults } from "@/services/api"

export default function Dashboard() {
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Load past results on refresh
  useEffect(() => {
    fetchResults();
  }, []);

  return (  
     <MainLayout>
      <div
        style={{
        }}
      >
        <ApiPanel onTestComplete={fetchResults}/>
        <RecentTestResults results={results}/>
      </div>
    </MainLayout>
  )
}