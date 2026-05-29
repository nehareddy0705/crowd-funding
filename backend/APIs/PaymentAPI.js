// PaymentAPI.js

import exp from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { verifyToken } from '../middlewares/verifyToken.js';
import { CampaignModel } from '../models/CampaignModel.js';
import { DonationModel } from '../models/DonationModel.js';

export const paymentApp = exp.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
paymentApp.post('/create-order', verifyToken("DONOR", "FUNDRAISER", "ADMIN"), async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId) {
      return res.status(400).json({ message: "Campaign ID is required" });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Check if campaign exists and is active
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (campaign.status !== "APPROVED") {
      return res.status(400).json({ message: "Campaign is not approved" });
    }
    if (new Date() > new Date(campaign.deadline)) {
      return res.status(400).json({ message: "Campaign deadline has passed" });
    }

    // Create order options
    const options = {
      amount: Math.round(amount * 100), // convert to paise and make sure it is integer
      currency: 'INR',
      receipt: `receipt_${campaignId.substring(0, 10)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({
      message: "Order created successfully",
      payload: order
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Verify Razorpay Payment Signature
paymentApp.post('/verify', verifyToken("DONOR", "FUNDRAISER", "ADMIN"), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      campaignId,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !campaignId || !amount) {
      return res.status(400).json({ message: "Missing required verification parameters" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // Prevent duplicate donation record for the same payment
    const duplicateCheck = await DonationModel.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (duplicateCheck) {
      return res.status(400).json({ message: "Donation already processed for this payment" });
    }

    // Save the donation in MongoDB
    const donation = await DonationModel.create({
      userId: req.user.id,
      donorId: req.user.id,
      campaignId,
      amount: Number(amount),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    // Increment campaign amountRaised/raisedAmount and donorCount
    await CampaignModel.findByIdAndUpdate(campaignId, {
      $inc: {
        raisedAmount: Number(amount),
        donorCount: 1
      }
    });

    res.status(201).json({
      message: "Payment verified and donation completed successfully",
      payload: donation
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message });
  }
});
