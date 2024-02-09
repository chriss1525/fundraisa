import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "./components/ui/button";
import { fundraisa_backend } from "../../declarations/fundraisa_backend";


// list of campaigns
const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);
  
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
  
    return (
      <>
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <img alt="Logo" className="h-8" src="fundraisa_logo4.png" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link to="/profile" className="text-sm font-medium hover:underline underline-offset-4">
              Create Campaign
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Donate
            </Link>
          </nav>
        </header>
        <div className="bg-gray-50/90 py-12 lg:py-24">
          <div className="container px-4 grid items-center gap-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Campaigns</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Support our initiatives. Every contribution makes a difference.
              </p>
            </div>
          </div>
          <div className="container grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.length >  0 ? (
              campaigns.map((campaign, index) => (
                <div key={campaign.campaignId} className="flex flex-col rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow transition-transform hover:scale-105 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:shadow-sm dark:hover:shadow dark:hover:scale-105 dark:focus-within:ring-gray-300">
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight">{campaign.campaignTitle}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.campaignDescription}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Campaign ends on: {campaign.campaignEndDateTime}</p>
                    </div>
                    <Button
                    >
                      Donate
                    </Button>
                  </div>
                </div>
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