import 'moment-timezone';
import ScoreModel from './model'
import UserModel from '../user/model'
import toObjId from '../util/toObjectType';

const moment = require('moment-timezone')

const router = require('express').Router();

router.post('/save', async (req, res) => {
    try {
        const { date, inCome, expense, userName, description, teamName, inComePayType, expensePayType } = req.body

        const score = new ScoreModel({
            date: date,
            inCome: inCome,
            expense: expense,
            userName: userName,
            description: description,
            teamName: teamName,
            inComePayType: inComePayType,
            expensePayType: expensePayType,
        })

        await score.save()

        const data = await ScoreModel.find({}, null, { sort: { createdAt: -1 } });

        const result = data.filter(({ deletedAt }) => !deletedAt);

        return res.send({ error: true, message: 'success', data: true });
    }

    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.post('/get', async (req, res) => {

    try {
        const { currentDate } = req.body;

        const startTime = moment(currentDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format();

        const endTime = moment(startTime).add(1, 'day').format();

        let aggdata = [];

        console.log('=======date====', new Date(startTime), new Date(endTime))

        aggdata = await ScoreModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: (new Date(startTime)).toISOString(),
                                $lte: (new Date(endTime)).toISOString()
                            }
                        },
                        { deletedAt: null }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: UserModel.collection.name,
                    let: { userName: "$userName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    // $eq: ["$userName", "$$fullName"]
                                    $eq: ["$$userName", { $concat: ["$lastName", " ", "$firstName"] }]
                                }
                            }
                        }
                    ],
                    as: 'UserInfo'
                }
            },
            {
                $unwind: '$UserInfo'
            }
        ]);

        const scoreData = aggdata.map(elem => {
            const ipMsgId = elem?.UserInfo?.ipMsgId;
            elem.date = moment(elem.date).format('YYYY/MM/DD');
            elem.inCome = (parseInt(elem.inCome, 10)).toLocaleString();
            elem.expense = (parseInt(elem.expense, 10)).toLocaleString();
            return { ...elem, ipMsgId };
        });

        return res.send({ error: true, message: 'success', data: scoreData });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

