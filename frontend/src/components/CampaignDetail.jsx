import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Check, FileText, X } from "lucide-react";
import * as theme from "../styles/Common";
import { API_BASE_URL } from "../config/api";
import { getCampaignImage } from "../utils/campaignImages";
import { useAuth } from "../store/authStore";
import axios from "axios";

// Helper to load external scripts (Razorpay Checkout SDK)
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CampaignDetail() {
  const { id } = useParams();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaign-api/campaign/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCampaign(data.payload);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCampaign();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return;

    setDonating(true);
    setDonationMessage("");

    try {
      const amount = parseInt(donationAmount);
      if (isNaN(amount) || amount <= 0) {
        setDonationMessage("Please enter a valid donation amount.");
        setDonating(false);
        return;
      }

      // 1. Load Razorpay Checkout SDK
      const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isScriptLoaded) {
        setDonationMessage("Failed to load payment gateway. Please check your internet connection.");
        setDonating(false);
        return;
      }

      // 2. Create Razorpay order on backend
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/payment/create-order`,
        { campaignId: id, amount },
        { withCredentials: true }
      );
      
      const order = orderResponse.data.payload;

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CrowdFund",
        description: `Donation for "${campaign.title}"`,
        order_id: order.id,
        handler: async function (response) {
          try {
            setDonating(true);
            setDonationMessage("Verifying payment transaction...");

            // 4. Verify payment signature on backend
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                campaignId: id,
                amount: amount,
              },
              { withCredentials: true }
            );

            if (verifyResponse.status === 201) {
              setDonationMessage("Donation successful! Thank you for your support.");
              // 5. Refresh campaign details
              const updatedCampaign = await axios.get(`${API_BASE_URL}/campaign-api/campaign/${id}`);
              if (updatedCampaign.status === 200) {
                setCampaign(updatedCampaign.data.payload);
              }
              setDonationAmount("");
            } else {
              setDonationMessage("Payment verification failed.");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            setDonationMessage(verifyError.response?.data?.message || "Payment verification failed.");
          } finally {
            setDonating(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile || "",
        },
        theme: {
          color: "#E27B66", // Consistent peach terracotta theme color
        },
        modal: {
          ondismiss: function () {
            setDonating(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        setDonationMessage(`Payment failed: ${response.error.description}`);
        setDonating(false);
      });
      rzp1.open();

    } catch (error) {
      console.error("Donation initialization error:", error);
      setDonationMessage(error.response?.data?.message || "Failed to initiate payment. Please try again.");
      setDonating(false);
    }
  };

  const updateCampaignStatus = async (action) => {
    setReviewing(true);
    setReviewMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin-api/campaigns/${action}/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
        setCampaign((prev) => ({ ...prev, ...data.payload, status: data.payload?.status || nextStatus }));
        setReviewMessage(`Campaign ${nextStatus.toLowerCase()}.`);
      } else {
        setReviewMessage(data.message || "Unable to update campaign.");
      }
    } catch (error) {
      console.error("Campaign review error:", error);
      setReviewMessage("Something went wrong while updating the campaign.");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className={theme.pageBackground + " min-h-screen flex items-center justify-center"}>
        <p className={theme.loading}>Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className={theme.pageBackground + " min-h-screen"}>
        <div className={theme.pageWrapper}>
          <p className={theme.emptyState}>Campaign not found</p>
          <NavLink to="/campaigns" className={theme.btnPrimary}>
            Back to Campaigns
          </NavLink>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(
    (campaign.raisedAmount || 0) / (campaign.goalAmount || 1) * 100,
    100
  );
  const isAdmin = user?.role === "ADMIN";
  const canDonate = isAuthenticated && campaign.status === "APPROVED";

  return (
    <main className={theme.pageBackground + " min-h-screen"}>
      <div className={theme.pageWrapper}>
        {/* Campaign Image */}
        <div className="mb-8 rounded-3xl border border-peach-light/30 overflow-hidden h-96 bg-peach-light/10 shadow-md">
          <img
            src={getCampaignImage(campaign)}
            alt={campaign.title || "Campaign"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className={theme.pageTitle + " mb-4"}>{campaign.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {campaign.status && (
                <div>
                  <p className={theme.campaignMeta}>Status</p>
                  <p className={
                    campaign.status === "APPROVED"
                      ? theme.statusActive
                      : campaign.status === "PENDING"
                      ? theme.statusPending
                      : theme.statusRejected
                  }>
                    {campaign.status}
                  </p>
                </div>
              )}
              {campaign.deadline && (
                <div>
                  <p className={theme.campaignMeta}>Deadline</p>
                  <p className={theme.body}>
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className={theme.divider}></div>

            <h2 className={theme.heading + " mb-4"}>About This Campaign</h2>
            <p className={theme.body + " mb-8"}>{campaign.description}</p>

            {campaign.story && (
              <>
                <h2 className={theme.heading + " mb-4"}>The Story</h2>
                <p className={theme.body + " mb-8"}>{campaign.story}</p>
              </>
            )}

            {campaign.proofFiles?.length > 0 && (
              <>
                <h2 className={theme.heading + " mb-4"}>Proof Files</h2>
                <div className="mb-8 flex flex-wrap gap-3">
                  {campaign.proofFiles.map((file, index) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-peach-light/70 bg-white px-4 py-2.5 text-sm font-bold text-brand-body hover:border-peach-terracotta hover:text-peach-terracotta transition-colors"
                    >
                      <FileText size={16} />
                      {file.name || `Proof ${index + 1}`}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Donation Sidebar */}
          <div>
            <div className={theme.card + " sticky top-24"}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className={theme.campaignAmount}>
                    ₹{Number(campaign.raisedAmount || 0).toLocaleString()}
                  </p>
                  <p className={theme.muted}>of ₹{Number(campaign.goalAmount || 0).toLocaleString()}</p>
                </div>
                <div className={theme.progressBar}>
                  <div
                    className={theme.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className={theme.muted + " mt-2"}>
                  {progressPercent.toFixed(0)}% funded
                </p>
              </div>

              <p className={theme.body + " mb-6 text-center text-sm"}>
                <strong>{campaign.donorCount || campaign.donorsCount || 0}</strong> supporters believed in this cause
              </p>

              <div className={theme.divider}></div>

              {isAdmin && (
                <>
                  <div className="space-y-4">
                    <p className={theme.campaignMeta}>Admin Review</p>
                    {campaign.status === "PENDING" ? (
                      <div className="grid gap-3">
                        <button
                          type="button"
                          disabled={reviewing}
                          onClick={() => updateCampaignStatus("approve")}
                          className={theme.btnPrimary + " w-full gap-2"}
                        >
                          <Check size={16} /> Approve Campaign
                        </button>
                        <button
                          type="button"
                          disabled={reviewing}
                          onClick={() => updateCampaignStatus("reject")}
                          className={theme.btnSecondary + " w-full gap-2"}
                        >
                          <X size={16} /> Reject Campaign
                        </button>
                      </div>
                    ) : (
                      <p className={theme.emptyState}>Review complete: {campaign.status}</p>
                    )}
                    {reviewMessage && (
                      <p className={reviewMessage.includes("Unable") || reviewMessage.includes("wrong") ? theme.error : theme.success}>
                        {reviewMessage}
                      </p>
                    )}
                  </div>
                  <div className={theme.divider}></div>
                </>
              )}

              {canDonate ? (
                <>
                  {/* Donation Form */}
                  <form onSubmit={handleDonate} className="space-y-4">
                    <div className={theme.formGroup}>
                      <label className={theme.label}>Donation Amount (₹)</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className={theme.input}
                        placeholder="Enter amount"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={donating || !donationAmount}
                      className={theme.btnPrimary + " w-full"}
                    >
                      {donating ? "Processing..." : "Donate Now"}
                    </button>

                    {donationMessage && (
                      <p
                        className={
                          donationMessage.includes("successful")
                            ? theme.success
                            : theme.error
                        }
                      >
                        {donationMessage}
                      </p>
                    )}
                  </form>

                  <p className={theme.muted + " text-center text-xs mt-4"}>
                    Your donation will make a difference
                  </p>
                </>
              ) : !isAuthenticated ? (
                <div className="space-y-4">
                  <p className={theme.bodySmall + " text-center"}>
                    Create an account to continue with your donation.
                  </p>
                  <NavLink to="/register" className={theme.btnPrimary + " w-full"}>
                    Get Started to Donate
                  </NavLink>
                </div>
              ) : (
                <p className={theme.emptyState}>
                  Donations open after this campaign is approved.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <NavLink to={isAdmin ? "/admin-dashboard" : "/campaigns"} className={theme.btnSecondary}>
            {isAdmin ? "Back to Admin Dashboard" : "Back to Campaigns"}
          </NavLink>
        </div>
      </div>
    </main>
  );
}

export default CampaignDetail;
