const { Firestore } = require('@google-cloud/firestore')

const firestore = new Firestore()

const readTeams = async () => {
	const collectionPath = `league/${league}/season/${season}/matches`
	const snapshot = await firestore.collection('teams').get()
	const teams = snapshot.docs.map(doc => doc.data())
	return teams
}

module.exports = { readTeams }