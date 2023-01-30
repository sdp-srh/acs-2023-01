
const express = require('express')
const path = require('path')

const {Translate} = require('@google-cloud/translate').v2

const { BigQuery } = require('@google-cloud/bigquery');

// start express app with the port from the environment or 3000 for local development
const app = express()
const port = process.env.PORT || 3000

// enable json parsing
app.use(express.json())

// enable express to act as webserver for files in folder "public"
app.use(express.static(path.join(__dirname, 'public')))

// default html page
app.get('/', async (req, res) => {
  const htmlText = `
    <html>
      <head>
        <title>ACS - Examples</title>
      </head>
      <body>
        <h1>ACS - Examples</h1>
        <p><a href="./translation.html">Translation</a></p>
        <p><a href="./trends.html">Google Search Trends</a></p>
      </body>
    </html>
  `
  res.send(htmlText)
})

// translation post endpoint for german to english
app.post('/de2en', async (req, res) => {
  const source = req.body.source
  const translate = new Translate()
  const options = {from: 'de', to: 'en'}
  const [translation] = await translate.translate(source, options);
  res.send({translation: translation})
})


//  translation post endpoint for english to german
app.post('/en2de', async (req, res) => {
  const source = req.body.source
  const translate = new Translate()
  const options = {from: 'en', to: 'de'}
  const [translation] = await translate.translate(source, options);
  res.send({translation: translation})
})

// big data query endpoint
app.get('/google-trends', async (req, res) => {
  const trends = await readTrends()
  res.send({ amount: trends.length, results: trends})
})


// reads the news from the big query service
const readTrends = async () => {
  const bigquery = new BigQuery()
  
  const statement = `
      -- This query shows a list of the daily top Google Search terms.
      SELECT
        refresh_date AS Day,
        term AS Top_Term,
        rank,
      FROM \`bigquery-public-data.google_trends.top_terms\`
      WHERE
        rank = 1
            -- Choose only the top term each day.
        AND refresh_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK)
            -- Filter to the last 2 weeks.
      GROUP BY Day, Top_Term, rank
      ORDER BY Day DESC
        -- Show the days in reverse chronological order.  
  `
  // call the data with the query statement
  const [rows] = await bigquery.query({query: statement})
  return rows;
}


app.listen(port, async () => {
  console.log(`test service is running on ${port}`)
})

