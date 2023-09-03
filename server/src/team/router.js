import TeamModel from './model'

const router = require('express').Router();

router.post('/saveTeamName', async (req, res) => {
    try {

        const { newTeamName } = req.body;

        const data = await TeamModel.findOne({ teamName: newTeamName })

        if (data) {
            return res
                .status(422)
                .send({ error: 'Teamname is in use' });
        }
        else {

            const teamName = new TeamModel({ teamName: newTeamName })

            await teamName.save()

            return res.send({ error: true, message: 'Team added.', data: teamName });

        }
    }
    catch (e) {

        console.log("An error has occured when you are trying to save new team name", e)
        res.status(401).send(e)

    }
})

router.get('/get', async (req, res) => {

    try {

        const allTeams = await TeamModel.find()

        const teams = allTeams.filter(({ deletedAt }) => !deletedAt)

        if (teams) {
            return res.send({ error: true, message: 'Team found', data: teams });
        }
        return res.send({ error: false, message: 'Team not found', data: null });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }

})


router.get('/getAllTeamNames', async (req, res) => {
    try {

        const allTeams = await TeamModel.find()

        const teams = allTeams.filter(({ deletedAt }) => !deletedAt)

        const teamNames = []

        for (let i = 0; i < teams.length; i++) {
            teamNames.push(teams[i].teamName)
        }

        if (teamNames) {
            return res.send({ error: true, message: 'Team found', data: teamNames });
        }

        return res.send({ error: false, message: 'Team not found', data: null });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})
export default router;
