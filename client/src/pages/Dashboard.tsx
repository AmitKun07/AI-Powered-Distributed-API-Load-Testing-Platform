import MainLayout from "@/components/layout/MainLayout"
import StatsCard from "@/features/dashboard/components/StatsCard"
import ApiPanel from "@/features/dashboard/components/ApiPanel"
import RecentTabResults from "@/features/dashboard/components/RecentTabResults"
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
        <RecentTabResults results={results}/>
      </div>
    </MainLayout>
  )
}