router.post('/update', async (req, res) => {
    try {

        const { key, row } = req.body

        const update = {
            inCome: (parseInt(row.inCome, 10)).toLocaleString(), expense: (parseInt(row.expense, 10)).toLocaleString(),
            description: row.description,
            inComePayType: row.inComePayType,
            expensePayType: row.expensePayType,
        }

        const data = await ScoreModel.findOneAndUpdate({ _id: key }, update, { new: true })

        // const result = data.filter(({ deletedAt }) => !deletedAt).sort((a, b) => a.createdAt - b.createdAt);

        for (let i = 0; i < data.length; i++) {

            data[i].date = moment(data[i].date).format('L')

        }

        if (data) {
            return res.send({ error: true, message: 'success', data: data });

        }
        return res.send({ error: true, message: 'Data not found', data: [] });
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

router.post('/getScoreData', async (req, res) => {
    try {

        const { startTime, endTime, selectedName, selectedTeamName, selectedGroupName } = req.body

        const pacificStartTime = moment(startTime).utc().format();

        const pacificEndTime = moment(endTime).utc().format();

        let teamTotalIncome = 0;
        let teamTotalExpense = 0;
        let teamTotalProfit = 0;

        if (selectedGroupName !== "All") {
            const scoreData = await ScoreModel.find({
                groupName: selectedGroupName,
            });

            const sortedData = []

            for (let i = 0; i < scoreData.length; i++) {
                if (new Date(scoreData[i].date) >= new Date(pacificStartTime) && new Date(scoreData[i].date) <= new Date(pacificEndTime)) {
                    sortedData.push(scoreData[i])
                }
            }

            let totalIncome = 0, totalExpense = 0, totalProfit = 0;

            if (sortedData && sortedData.length > 0) {

                for (let i = 0; i < sortedData.length; i++) {

                    totalIncome += parseInt(sortedData[i].inCome);

                    totalExpense += parseInt(sortedData[i].expense);

                }
                totalProfit = parseInt(totalIncome) - parseInt(totalExpense);

                return res.send({
                    data: [{
                        expense: (parseInt(totalExpense, 10)).toLocaleString(), inCome: (parseInt(totalIncome, 10)).toLocaleString(),
                        profit: (parseInt(totalProfit, 10)).toLocaleString(), userName: scoreData.userName, groupName: selectedGroupName
                    }]
                });
            }
            else {
                return res.send({ error: true, message: 'User Info not found', data: [] });
            }
        }

        if (selectedName !== "All" && selectedGroupName === "All") {

            const scoreData = await ScoreModel.find({
                userName: selectedName,
            });

            const sortedData = []

            for (let i = 0; i < scoreData.length; i++) {
                if (new Date(scoreData[i].date) >= new Date(pacificStartTime) && new Date(scoreData[i].date) <= new Date(pacificEndTime)) {
                    sortedData.push(scoreData[i])
                }
            }

            let totalIncome = 0, totalExpense = 0, totalProfit = 0;

            if (sortedData && sortedData.length > 0) {

                for (let i = 0; i < sortedData.length; i++) {

                    totalIncome += parseInt(sortedData[i].inCome);

                    totalExpense += parseInt(sortedData[i].expense);

                }
                totalProfit = parseInt(totalIncome) - parseInt(totalExpense);

                return res.send({
                    data: [{
                        expense: (parseInt(totalExpense, 10)).toLocaleString(), inCome: (parseInt(totalIncome, 10)).toLocaleString(),
                        profit: (parseInt(totalProfit, 10)).toLocaleString(), userName: selectedName, groupName: scoreData.groupName
                    }]
                });
            }
            else {
                return res.send({ error: true, message: 'User Info not found', data: [] });
            }
        }
        else if (selectedName === "All" && selectedGroupName === "All") {

            const names = await UserModel.find({ teamNo: selectedTeamName });

            const data = [];

            for (let i = 0; i < names.length; i++) {

                let totalIncome = 0, totalExpense = 0, totalProfit = 0;

                const indexName = names[i].lastName + ' ' + names[i].firstName

                const scoreData = await ScoreModel.find({
                    userName: indexName,
                })

                const sortedData = []

                for (let i = 0; i < scoreData.length; i++) {
                    if (new Date(scoreData[i].date) >= new Date(pacificStartTime) && new Date(scoreData[i].date) <= new Date(pacificEndTime)) {
                        sortedData.push(scoreData[i])
                    }
                }

                if (sortedData && sortedData.length > 0) {

                    for (let i = 0; i < sortedData.length; i++) {

                        totalIncome += parseInt(sortedData[i].inCome);
                        totalExpense += parseInt(sortedData[i].expense);

                    }

                    teamTotalIncome += totalIncome;
                    teamTotalExpense += totalExpense;
                    totalProfit = parseInt(totalIncome) - parseInt(totalExpense);
                    teamTotalProfit += totalProfit;

                    data.push({
                        inCome: (parseInt(totalIncome, 10)).toLocaleString(), expense: (parseInt(totalExpense, 10)).toLocaleString(),
                        profit: (parseInt(totalProfit, 10)).toLocaleString(), userName: indexName, groupName: names[i].groupName
                    })

                }
            }

            data.push({
                inCome: (parseInt(teamTotalIncome, 10)).toLocaleString(), expense: (parseInt(teamTotalExpense, 10)).toLocaleString(),
                profit: (parseInt(teamTotalProfit, 10)).toLocaleString(), userName: 'Total'
            })

            return res.send({
                data: data
            });
        }

    }
    catch (e) {
        return res.status(400).json({ message: e.message });

    }
})

router.post('/getAllScore', async (req, res) => {
    try {

        const { selectedMonth: { selectedMonthString } } = req.body;

        const selectedDate = new Date(selectedMonthString);
        const selectedMonthValue = selectedDate.getMonth();
        const selectedYearValue = selectedDate.getFullYear();
        const previousMonth = selectedMonthValue === 0 ? 11 : selectedMonthValue - 1;
        const previousYear = selectedMonthValue === 0 ? selectedYearValue - 1 : selectedYearValue;

        const startDate = new Date(previousYear, previousMonth, 21);
        const endDate = new Date(selectedYearValue, selectedMonthValue, 20);

        console.log('+++++++++++the date for search+++++++', startDate, endDate);

        // //determine if monthlyProfit will be saved or not
        // const dateToCompare = new Date();

        // const isDateEqualTo235959 = dateToCompare.getHours() === 23 && dateToCompare.getMinutes() === 59 && dateToCompare.getSeconds() === 59;

        const result = await ScoreModel.aggregate([
            // {
            //     $match: {
            //         date: {
            //             $gte: startDate.toISOString(),
            //             $lte: endDate.toISOString()
            //         }
            //     }
            // },
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: startDate.toISOString(),
                                $lte: endDate.toISOString()
                            }
                        },
                        { deletedAt: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: UserModel.collection.name,
                    let: { userName: "$userName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$userName", { $concat: ["$lastName", " ", "$firstName"] }]
                                }
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            {
                $project: {
                    userName: 1,
                    inComePayType: 1,
                    date: { $substr: ['$date', 0, 10] },
                    profit: {
                        $subtract: [
                            { $convert: { input: "$inCome", to: "double", onError: 0 } },
                            { $convert: { input: "$expense", to: "double", onError: 0 } }
                        ]
                    },
                    teamName: { $arrayElemAt: ['$user.teamNo', 0] },
                    groupName: { $arrayElemAt: ['$user.group', 0] },
                }
            },
            {
                $group: {
                    _id: {
                        userName: '$userName',
                        date: '$date',
                        inComePayType: '$inComePayType',
                    },
                    dailyProfit: { $sum: '$profit' },
                    teamName: { $first: '$teamName' },
                    groupName: { $first: '$groupName' }
                }
            },
            {
                $group: {
                    _id: '$_id.userName',
                    dailyProfits: { $push: { date: '$_id.date', profit: '$dailyProfit' } },
                    previousTotalProfit: { $sum: { $toDouble: { $arrayElemAt: [{ $split: ["$monthlyProfit", ": "] }, 1] } } },
                    monthlyProfit: { $sum: '$dailyProfit' },
                    teamName: { $first: '$teamName' },
                    groupName: { $first: '$groupName' },
                    inComePayTypes: { $push: { date: '$_id.date', inComePayType: '$_id.inComePayType' } },
                }
            },
            {
                $project: {
                    _id: 0,
                    userName: '$_id',
                    dailyProfits: 1,
                    monthlyProfit: 1,
                    inComePayTypes: 1,
                    totalMonthlyProfit: { $sum: '$monthlyProfit' },
                    previousTotalProfit: 1,
                    teamName: 1,
                    groupName: 1,
                }
            },
            {
                $sort: {
                    monthlyProfit: -1
                }
            }
        ]);

        let allUsertotalMonthlyProfit = 0;

        let allUsertotalAnnualProfit = 0;

        // const formattedResult = result.map((userProfit, index) => {
        //     const dailyProfitInfo = {};
        //     userProfit.dailyProfits.forEach((dailyProfit, dailyIndex) => {
        //         dailyProfitInfo[new Date(dailyProfit.date).getDate()] = (parseInt(dailyProfit.profit, 10)).toLocaleString();
        //     });

        //     allUsertotalMonthlyProfit += userProfit.monthlyProfit;

        //     // //save monthlyprofit
        //     // const monthlyProfit = userProfit.monthlyProfit;
        //     // const year = selectedYearValue.toString();
        //     // const month = (selectedMonthValue + 1).toString().padStart(2, '0');
        //     // const formattedDate = `${year}-${month}`;
        //     // const monthlyEarning = `${formattedDate}: ${monthlyProfit}`;

        //     // if (isDateEqualTo235959) {
        //     //     ScoreModel.updateOne(
        //     //         { userName: userProfit.userName },
        //     //         { $push: { monthlyProfit: monthlyEarning } }
        //     //     ).exec();
        //     // }

        //     allUsertotalAnnualProfit += userProfit.totalMonthlyProfit;

        //     return {
        //         rank: index + 1,
        //         userName: userProfit.userName,
        //         teamName: userProfit.teamName,
        //         groupName: userProfit.groupName,
        //         ...dailyProfitInfo,
        //         monthlyProfit: (parseInt(userProfit.monthlyProfit, 10)).toLocaleString(),
        //         annual: (parseInt(userProfit.totalMonthlyProfit, 10)).toLocaleString(),
        //     };
        // });

        // const totalScore = await ScoreModel.aggregate([
        //     {
        //         $group: {
        //             _id: '$userName',
        //             totalDailyProfit: { $sum: { $toDouble: { $arrayElemAt: [{ $split: ['$monthlyProfit', ': '] }, 1] } } },
        //         },
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             userName: '$_id',
        //             totalDailyProfit: 1,
        //         },
        //     },
        // ])

        // formattedResult.push({
        //     userName: "Total",
        //     monthlyProfit: (parseInt(allUsertotalMonthlyProfit, 10)).toLocaleString(),
        //     annual: (parseInt(allUsertotalAnnualProfit, 10)).toLocaleString()
        // });

        ////////////////////////////testing
        const yearFirstDay = moment(selectedDate).startOf('year');
        console.log('memmeme============', yearFirstDay);

        const resultyear = await ScoreModel.aggregate([
            // {
            //     $match: {
            //         date: {
            //             $gte: yearFirstDay.toISOString(),
            //             $lte: endDate.toISOString()
            //         }
            //     }
            // },
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: yearFirstDay.toISOString(),
                                $lte: endDate.toISOString()
                            }
                        },
                        { deletedAt: null }
                    ]
                }
            },
            {
                $lookup: {
                    from: UserModel.collection.name,
                    let: { userName: "$userName" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$userName", { $concat: ["$lastName", " ", "$firstName"] }]
                                }
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            {
                $project: {
                    userName: 1,
                    date: { $substr: ['$date', 0, 10] },
                    profit: {
                        $subtract: [
                            { $convert: { input: "$inCome", to: "double", onError: 0 } },
                            { $convert: { input: "$expense", to: "double", onError: 0 } }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        userName: '$userName'
                    },
                    dailyProfits: { $sum: '$profit' },
                }
            },
            {
                $project: {
                    _id: 0,
                    userName: '$_id',
                    dailyProfits: 1,
                }
            }
        ]);

        const formattedResult = result.map((userProfit, index) => {
            const dailyProfitInfo = {};
            const dailyPayType = {}
            userProfit.dailyProfits.forEach((dailyProfit, dailyIndex) => {
                dailyProfitInfo[new Date(dailyProfit.date).getDate()] = (parseInt(dailyProfit.profit, 10)).toLocaleString();
            });

            // userProfit.inComePayTypes.forEach((inComePayType, index) => {
            //     dailyPayType[new Date(inComePayType.date).getDate().toString() + '00'] = inComePayType.inComePayType;
            // })

            allUsertotalMonthlyProfit += userProfit.monthlyProfit;

            userProfit.totalMonthlyProfit = resultyear.find((elem) => elem.userName.userName === userProfit.userName)?.dailyProfits;

            allUsertotalAnnualProfit += userProfit.totalMonthlyProfit;

            return {
                rank: index + 1,
                userName: userProfit.userName,
                teamName: userProfit.teamName,
                groupName: userProfit.groupName,
                inComePayType: userProfit.inComePayType,
                ...dailyProfitInfo,
                // ...dailyPayType,
                monthlyProfit: (parseInt(userProfit.monthlyProfit, 10)).toLocaleString(),
                annual: (parseInt(userProfit.totalMonthlyProfit, 10)).toLocaleString(),
            };
        });

        formattedResult.push({
            userName: "Total",
            monthlyProfit: (parseInt(allUsertotalMonthlyProfit, 10)).toLocaleString(),
            annual: (parseInt(allUsertotalAnnualProfit, 10)).toLocaleString()
        });
        ////////////////////////////testing end

        return res.send({
            data: formattedResult,
            data1: resultyear
        });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})


