import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fundraisa_backend } from '../../declarations/fundraisa_backend';
import { donors } from '../../declarations/donors';
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Link } from 'react-router-dom';


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
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center">

        <Link className="flex items-center justify-center" href="#">
        <img alt="Logo" className="" src="9-logo5.png" width="255" height="255"/>
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/createCampaign" className="text-sm font-medium hover:underline underline-offset-4">
            Create Campaign
          </Link>
          <Link to="/campaigns" className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Donate
          </Link>
        </nav>
      </header>

      <Card className="max-w-3xl mx-auto flex flex-col items-center gap-4 pt-12">
        <CardHeader>
          <CardTitle className="text-2xl">Donate Now</CardTitle>
          <CardDescription>Enter your information below to make a donation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="donor-name">Your Name</Label>
            <Input
              id="donor-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter the amount"
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            Donate
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </CardContent>
      </Card>
    </>
  );
};

export default DonatePage;
