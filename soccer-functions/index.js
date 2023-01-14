const functions = require('@google-cloud/functions-framework');
const axios = require('axios')
const { Firestore } = require('@google-cloud/firestore')



// TODO get from environment or db
const league = 'bl1'
const season = '2022'


functions.http('load-team-data', async (req, res) => {
  console.log('load team data called')
  const response = await axios.get(`https://www.openligadb.de/api/getavailableteams/${league}/${season}`)
  const teams = response.data
  const collectionPath = `league/${league}/season/${season}/teams`
  const firestore = new Firestore()
  const collection = await firestore.collection(`league/${league}/season/${season}/teams`)
  for (const team of teams) {
    await collection.doc(''+team.TeamId).set(team)
  }
  const message = `Added/Changed ${teams.length} Teams in Collection ${collectionPath} `
  console.log(message)
  res.send({status:'OK', message: message })
})


functions.http('load-match-data', async (req, res) => {
  console.log('load match data called')
  const response = await axios.get(`https://www.openligadb.de/api/getmatchdata/${league}/${season}`)
  const matches = response.data
  const collectionPath = `league/${league}/season/${season}/matches`
  const firestore = new Firestore()
  const collection = await firestore.collection(collectionPath)
  for (const match of matches) {
    await collection.doc(''+match.MatchID).set(match)
  }
  const message = `Added/Changed ${matches.length} Matches in Collection ${collectionPath} `
  console.log(message)
  res.send({status:'OK', message: message })
})
