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
import { Card,
  CardContent,  
  CardFooter,
  CardDescription,
  CardTitle, } from "./components/ui/card";
import { Navigate } from "../../../node_modules/react-router-dom/dist/index";
import { AuthClient } from "@dfinity/auth-client";


// Initialize the agent
const agent = new HttpAgent();
agent.fetchRootKey();

// define navigate
const useHistory = () => {
  const navigate = useNavigate();
  return navigate;
};

const authClient = await AuthClient.create();

// Create an actor for the backend
const fundraisaBackend = Actor.createActor(fundraisa_backend_idl, {
  agent,
  canisterId: fundraisa_backend_canister_id,
});

// Define components
// Landing page make sure listed campaigns are displayed and user can signup/login
const Landing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useHistory();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Assuming you have a method called getCampaigns in your smart contract
        const campaignResults = await fundraisa_backend.getCampaigns();
        // The actual implementation depends on how your smart contract exposes the campaigns
        // For example, if getCampaigns returns an array of campaigns, you can set the state directly
        setCampaigns(campaignResults.map(result => result[1]));
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSignIn = async () => {
    try {
      // signin using internet identity
      await authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: () => {
          // Redirect to the landing page after signing in
          navigate("/profile");
        },
        onError: (error) => {
          console.error("Failed to sign in:", error);
        },
        // ...
      });
    }
    catch (error) {
      console.error("Failed to sign in:", error);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4 pt-12" role="navigation">
    <img src="fundraisa_logo.png" alt="Fundraisa Logo" className="logo" width="100" />
    <div className="text-center space-y-4" role="main">
      <div className="space-y-1">
        <h1 className="font-semibold text-3xl">Welcome to Fundraisa</h1>
        <p>Let's make fundraising easy!</p>
      </div>
      <Button onClick={handleSignIn}>SignIn
      </Button>
    </div>
    <div className="text-sm text-center">
      <h2>Available Campaigns</h2>
      {campaigns.length > 0 ? (
        <div className="flex flex-row flex-wrap justify-between items-stretch gap-4">
          {campaigns.map((campaign, index) => {
            return (
          <Card className="bg-white shadow-xl rounded-lg w-96 max-w-md h-96 
          my-4 p-4 flex flex-col justify-between" 
 key={campaign.campaignId}>
          <div className="flex flex-col items-center gap-4">
            <CardTitle className="font-semibold">{campaign.campaignTitle}</CardTitle>
            <CardContent>
            <p id={`card-describe-${index}`}>{campaign.campaignDescription}</p>
            <p>Goal: {campaign.campaignGoal}</p>
            <Button aria-describedby={`card-describe-${index}`} aria-label={`Donate to ${campaign.campaignTitle}`}>Donate</Button>
            </CardContent>
            <CardFooter>
            <p>Ends: {campaign.campaignEndDateTime}</p>
            </CardFooter>
          </div>
          </Card>
        );
          })}
        </div>
      ) : (
        <p>No campaigns available yet.</p>
      )}
    </div>
  </div>
  );
};

// sign in using internet identity
const signin = () => {
  const navigate = useHistory();
  const handleSignIn = async () => {
    try {
      // signin using internet identity
      await authClient.login({
        identityProvider: process.env.II_URL,
            onSuccess: resolve,
            onError: reject,
            // ...
      });
      // Redirect to the landing page after signing in
      navigate("/profile");
    }
    catch (error) {
      console.error("Failed to sign in:", error);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4 pt-12">
      <img src="fundraisa_logo.png" alt="Logo" className="logo" width="100" />
      <h1 className="font-semibold text-3xl">Signin</h1>
      <Button onClick={handleSignIn}>Signin</Button>
    </div>
  );
}
  

// sign up
const profile = () => {
  const navigate = useHistory();
  const [username, setUsername] = useState("");
  const [ NationalID, setNationalID] = useState("");
  const [TelNo, setTellNo] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [ Destination, setDestination] = useState("");

  const handleAddUser = async () => {
    try {
      // Assuming you have a method called addUser in your smart contract
      const payload = { userName: username, userNationalIdNo: NationalID, userTelNo: TelNo, yearOfBirth, contributionDestination: Destination };
      await fundraisaBackend.addUser(payload);
      // Redirect to the landing page after adding the user
      navigate("/createCampaign");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  }

  return (
    <div className=" bg-slate-600 flex flex-col items-center gap-4 pt-12">
      <img src="fundraisa_logo.png" alt="Logo" className="logo" width="100" />
      <div className="flex flex-col items-center gap-4 pt-12">
      <h1 className="font-semibold text-3xl">Signup</h1>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="text"
        placeholder="National ID"
        value={NationalID}
        onChange={(e) => setNationalID(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Tel No"
        value={TelNo}
        onChange={(e) => setTellNo(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Year Of Birth"
        value={yearOfBirth}
        onChange={(e) => setYearOfBirth(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Destination"
        value={Destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <Button onClick={handleAddUser}>Signup</Button>
      </div>
    </div>
  );
}

// create campaign
const CreateCampaign = () => {
  const navigate = useHistory();
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignTarget, setCampaignTarget] = useState("");
  const [Endtime, setEndtime] = useState("");
  const [type, setType] = useState("");

  const handleCreateCampaign = async () => {
    try {
      // Assuming you have a method called createCampaign in your smart contract
      const payload = { campaignTitle: campaignTitle, campaignDescription: campaignDescription, campaignGoal: parseFloat(campaignTarget), campaignEndDateTime: Endtime, campaignType: type  }
      await fundraisaBackend.addCampaign(payload);
      // Redirect to the landing page after creating the campaign
      navigate("/");
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-12">
      <img src="fundraisa_logo.png" alt="Logo" className="logo" width="100" />
      <h1 className="font-semibold text-3xl">Create Campaign</h1>
      <Input
        type="text"
        placeholder="Campaign Title"
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Campaign Description"
        value={campaignDescription}
        onChange={(e) => setCampaignDescription(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Campaign Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Campaign Target"
        value={campaignTarget}
        onChange={(e) => setCampaignTarget(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Endtime"
        value={Endtime}
        onChange={(e) => setEndtime(e.target.value)}
      />
      <Button onClick={handleCreateCampaign}>Create Campaign</Button>
    </div>
  );
}

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
        <Route path="/signin" element={<signin />} />
        <Route path="/profile" element={<profile />} />
        <Route path="/createCampaign" element={<CreateCampaign />} />
        <Route path="/campaign/:campaignId" element={<Campaign />} />
        <Route path="/donate/:campaignId" element={<Donate />} />
      </Routes>
    </Router>
  );
};

render(<App />, document.getElementById("app"));
