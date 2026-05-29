//DonationModel.js

import { Schema, model, Types } from "mongoose";

const DonationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "user"
    },
    donorId: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    campaignId: {
        type: Types.ObjectId,
        ref: "campaign",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, "Donation amount must be greater than 0"]
    },
    paymentId: {
        type: String
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    }
},{ 
    timestamps: true,
    versionKey:false
})

export const DonationModel = model("donation", DonationSchema)
