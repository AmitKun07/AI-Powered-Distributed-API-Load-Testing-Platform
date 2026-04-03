import { useState } from "react"
import { startTest, getResults, analyzeResult } from "./api"

function App() {
  const [url, setUrl] = useState("")
  const [requests, setRequests] = useState(100)
  const [concurrency, setConcurrency] = useState(10)
  const [results, setResults] = useState<any[]>([])

  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handleStart = async () => {
    await startTest({ url, requests, concurrency })
    alert("Test started 🚀")
  }

  const handleFetch = async () => {
    const data = await getResults()
    setResults(data)
  }

  const handleAnalyze = async (id: number) => {
    setLoadingId(id)

    try {
      const data = await analyzeResult(id)
      setAnalysis(data.analysis || JSON.stringify(data))
    } catch (err) {
      setAnalysis("Error fetching analysis")
    }

    setLoadingId(null)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 API Load Tester</h1>

      <div>
        <input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="number"
          value={requests}
          onChange={(e) => setRequests(Number(e.target.value))}
        />

        <input
          type="number"
          value={concurrency}
          onChange={(e) => setConcurrency(Number(e.target.value))}
        />

        <button onClick={handleStart}>Start Test</button>
        <button onClick={handleFetch}>Get Results</button>
      </div>

      <hr />

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>Requests</th>
            <th>Avg Latency</th>
            <th>P95</th>
            <th>RPS</th>
            <th>AI</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.url}</td>
              <td>{r.total_requests}</td>
              <td>{r.avg_latency}</td>
              <td>{r.p95_latency}</td>
              <td>{r.rps}</td>

              <td>
                <button onClick={() => handleAnalyze(r.id)}>
                  {loadingId === r.id ? "Analyzing..." : "Analyze"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AI Result */}
      {analysis && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid black" }}>
          <h3>🧠 AI Insight</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  )
}

export default App