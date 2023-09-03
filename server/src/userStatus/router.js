import UserstatusModel from './model'

const router = require('express').Router();

router.post('/saveUserStatusType', async (req, res) => {
    try {

        const { userStatus } = req.body;

        const data = await UserstatusModel.findOne({ userStatus: userStatus });

        if (data) {
            return res
                .status(422)
                .send({ error: 'UserStatus is in use' });
        }
        else {

            const newUserStatus = new UserstatusModel({ userStatus: userStatus.toString() });

            await newUserStatus.save();

            return res.send({ error: true, message: 'UserStatus added.', data: newUserStatus });

        }
    }
    catch (e) {

        console.log("An error has occured when you are trying to save new group name", e)
        res.status(401).send(e)

    }
})

router.get('/get', async (req, res) => {

    try {

        const allStatus = await UserstatusModel.find()

        const status = allStatus.filter(({ deletedAt }) => !deletedAt)

        if (status) {
            return res.send({ error: true, message: 'Group found', data: status });
        }
        return res.send({ error: false, message: 'Group not found', data: null });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }

})


router.get('/getAllUserStatus', async (req, res) => {
    try {

        const allStatus = await UserstatusModel.find()

        const status = allStatus.filter(({ deletedAt }) => !deletedAt)

        const userStatusGroup = []

        for (let i = 0; i < status.length; i++) {
            userStatusGroup.push(status[i].userStatus)
            // const users = await UserModel.find({ group: groups[i].groupName });
            // const avaiableUsers = users.filter(({ deletedAt }) => !deletedAt)
        }

        if (userStatusGroup) {
            return res.send({ error: true, message: 'Group found', data: userStatusGroup });
        }

        return res.send({ error: false, message: 'Group not found', data: null });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

export default router;
