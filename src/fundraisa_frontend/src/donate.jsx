import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fundraisa_backend } from '../../declarations/fundraisa_backend';
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
        const payload = {donorName: name, campaignId: campaignId, donatedAmount: parseFloat(amount) }
        await fundraisa_backend.addCampaign(payload);
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
