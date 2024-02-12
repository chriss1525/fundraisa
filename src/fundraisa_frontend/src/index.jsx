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
import { 
  Actor, 
  HttpAgent, 
  IDL, 
  Principal 
} from "@dfinity/agent";
import {
  idlFactory as fundraisa_backend_idl,
  canisterId as fundraisa_backend_canister_id,
} from "../../declarations/fundraisa_backend";
import { fundraisa_backend } from "../../declarations/fundraisa_backend/index";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import Landing  from "./Landing";
import CampaignList from "./campaigns";
import Profile from "./profile";
import CreateCampaign from "./create_campaign";
import Donate from "./donate";


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




// Single campaign page
const Campaign = () => {
  return (
    <div>
      <h1>Campaign Title</h1>
      <p>Campaign Description</p>
      <Button>Donate</Button>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/createCampaign" element={<CreateCampaign />} />
        <Route path="/campaign/:campaignId" element={<Campaign />} />
        <Route path="/donate/:campaignId" element={<Donate />} />
       <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

render(<App />, document.getElementById("app"));