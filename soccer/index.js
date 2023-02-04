/**
 * this module handles all http request to our soccer app
 * It returns the data as json
 */

// include libraries for microservices and file handling
const express = require('express')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

// use the no sql database
const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore()

// import the TextToSpeechClientService from GCP
// const {TextToSpeechClient} = require('@google-cloud/text-to-speech');


// start express app with the port from the environment or 3000 for local development
const app = express()
const port = process.env.PORT || 3000

// enable json parsing
app.use(express.json())

// enable static html pages in the folder public
app.use(express.static(path.join(__dirname, 'public')));

// set the correct header information
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// options for the different endpoints
app.options('/api/match', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

app.options('/api/team', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

app.options('/api/addresult', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

// formatting of the responses
app.set('json spaces', 2)

// 
app.get('/api/', (req, res) => {
  res.send('<html><body><h1>ACS - Soccer Service</h1><p>is running on Google Cloud Platform</p></body></html>')
})

/**
 * team endpoints
 */

// gets all teams
app.get('/api/team', async (req, res) => {
  // connect to firestore and get all documents from the collection sample-teams
  const snapshot = await firestore.collection('sample-teams').get()
  // convert the docs to teams objects
  const allDocsFromDb = snapshot.docs
  console.log(allDocsFromDb[0].data())
  const teams = snapshot.docs.map(doc => doc.data())
  res.json(teams)
})


// find a team with an ID
app.get('/api/team/:id', async (req, res) => {
  const requestId = req.params.id
  // get the document reference with the requested id
  const teamRef = firestore.collection('sample-teams').doc(requestId)
  const doc = await teamRef.get()
  // return the document data, if the doc exists, otherwise an empty object
  const result = doc.exists ? doc.data() : {}
  console.log(result)
  res.json(result)
})


/**
 * match endpoints
 */
app.get('/api/match', async (req,res) => {
  // connect to firestore and get all documents from the collection sample-teams
  const snapshot = await firestore.collection('sample-matches').get()
  // convert the docs to teams objects
  const matches = snapshot.docs.map(doc => doc.data())
  res.json(matches)
})


// find a match with an ID
app.get('/api/match/:id', async (req, res) => {
  const requestId = req.params.id
  // get the document reference with the requested id
  const matchRef = firestore.collection('sample-matches').doc(requestId)
  const doc = await matchRef.get()
  const result = doc.exists ? doc.data() : {}
  res.json(result)
})

// creates a new match
app.post('/api/match', async (req, res) => {
  const newMatch = req.body
  // create a new id if not provided
  const id = newMatch?.id ?? uuid.v4()
  // const id = newMatch.hasOwnProperty('id') ? newMatch.id : uuid.v4() 
  const collection = firestore.collection('sample-matches')
  await collection.doc(id).set(newMatch)
  res.send({status: 'OK', message: 'new match created'})
})

// updates a match with new values
app.patch('/api/match/:id', async (req, res) => {
  const matchId = req.params.id
  const newValues = req.body
  const collection = firestore.collection('sample-matches')
  await collection.doc(matchId).update(newValues)
  // send a status and message as result
  res.send({status: 'OK', message: 'match data updated'})
})

// updates a match with new values
app.put('/api/addresult/', async (req, res) => {
  const result = req.body
  const collection = firestore.collection('sample-matches')
  const match = await collection.doc(result.id).update({
    goals1: result.goals1,
    goals2: result.goals2,
    finished: true
  })
  res.send({status: 'OK', message: 'result updated'})
})

// deletes a match with the id
app.delete('/api/match/:id', async (req, res) => {
  const matchId = req.params.id
  const collection = firestore.collection('sample-matches')
  await collection.doc(matchId).delete()
  res.send({status: 'OK', message: 'match deleted'})
})


/**
 * initializing app
 */
app.listen(port, async () => {
  console.log(`Soccer app is starting at ${port}`)
  await initData()
  console.log('Soccer app running')
})


// initializes the data, so that we always have the same start set of data
const initData = async () => {
  console.log('Intializing Data')
  // delete the existing data, so that we always have the same test data
  const sampleteams = await firestore.collection('sample-teams').get()
  const samplematches = await firestore.collection('sample-matches').get()
	const batch = firestore.batch()
  sampleteams.docs.forEach(doc => {
    batch.delete(doc.ref)
  })
  samplematches.docs.forEach(doc => {
    batch.delete(doc.ref)
  })
  await batch.commit()

  // create the sample data again
  const teams = loadTeams()
  
  for (const team of teams) {
    await firestore.collection('sample-teams').doc(team.id).set(team)
  }
  const matches = loadMatches()
  for (const match of matches) {
    await firestore.collection('sample-matches').doc(match.id).set(match)
  }
}

/**
 * helper functions (will be replaced by database in future) 
 * */ 
const loadTeams = () => {
  const filepath = path.join(__dirname, 'data', 'teams.json')
  const data = fs.readFileSync(filepath)
  return teams = JSON.parse(data)
}

const loadMatches = () => {
  const filepath = path.join(__dirname, 'data', 'matches.json')
  const data = fs.readFileSync(filepath)
  return matches = JSON.parse(data)
}

const ttsForMatch = async (id) => {
  console.log(`getting mp3 for match with ${id}`)
  const text = await getTextForMatch(id)
  const audio = await generateAudio(text)
  console.log(text)
  return audio
}

const getTextForMatch = async (id) => {
  // read the match
  const doc = await firestore.collection('sample-matches').doc(id).get()
  const match = doc.exists ? doc.data() : {}  
  if (!match) {
    console.log('match not found')
    return null
  }
  console.log(match.team1)
  const name1 = await readTeamName(match.team1)
  const name2 = await readTeamName(match.team2)

  let text = ''
  if (match.finished) {
    text = `${name1} played ${match.goals1} to ${match.goals2} against ${name2}`
  }
  else {
    const options = {  month: 'long', day: 'numeric' }
    const d = new Date(match.startDate)
    const dateText = d.toLocaleDateString('en-US', options)

    text = `The match between ${name1} and ${name2} will start at ${dateText}`
  }
  return text
}

