import PayModel from './model'

const router = require('express').Router();

router.post('/saveNewBillType', async (req, res) => {
    try {
        const { newBillType } = req.body;

        const data = await PayModel.findOne({ billType: newBillType })

        if (data) {
            return res
                .status(422)
                .send({ error: 'BillType is in use' });
        }
        else {

            const billType = new PayModel({ billType: newBillType })

            await billType.save()

            return res.send({ error: true, message: 'Added.', data: billType });

        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.get('/getAllPayTypes', async (req, res) => {
    try {

        const allGroups = await PayModel.find()

        const payTypes = allGroups.filter(({ deletedAt }) => !deletedAt)

        const payNames = []

        for (let i = 0; i < payTypes.length; i++) {
            payNames.push(payTypes[i].billType)
        }

        if (payNames) {
            return res.send({ error: true, message: 'Group found', data: payNames });
        }

        return res.send({ error: false, message: 'Group not found', data: null });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

export default router;