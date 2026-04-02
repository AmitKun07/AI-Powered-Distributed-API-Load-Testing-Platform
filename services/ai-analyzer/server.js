import pkg from "pg"
import express from "express"
// import fetch from "node-fetch"

const { Pool } = pkg
const app = express()

const pool = new Pool({
  host: "postgres",
  user: "admin",
  password: "admin",
  database: "loadtest",
  port: 5432
})

app.get("/analyze/:id", async (req, res) => {
  try {
    const id = req.params.id

    const result = await pool.query(
      "SELECT * FROM test_results WHERE id = $1",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Test not found" })
    }

    const metrics = result.rows[0]

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: `
// Analyze this API performance:

// URL: ${metrics.url}
// Average latency: ${metrics.avg_latency}
// P95 latency: ${metrics.p95_latency}
// RPS: ${metrics.rps}

// Give insights and improvements.
// `
//           }
//         ]
//       })
//     })

    // const data = await response.json()
    // const analysis = data.choices[0].message.content

    // res.json({
    //   metrics,
    //   analysis
    // })
    res.json({
       message: "AI analyzer working",
          input: metrics
         })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})