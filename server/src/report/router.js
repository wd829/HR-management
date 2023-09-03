import e from 'express';
import ReportModel from '../report/model';
import UserModel from '../user/model';
import toObjId from '../util/toObjectType';
import 'moment-timezone';

const moment = require('moment-timezone')

const mongoose = require('mongoose');

const router = require('express').Router();

router.post('/personal', async (req, res) => {
    try {
        const { values, userId, stringTime } = req.body

        const clientTime = moment(stringTime).format('YYYY-MM-DD HH:mm:ss');

        const user = await UserModel.findById(toObjId(userId))

        const currentDate = moment.now()

        console.log('=========we meet the date=========', moment(currentDate).format('YYYY-MM-DD HH:mm:ss'));

        let todayStart;

        let tomorrowStart;

        if (moment(currentDate).isBefore(moment(currentDate).clone().startOf('day').add(8, 'hours'))) {
            // If the current time is before 8:00 AM, adjust the time range for yesterday
            todayStart = moment().subtract(1, 'day').startOf('day').add(8, 'hours');
            tomorrowStart = moment(todayStart).add(1, 'day');
        } else {
            // If the current time is after or equal to 8:00 AM, use the regular time range for today
            todayStart = moment().startOf('day').add(8, 'hours');
            tomorrowStart = moment(todayStart).add(1, 'day');
        }

        const existingReport = await ReportModel.findOne({
            createdAt: {
                $gte: todayStart,
                $lt: tomorrowStart
            },
            userName: user.userName
        });

        console.log("=================report exist?=======", existingReport)

        if (!existingReport) {

            const report = new ReportModel({
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                reportType: false,
                userTeam: user.teamNo,
                userRole: user.role,
                achieved: values?.achieved,
                issue: values?.issue,
                other: values?.other,
                performed: values?.performed,
                plan: values?.plan,
                request: values?.request,
                date: clientTime,
                createdAt_str: clientTime,
                skillImprovement: values.skillImprovement,
                newJobEarned: values.newJobEarned,
                estimated: values.estimated,
                note: values.note
            })

            const newReport = await report.save()

            return res.send({ error: true, message: 'success', data: newReport });
        }
        else {

            existingReport.achieved = values.achieved;
            existingReport.issue = values.issue;
            existingReport.other = values.other;
            existingReport.performed = values.performed;
            existingReport.plan = values.plan;
            existingReport.request = values.request;
            existingReport.date = clientTime;
            existingReport.createdAt_str = clientTime;
            existingReport.skillImprovement = values.skillImprovement;
            existingReport.newJobEarned = values.newJobEarned;
            existingReport.estimated = values.estimated;
            existingReport.note = values.note
            const updateReport = await existingReport.save();

            return res.send({ error: true, message: 'success', data: updateReport });

        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.post('/team', async (req, res) => {
    try {
        const { values, userId } = req.body

        const user = await UserModel.findById(mongoose.Types.ObjectId(userId))

        const report = new ReportModel({
            userName: user.userName,
            reports: values,
            reportType: true,
            userTeam: user.teamNo,
            userRole: user.role,
            achieved: values.achieved,
            issue: values.issue,
            other: values.other,
            performed: values.performed,
            plan: values.plan,
            request: values.request,
        })

        await report.save()

        return res.send({ error: true, message: 'success', data: true });
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.post('/getTeamReport', async (req, res) => {
    try {
        const { _id } = req.body

        const teamReport = await ReportModel.findById(toObjId(_id)).sort({ createAt: -1 })

        if (!teamReport) {

            return res.send({ error: true, message: 'No data to display', data: true });

        }

        return res.send({ error: true, message: 'Report found', data: teamReport });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.post('/getPersonalReport', async (req, res) => {
    try {

        const { startTime, endTime, userId } = req.body

        const clientTimeZone = new Date(startTime).getTimezoneOffset()

        const currentTime = new Date().getTimezoneOffset()

        let pacificStartTime = 0, pacificEndTime = 0;

        if ((clientTimeZone - currentTime >= 12) || (currentTime - clientTimeZone >= 12)) {

            pacificStartTime = moment(startTime).utc().subtract(1, 'day').set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).format();

            pacificEndTime = moment(endTime).utc().set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).format();

        }
        else {
            pacificStartTime = moment(startTime).utc().set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).format();

            pacificEndTime = moment(endTime).utc().add(1, 'day').set({ hour: 8, minute: 0, second: 0, millisecond: 0 }).format();

        }

        let aggdata = [];

        aggdata = await ReportModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startTime,
                        $lte: endTime
                    }
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $lookup: {
                    'from': UserModel.collection.name,
                    'localField': 'userName',
                    'foreignField': 'userName',
                    'as': 'UserInfo'
                }
            },
            {
                $unwind: '$UserInfo'
            }
        ]);

        const personalReportData = aggdata.map(elem => {
            const ipMsgId = elem?.UserInfo?.ipMsgId;
            elem.date = moment(elem.date).utc().format('LLL');
            return { ...elem, ipMsgId };
        });

        if (!personalReportData) {

            return res.send({ error: true, message: 'No data to display', data: true });
        }

        return res.send({ error: true, message: 'Reports found', data: personalReportData });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }
})

router.post('/getPersonalReportWithViewItem', async (req, res) => {
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

        let aggdata = [];
        aggdata = await ReportModel.aggregate([
            {
                $match: {
                    updatedAt: {
                        $gte: new Date(startTime),
                        $lte: new Date(endTime)
                    }
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $lookup: {
                    'from': UserModel.collection.name,
                    'localField': 'userName',
                    'foreignField': 'userName',
                    'as': 'UserInfo'
                }
            },
            {
                $unwind: '$UserInfo'
            }
        ]);

        const personalReportData = aggdata.map(elem => {
            const ipMsgId = elem?.UserInfo?.ipMsgId;
            elem.date = moment(elem.date).utc().format('LLL');
            return { ...elem, ipMsgId };
        });

        if (!personalReportData) {

            return res.send({ error: true, message: 'No data to display', data: true });
        }

        return res.send({ error: true, message: 'Reports found', data: personalReportData });

    }
    catch (e) {

        return res.status(400).json({ message: e.message });

    }
})


router.post('/getPersonal', async (req, res) => {
    try {
        const { userId, date } = req.body

        const pacificTime = moment(date).utc().format();

        const user = await UserModel.findById(toObjId(userId))

        let todayStart;
        let tomorrowStart;

        if (moment(pacificTime).isBefore(moment(pacificTime).clone().startOf('day').add(8, 'hours'))) {
            // If the current time is before 8:00 AM, adjust the time range for yesterday
            todayStart = moment().subtract(1, 'day').startOf('day').add(8, 'hours');
            tomorrowStart = moment(todayStart).add(1, 'day');
        } else {
            // If the current time is after or equal to 8:00 AM, use the regular time range for today
            todayStart = moment().startOf('day').add(8, 'hours');
            tomorrowStart = moment(todayStart).add(1, 'day');
        }

        const existingReport = await ReportModel.findOne({
            createdAt: {
                $gte: todayStart.toDate(),
                $lt: tomorrowStart.toDate()
            },
            sort: {
                createAt: 1
            },
            userName: user.userName // Replace "Reporter Name" with the actual reporter name you want to search for
        });

        if (existingReport) {
            return res.send({ error: true, message: 'Reports found', data: existingReport });
        } else {
            return res.send({ error: true, message: 'Reports not found', data: null })
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

router.get('/getReportMissingUsers', async (req, res) => {
    try {

        const currentTime = moment();

        if (currentTime.isAfter(moment().hour(17).startOf('hour')) && currentTime.isBefore(moment().endOf('day'))) {

            // const specificTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');

            // const endTime = moment().set({ hour: 17, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');

            const specificTime = (moment().set({ hour: 9, minute: 0, second: 0, millisecond: 0 })).toDate();

            const endTime = (moment().add(1, 'day').add(2, 'hour')).toDate();

            let aggdata = [];

            console.log('+++++++++++the date we meet++++++', specificTime, endTime);

            aggdata = await UserModel.aggregate([
                {
                    $match: {
                        role: "General"
                    }
                },
                {
                    $lookup: {
                        from: ReportModel.collection.name,
                        localField: "userName",
                        foreignField: "userName",
                        as: "reports"
                    }
                },
                {
                    $match: {
                        reports: {
                            $elemMatch: {
                                updatedAt: {
                                    $gte: specificTime,
                                    $lte: endTime
                                }
                            }
                        }
                    }
                },
            ]);

            console.log('//////////////////////');
            // console.log(aggdata);
            console.log(aggdata.length);

            const allUsers = await UserModel.find({ deletedAt: null, role: 'General' });

            const userNames = aggdata.map(user => user.userName);

            const usersNotInUserNames = await UserModel.find({
                userName: { $nin: userNames },
                deletedAt: null,
                role: 'General'
            });

            console.log('++++++++the user we found+++++++++++++++++++', usersNotInUserNames.length)

            // return res.send({ error: true, message: 'Reports Missing Users found', data: [] });


            return res.send({ error: true, message: 'Reports Missing Users found', data: usersNotInUserNames });
        }
        else {
            return res.send({ error: true, message: 'Reports Missing User not found', data: [] });
        }


    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.get('/getNewJobEarnedData', async (req, res) => {
    try {
        const currentDate = moment.now()

        let startTime;

        startTime = moment().subtract(1, 'day').startOf('day').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
        // endTime = moment(startTime).add(2, 'day').format('YYYY-MM-DD HH:mm:ss');

        const specificTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');

        const endTime = moment().set({ hour: 23, minute: 59, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');

        console.log('=-the date we meet++++', startTime, endTime);

        const existingReport = await ReportModel.find({
            date: {
                $gte: specificTime,
                $lt: endTime
            }
        }).sort({ date: -1 });

        const newJobEarnedReport = existingReport.filter(({ newJobEarned }) => newJobEarned);

        return res.send({ error: true, message: 'New job Earned Users found', data: newJobEarnedReport });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

export default router;
