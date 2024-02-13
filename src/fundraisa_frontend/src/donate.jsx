import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fundraisa_backend } from '../../declarations/fundraisa_backend';
import { donors } from '../../declarations/donors';
import { useNavigate } from "react-router-dom";

const DonatePage = () => {
    const navigate = useNavigate();
  const { campaignId } = useParams(); // Get the campaignId from the URL params
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignResult = await fundraisa_backend.getCampaign(campaignId);
        // Assuming campaignResult is an array with a single object, we take the first element
        setCampaign(campaignResult[0]);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      }
    };
  
    fetchCampaign();
  }, [campaignId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
        //1. capture donor details
        const donor = {donorName: name, campaignId: campaignId, donatedAmount: parseFloat(amount) };

        //3. Get campaignId's record from backend
        const campaignData = await fundraisa_backend.getCampaign(campaignId);

        //2. calculate campaign raised amount
        const availableCampaignAmount = parseFloat(campaignData[0]["campaignRaisedAmount"]);
        const currentDonationAmount = parseFloat(amount);
        const campaignRaisedAmount = availableCampaignAmount + currentDonationAmount;

        //3. Prepare updated campaignId's data to send to backend - here we are updating the campaign's raised amount
        let updatedCampaignIdRecord = {
          campaignId: campaignId,
          campaignTitle: campaignData[0]["campaignTitle"],
          campaignType: campaignData[0]["campaignType"],
          campaignDescription: campaignData[0]["campaignDescription"],
          campaignGoal: campaignData[0]["campaignGoal"],
          campaignEndDateTime: campaignData[0]["campaignEndDateTime"],
          campaignRaisedAmount: campaignRaisedAmount,
          campaignEnded: campaignData[0]["campaignEnded"]
        };
        
        //4. store the donor and updated campaign Id's record back to their store
        await donors.donateToCampaign(donor, updatedCampaignIdRecord);
        navigate("/campaigns")
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>; // Or some loading indicator
  }

  return (
    <div>
      {campaign ? (
        <>
          <h1> Donate to {campaign.campaignTitle} </h1>
          <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter donation amount"
            />
            <button type="submit" disabled={isLoading}>
              Donate
            </button>
          </form>
          {error && <p>{error}</p>}
        </>
      ) : (
        <div>Loading...</div> // Or some loading indicator
      )}
    </div>
  );  
};

export default DonatePage;
