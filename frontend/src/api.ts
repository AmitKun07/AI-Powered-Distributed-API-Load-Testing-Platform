const BASE_URL = "http://localhost:8080"

export async function startTest(data: any) {
  const res = await fetch(`${BASE_URL}/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function getResults() {
  const res = await fetch(`${BASE_URL}/results`)
  return res.json()
}

export async function analyzeResult(id: number) {
  const res = await fetch(`http://localhost:5000/analyze/${id}`)
  return res.json()
}