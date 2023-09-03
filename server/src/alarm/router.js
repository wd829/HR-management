import toObjId from '../util/toObjectType';
import AlarmModel from './model'
import UserModel from '../user/model';

const moment = require('moment-timezone')

const router = require('express').Router();

router.post('/save', async (req, res) => {
    try {

        const { title, content, userName, createdAt } = req.body;


        const newAlarm = new AlarmModel({
            title: title,
            content: content,
            userName: userName,
            date: createdAt
        })

        const savedAlarm = await newAlarm.save();

        return res.send({ error: true, message: 'success', data: savedAlarm })

    }
    catch (e) {

        console.log("An error has occured when you are trying to save new team name", e)
        res.status(401).send(e)

    }
})

router.get('/get', async (req, res) => {

    try {

        const startTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment().startOf('day').add(23, 'hour').format('YYYY-MM-DD HH:mm:ss');

        // const startTime = moment().subtract(1, 'day').startOf('day').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
        // const endTime = moment(startTime).add(2, 'day').add(23, 'hour').format('YYYY-MM-DD HH:mm:ss');


        const recentAlarms = await AlarmModel.find({ deletedAt: null })
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
            .limit(5); // Limit the result to 5 documents

        if (recentAlarms) {
            return res.send({ error: true, message: 'Alarm found', data: recentAlarms });
        }
        return res.send({ error: false, message: 'Team not found', data: null });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }

})

router.post('/getTimeRangeNotificationData', async (req, res) => {

    try {
        const { startTime, endTime, userId } = req.body;

        // const startTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        // const endTime = moment().startOf('day').add(23, 'hour').format('YYYY-MM-DD HH:mm:ss');

        // const startTime = moment().subtract(1, 'day').startOf('day').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
        // const endTime = moment(startTime).add(2, 'day').add(23, 'hour').format('YYYY-MM-DD HH:mm:ss');


        const recentAlarms = await AlarmModel.find({
            deletedAt: null,
            date: {
                $gte: startTime,
                $lte: endTime
            }
        })
            .sort({ updatedAt: -1 }) // Sort by createdAt field in descending order

        if (recentAlarms) {
            return res.send({ error: true, message: 'Alarm found', data: recentAlarms });
        }
        return res.send({ error: false, message: 'Alarm not found', data: null });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }

})

router.post('/getNotificationDataWithViewItem', async (req, res) => {
    try {
        const { viewReportItem, userId } = req.body

        const currentDate = moment();

        let startTime = '', endTime = '';

        if (viewReportItem === 'a') {
            if (currentDate.isBefore(moment().hours(8).minutes(0).seconds(0))) {
                startTime = currentDate.subtract(1, 'day').startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');
                endTime = currentDate.add(1, 'day').startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');

            }
            else {
                startTime = currentDate.startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');
                endTime = currentDate.add(1, 'day').startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');

            }
        }
        if (viewReportItem === 'b') {
            startTime = currentDate.subtract(1, 'day').startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');

            endTime = currentDate.add(1, 'day').startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');
        }
        if (viewReportItem === 'c') {
            startTime = currentDate.subtract(1, 'week').startOf('day').hour(8).format('YYYY-MM-DD HH:mm:ss');

            endTime = currentDate.add(1, 'week').startOf('day').hour(23).format('YYYY-MM-DD HH:mm:ss');
        }

        const recentAlarms = await AlarmModel.find({
            deletedAt: null,
            date: {
                $gte: startTime,
                $lte: endTime
            }
        })
            .sort({ updatedAt: -1 }) // Sort by createdAt field in descending order

        if (recentAlarms) {
            return res.send({ error: true, message: 'Alarm found', data: recentAlarms });
        }
        return res.send({ error: false, message: 'Alarm not found', data: null });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

router.post('/delete', async (req, res) => {
    try {

        const { id: { rowId } } = req.body;

        const update = { deletedAt: Date.now() };

        const result = await AlarmModel.findByIdAndUpdate(toObjId(rowId), update, { new: true });;

        if (result) {
            return res.send({ error: false, message: 'Alarm deleted', data: result });
        } else {
            return res.send({ error: true, message: 'Alarm not deleted' });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

router.post('/update', async (req, res) => {
    try {
        const { row, key } = req.body;
        const update = { title: row.title, content: row.content };

        const result = await AlarmModel.findByIdAndUpdate(toObjId(key), update, { new: true }).sort({ date: -1 }).exec();

        if (result) {
            return res.send({ error: false, message: 'Alarm was updated', data: result });
        } else {
            return res.send({ error: true, message: 'Alarm not updated' });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

router.post('/read', async (req, res) => {
    try {

        const { alarmId, userId, formattedTime } = req.body;

        const indexAlarm = await AlarmModel.findById(toObjId(alarmId));

        const indexUser = await UserModel.findById(toObjId(userId));

        indexAlarm.visitUser.push({ indexUser, userId, visitedTime: formattedTime });

        await indexAlarm.save();

        const updateAlarm = await AlarmModel.findById(toObjId(alarmId));

        if (updateAlarm) {
            return res.send({ error: false, message: 'Updated Alarm', data: updateAlarm });
        } else {
            return res.send({ error: true, message: 'Alarm not found' });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

export default router;
