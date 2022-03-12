const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const hotp = require('otplib').hotp;
const UserModel = require('../models/user.model');
const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, OTP_SECRET, TWILIO_MESSAGING_SERVICE_SID} = require("../common/config");
const {createJwtToken} = require("../utils/token.util");
const RewardModel = require("../models/reward.model");

async function updateReferral(referrer, referee) {
    const user = await UserModel.findById(referrer);
    if (!user) {
        return false;
    }
    let rewardObj = await RewardModel.findOne({ user: referrer });
    if (!rewardObj) {
        rewardObj = new RewardModel({
            user: referrer,
            rewards: [],
            referees: []
        });
    }
    rewardObj.referees.push(referee);
    await rewardObj.save();
    return true;
}

async function generateOTP(user) {
    user.phone.counter++;
    await user.save();
    const token = hotp.generate(OTP_SECRET, user.phone.counter);
    const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    await client.messages.create(
        {
            body: `Dear user, Your 6-digit OTP is ${token} for early access to the app.`,
            to: user.phone.number,
            messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID
        }
    )
    return user;
}

router.post('/requestOTP', async (req, res) => {
    const {phone} = req.body;
    let user = await UserModel.findOne({"phone.number": phone});
    if (!user) {
        user = new UserModel({phone: {number: phone}});
    }
    await generateOTP(user);
    return res.status(200).json({
        type: 'success',
        message: 'OTP sent successfully',
    });
});

router.post('/verifyOTP', async (req, res) => {
    const {phone, otp, referrer} = req.body;
    let user = await UserModel.findOne({"phone.number": phone});
    if (!user) {
        return next({
            status: 400,
            message: 'User does not exist'
        });
    }
    const counter = user.phone.counter;
    const verified = hotp.check(otp, OTP_SECRET, counter);
    if (!verified) {
        return next({
            status: 400,
            message: 'OTP is invalid'
        });
    }
    let referred = false;
    // refer only on first successful login
    if (referrer && user.phone.counter === 1) {
        referred = await updateReferral(referrer, user._id);
    }
    return res.status(200).json({
        type: 'success',
        message: 'OTP verified successfully',
        referralStatus: {
            referrer: !!referrer,
            referred: referred
        },
        isRegistered: user.isRegistered,
        data: {token: createJwtToken({_id: user._id})},
    });
});

module.exports = router;
