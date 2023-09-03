import GroupModel from './model'
import UserModel from '../user/model';

const router = require('express').Router();

router.post('/saveNewGroupName', async (req, res) => {
    try {

        const { newGroupName } = req.body;

        const data = await GroupModel.findOne({ groupName: newGroupName })

        if (data) {
            return res
                .status(422)
                .send({ error: 'GroupName is in use' });
        }
        else {

            const groupName = new GroupModel({ groupName: newGroupName })

            await groupName.save()

            return res.send({ error: true, message: 'Group added.', data: groupName });

        }
    }
    catch (e) {

        console.log("An error has occured when you are trying to save new group name", e)
        res.status(401).send(e)

    }
})

router.get('/get', async (req, res) => {

    try {

        const allGroups = await GroupModel.find()

        const groups = allGroups.filter(({ deletedAt }) => !deletedAt)

        if (groups) {
            return res.send({ error: true, message: 'Group found', data: groups });
        }
        return res.send({ error: false, message: 'Group not found', data: null });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }

})


router.get('/getAllGroupNames', async (req, res) => {
    try {

        const allGroups = await GroupModel.find()

        const groups = allGroups.filter(({ deletedAt }) => !deletedAt)

        const groupNames = []

        for (let i = 0; i < groups.length; i++) {
            groupNames.push(groups[i].groupName)
            const users = await UserModel.find({ group: groups[i].groupName });
            const avaiableUsers = users.filter(({ deletedAt }) => !deletedAt)
        }

        if (groupNames) {
            return res.send({ error: true, message: 'Group found', data: groupNames });
        }

        return res.send({ error: false, message: 'Group not found', data: null });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

export default router;
