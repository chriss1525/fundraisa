// index.jsx
import "./main.css";
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Link } from "react-router-dom";
import { Actor, HttpAgent, IDL, Principal } from "@dfinity/agent";
import {
  idlFactory as fundraisa_backend_idl,
  canisterId as fundraisa_backend_canister_id,
} from "../../declarations/fundraisa_backend";
import { fundraisa_backend } from "../../declarations/fundraisa_backend/index";
import { Button } from "./components/ui/button";

// Initialize the agent
const agent = new HttpAgent();
agent.fetchRootKey();

// define navigate
const useHistory = () => {
  const navigate = useNavigate();
  return navigate;
};

// Create an actor for the backend
const fundraisaBackend = Actor.createActor(fundraisa_backend_idl, {
  agent,
  canisterId: fundraisa_backend_canister_id,
});

// Define components
// Landing page make sure listed campaigns are displayed and user can signup/login
const Landing = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Assuming you have a method called getCampaigns in your smart contract
        const campaignResults = await fundraisa_backend.getCampaigns();
        // The actual implementation depends on how your smart contract exposes the campaigns
        // For example, if getCampaigns returns an array of campaigns, you can set the state directly
        setCampaigns(campaignResults);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 pt-12">
      <img src="fundraisa_logo.png" alt="Logo" className="logo" width="200" />
      <div className="text-center space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-3xl">Welcome to Fundraisa</h1>
          <p>Let's make fundraising easy!</p>
        </div>
        <Button>
          <Link to="/addUser">Signup</Link>
        </Button>
      </div>
      <div className="text-sm text-center">
        <h2>Available Campaigns</h2>
        {campaigns.length > 0 ? (
          <div className="campaign-grid">
            {campaigns.map((campaign) => (
              <div className="campaign-card" key={campaign.campaignId}>
                <h3>{campaign.campaignTitle}</h3>
                <p>{campaign.campaignDescription}</p>
                <button> Donate </button>
                {/* Render other campaign details as needed */}
              </div>
            ))}
          </div>
        ) : (
          <p>No campaigns available yet.</p>
        )}
      </div>
    </div>
  );
};

// Single campaign page
const Campaign = () => {
  return (
    <div>
      <h1>Campaign Title</h1>
      <p>Campaign Description</p>
      <button>Donate</button>
    </div>
  );
};

// donation page
const Donate = () => {
  return (
    <div>
      <h1>Donate</h1>
      <p>Choose an amount to donate</p>
      <input type="number" />
      <button>Donate</button>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* 
        <Route path="/addUser" element={<AddUser />} />
        */}
      </Routes>
    </Router>
  );
};

render(<App />, document.getElementById("app"));
