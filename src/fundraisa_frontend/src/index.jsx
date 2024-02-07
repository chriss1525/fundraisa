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
  CardTitle, } from "./components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
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
  const navigate = useHistory();

  const handleSignIn = async () => {
    try {
      await authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: () => {
          navigate("/campaigns");
        },
        onError: (error) => {
          console.error("Failed to sign in:", error);
        },
      });
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <img alt="Logo" className="h-8" src="fundraisa_logo4.png" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Create Campaign
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Donate
          </Link>
        </nav>
      </header>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Fund the Future</h1>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Help support the next generation of innovators. Securely contribute to projects leveraging the power of
                the Internet Computer.
              </p>
            </div>
            <form className="flex flex-col gap-2 min-[400px]:flex-row sm:gap-4">
              <Button onClick={handleSignIn} size="lg">Sign In</Button>
            </form>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-300 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Fundraisa is a cutting-edge fundraising platform built on the Internet Computer, designed to democratize
              the process of raising funds for personal goals. Our mission is to make dreams a reality by connecting
              individuals with the resources they need to achieve their ambitions. With Fundraisa, you're not just
              donating money—you're investing in someone's journey towards success. Join us today and be part of a
              community that believes in the power of collective action to transform lives.
            </p>
            <form className="flex flex-col gap-2 min-[400px]:flex-row sm:gap-4">
              <Button onClick={handleSignIn} size="lg">Learn More</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
};

// list of campaigns
const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useHistory();

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
    <div className="flex flex-col items-center gap-4 pt-12" role="navigation">
      <img src="fundraisa_logo.png" alt="Fundraisa Logo" className="logo" width="100" />
    <div className="text-sm text-center">
    <Button onClick={() => navigate("/createCampaign")}>New Campaign</Button>
      <h2>Available Campaigns</h2>
      {campaigns.length >  0 ? (
        <div className="flex flex-row flex-wrap justify-between items-stretch gap-4">
          {campaigns.map((campaign, index) => (
            <Card className="bg-white shadow-xl rounded-lg w-96 max-w-md h-96 my-4 p-4 flex flex-col justify-between" key={campaign.campaignId}>
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
          ))}
        </div>
      ) : (
        <p>No campaigns available yet.</p>
      )}
    </div>
    </div>
  );
};

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
      navigate("/campaigns");
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
      <Select value={type}
    onChange={(e) => setType(e.target.value)}>
        <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Type" />
  </SelectTrigger>
  <SelectContent >
    <SelectItem value="Medical">Medical</SelectItem>
    <SelectItem value="Hobbies">Hobbies</SelectItem>
    <SelectItem value="Education">Education</SelectItem>
    </SelectContent>
</Select>
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
        <Route path="/campaigns" element={<CampaignList />} />
        <Route path="/profile" element={<profile />} />
        <Route path="/createCampaign" element={<CreateCampaign />} />
        <Route path="/campaign/:campaignId" element={<Campaign />} />
        <Route path="/donate/:campaignId" element={<Donate />} />
      </Routes>
    </Router>
  );
};

render(<App />, document.getElementById("app"));