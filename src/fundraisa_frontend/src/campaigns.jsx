import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "./components/ui/button";
import { fundraisa_backend } from "../../declarations/fundraisa_backend";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

// Function to calculate the time remaining
const calculateTimeRemaining = (endTime) => {
 const difference = endTime - new Date();
 const seconds = Math.floor((difference / 1000) % 60);
 const minutes = Math.floor((difference / 1000 / 60) % 60);
 const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
 const days = Math.floor(difference / (1000 * 60 * 60 * 24));

 return {
    days,
    hours,
    minutes,
    seconds,
 };
};

const CampaignList = () => {
 const [campaigns, setCampaigns] = useState([]);
 const [timeRemaining, setTimeRemaining] = useState({});

 useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignResults = await fundraisa_backend.getCampaigns();
        setCampaigns(campaignResults.map(result => result[1]));
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
 }, []);

 useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = campaigns.reduce((acc, campaign) => {
        const endTime = new Date(campaign.campaignEndDateTime);
        acc[campaign.campaignId] = calculateTimeRemaining(endTime);
        return acc;
      }, {});
      setTimeRemaining(newTimeRemaining);
    }, 1000);
    return () => clearInterval(interval);
 }, [campaigns]);

 return (
  <>
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="#">
        <img alt="Logo" className="" src="fundraisa_logo4.png" width="100" height="100"/>
        <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/profile" className="text-sm font-medium hover:underline underline-offset-4">
            Create Campaign
            </Link>
            <Link  to="/campaigns" className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Donate
              </Link>
              </nav>
              </header>
              
              <div className="bg-gray-50/90 py-12 lg:py-24">
                <div className="container px-4 grid items-center gap-4 text-center md:px-6">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Running Fundraising Campaigns</h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed 
                    dark:text-gray-400">
                      Support these initiatives because any contribution amount makes a difference.
                      </p>
                      </div>
                      </div>
                      
                      {/* Campaigns list */}
                      <div className="container grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {campaigns.length > 0 ? (
                          campaigns.map((campaign) => (
                          <Card className="w-full max-w-sm rounded-xl border" key={campaign.campaignId}>
                            <CardHeader className="p-6">
                              <p className="text-lg font-semibold">{campaign.campaignTitle}</p>
                              <CardTitle className="text-2xl font-bold">{`$${campaign.campaignGoal}`}</CardTitle>
                              <CardDescription>Target Amount</CardDescription>
                              </CardHeader>
                              <CardContent className="flex flex-col p-6 border-t">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span>Fundraising ends on: </span>
                                    <span>{new Date(campaign.campaignEndDateTime).toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span>Time Remaining: </span>
                                      <span>
                                        {timeRemaining[campaign.campaignId] && `${timeRemaining[campaign.campaignId].days} days ${timeRemaining[campaign.campaignId].hours} hours ${timeRemaining[campaign.campaignId].minutes} minutes ${timeRemaining[campaign.campaignId].seconds} seconds`}
                                        </span>
                                        </div>
                                        <div>
                                          <span>Current Funds Raised</span>
                                          <span>{`$${campaign.campaignRaisedAmount}`}</span>
                                        </div>
                    <div className="p-6 border-t">
                      <h3 className="text-lg font-semibold mt-4">Campaign Description</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.campaignDescription}</p>
                    </div>
                 </div>
                </CardContent>
                <CardFooter className="p-6 flex justify-between items-end">
                 <Link to={`/donate/${campaign.campaignId}`}>
                    <Button>
                      Donate
                    </Button>
                 </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-center text-gray-500 dark:text-gray-400">No campaigns available yet.</p>
            </div>
          )}
        </div>
      </div>
      </>
 );
};

export default CampaignList;