router.post('/delete', async (req, res) => {
    try {
        const { id: { rowId } } = req.body;

        console.log('we are here', rowId)

        const update = { deletedAt: Date.now() };

        const result = await ScoreModel.findByIdAndUpdate(toObjId(rowId), update, { new: true });

        if (result) {
            return res.send({ error: false, message: 'Score deleted', data: result });
        } else {
            return res.send({ error: true, message: 'Score not found' });
        }

    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }

})

router.get('/getAllScoreforDisplay', async (req, res) => {
    try {

        const currentDate = moment();
        const selectedMonthValue = currentDate.month();
        const selectedYearValue = currentDate.year();
        const previousMonth = selectedMonthValue === 0 ? 11 : selectedMonthValue - 1;
        const previousYear = selectedMonthValue === 0 ? selectedYearValue - 1 : selectedYearValue;

        const startDate = moment([previousYear, previousMonth, 21]).format('YYYY-MM-DD hh:mm:ss');
        const endDate = moment([selectedYearValue, selectedMonthValue, 20]).format('YYYY-MM-DD hh:mm:ss');

        console.log('++++++++the date we meet+++++', startDate, endDate);

        const result = await UserModel.aggregate([
            {
                $match: {
                    role: "General"
                }
            },
            {
                $lookup: {
                    from: ScoreModel.collection.name,
                    let: { userName: { $concat: ["$lastName", " ", "$firstName"] } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userName", "$$userName"],
                                },
                                date: { $gte: startDate, $lte: endDate }
                            },
                        },
                        {
                            $group: {
                                _id: "$userName",
                                dailyProfit: {
                                    $sum: {
                                        $subtract: [
                                            {
                                                $convert: { input: "$inCome", to: "double", onError: 0 },
                                            },
                                            {
                                                $convert: { input: "$expense", to: "double", onError: 0 },
                                            },
                                        ],
                                    },
                                },
                                monthlyProfit: {
                                    $sum: {
                                        $sum: "$dailyProfit",
                                    },
                                },
                            },
                        },
                    ],
                    as: "scores",
                },
            },
            {
                $unwind: {
                    path: "$scores",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    userName: { $first: { $concat: ["$lastName", " ", "$firstName"] } },
                    teamName: { $first: "$teamNo" }, // Add this line to include teamName
                    dailyProfits: { $push: { date: "$scores.date", profit: "$scores.dailyProfit" } },
                    monthlyProfit: { $sum: "$scores.dailyProfit" },
                },
            },
            {
                $project: {
                    _id: 0,
                    userName: 1,
                    teamName: 1, // Include teamName in the projection
                    dailyProfits: 1,
                    monthlyProfit: { $ifNull: ["$monthlyProfit", 0] },
                    totalMonthlyProfit: { $sum: "$monthlyProfit" },
                },
            },
            {
                $sort: {
                    monthlyProfit: -1,
                },
            },
        ]);

        let allUserTotalMonthlyProfit = 0;
        let allUserTotalAnnualProfit = 0;

        const formattedResult = result.map((userProfit, index) => {
            const dailyProfitInfo = {};
            userProfit.dailyProfits.forEach((dailyProfit, dailyIndex) => {
                dailyProfitInfo[dailyProfit.date ? new Date(dailyProfit.date).getDate() : '0000'] = parseInt(
                    dailyProfit.profit ? dailyProfit.profit : 0,
                    10
                ).toLocaleString();
            });

            allUserTotalMonthlyProfit += userProfit.monthlyProfit;
            allUserTotalAnnualProfit += userProfit.totalMonthlyProfit;

            return {
                rank: index + 1,
                userName: userProfit.userName,
                teamName: userProfit.teamName, // Include teamName in the result
                ...dailyProfitInfo,
                monthlyProfit: parseInt(userProfit.monthlyProfit, 10).toLocaleString(),
                annual: parseInt(userProfit.totalMonthlyProfit, 10).toLocaleString(),
            };
        });

        // formattedResult.push({
        //     userName: "Total",
        //     monthlyProfit: parseInt(allUserTotalMonthlyProfit, 10).toLocaleString(),
        //     annual: parseInt(allUserTotalAnnualProfit, 10).toLocaleString(),
        // });

        //from here, calculate monthly profit.


        const resultMonth = await UserModel.aggregate([
            {
                $match: {
                    role: "General"
                }
            },
            {
                $lookup: {
                    from: ScoreModel.collection.name,
                    let: { userName: { $concat: ["$lastName", " ", "$firstName"] } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userName", "$$userName"],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: "$userName",
                                dailyProfit: {
                                    $sum: {
                                        $subtract: [
                                            {
                                                $convert: { input: "$inCome", to: "double", onError: 0 },
                                            },
                                            {
                                                $convert: { input: "$expense", to: "double", onError: 0 },
                                            },
                                        ],
                                    },
                                },
                                monthlyProfit: {
                                    $sum: {
                                        $sum: "$dailyProfit",
                                    },
                                },
                            },
                        },
                    ],
                    as: "scores",
                },
            },
            {
                $unwind: {
                    path: "$scores",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    userName: { $first: { $concat: ["$lastName", " ", "$firstName"] } },
                    teamName: { $first: "$teamNo" }, // Add this line to include teamName
                    dailyProfits: { $push: { date: "$scores.date", profit: "$scores.dailyProfit" } },
                    monthlyProfit: { $sum: "$scores.dailyProfit" },
                },
            },
            {
                $project: {
                    _id: 0,
                    userName: 1,
                    teamName: 1, // Include teamName in the projection
                    dailyProfits: 1,
                    monthlyProfit: { $ifNull: ["$monthlyProfit", 0] },
                    totalMonthlyProfit: { $sum: "$monthlyProfit" },
                },
            },
            {
                $sort: {
                    monthlyProfit: -1,
                },
            },
        ]);

        const formattedResultMonth = resultMonth.map((userProfit, index) => {
            const dailyProfitInfo = {};
            userProfit.dailyProfits.forEach((dailyProfit, dailyIndex) => {
                dailyProfitInfo[dailyProfit.date ? new Date(dailyProfit.date).getDate() : '0000'] = parseInt(
                    dailyProfit.profit ? dailyProfit.profit : 0,
                    10
                ).toLocaleString();
            });

            allUserTotalMonthlyProfit += userProfit.monthlyProfit;
            allUserTotalAnnualProfit += userProfit.totalMonthlyProfit;

            return {
                rank: index + 1,
                userName: userProfit.userName,
                teamName: userProfit.teamName, // Include teamName in the result
                ...dailyProfitInfo,
                monthlyProfit: parseInt(userProfit.monthlyProfit, 10).toLocaleString(),
                annual: parseInt(userProfit.totalMonthlyProfit, 10).toLocaleString(),
            };
        });

        return res.send({
            data: { formattedResult, formattedResultMonth },
        });

    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

export default router;
