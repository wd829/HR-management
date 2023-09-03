import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './util/logger';
import config from './config';
import Middlewares from './api/middlewares'
import Authentication from './api/authentication'
import UserRouter from './user/router'
import ReportRouter from './report/router'
import SettignRouter from './team/router'
import ScoreRouter from './score/router'
import TeamRouter from './team/router'
// import cookieParser from 'cookie-parser';
import GroupSettingRouter from './group/router';
import PayTypeRouter from './payType/router';
import AlarmRouter from './alarm/router';
import UserStatusRouter from './userStatus/router'

const moment = require('moment-timezone');

if (!process.env.JWT_SECRET) {
    const err = new Error('No JWT_SECRET in env variable, check instructions: https://github.com/amazingandyyy/mern#prepare-your-secret');
    logger.warn(err.message);
}

const app = express();

mongoose.connect(config.mongoose.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => console.error(err));

mongoose.Promise = global.Promise;

// App Setup
app.use(cors({
    origin: '*',
    // credentials: true
}));

app.use(morgan('dev'));
app.use(express.json())
// app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.get('/ping', (req, res) => res.send('pong'))
app.get('/', (req, res) => res.json({ 'source': 'https://github.com/amazingandyyy/mern' }))
app.post('/signUp', Authentication.signup)
app.post('/login', Authentication.signin)
app.post('/resetpassword', Authentication.resetPassword)

app.get('/auth-ping', Middlewares.loginRequired, (req, res) => res.send('connected'))
app.use('/user', Middlewares.loginRequired, UserRouter)
app.use('/report', Middlewares.loginRequired, ReportRouter)
app.use('/setting', Middlewares.loginRequired, SettignRouter)
app.use('/settingGroup', Middlewares.loginRequired, GroupSettingRouter)
app.use('/pay', Middlewares.loginRequired, PayTypeRouter);

app.use('/userStatus', Middlewares.loginRequired, UserStatusRouter);

app.use('/team', Middlewares.loginRequired, TeamRouter);
app.use('/score', Middlewares.loginRequired, ScoreRouter);
app.use('/alarm', Middlewares.loginRequired, AlarmRouter);

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(422).json(err.message);
});

// Server Setup
const port = process.env.PORT || 8000;

app.listen(port, () => {
    logger.info(`Server listening on: ${port}`)
});
