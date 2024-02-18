// create campaign
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import { fundraisa_backend } from "../../declarations/fundraisa_backend";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignTarget, setCampaignTarget] = useState("");
  const [Endtime, setEndtime] = useState("");
  const [type, setType] = useState("");

  const handleCreateCampaign = async () => {
    try {
      // Assuming you have a method called createCampaign in your smart contract
      const payload = {
        campaignTitle: campaignTitle, 
        campaignDescription: campaignDescription, 
        campaignGoal: parseFloat(campaignTarget), 
        campaignEndDateTime: Endtime, 
        campaignType: type
      }

      await fundraisa_backend.addCampaign(payload);
      // Redirect to the landing page after creating the campaign
      navigate("/campaigns");
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
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
        <CardHeader className="items-center">
          <CardTitle className="text-2xl">Create a new campaign</CardTitle>
          <CardDescription>Fill in the details below to create your new campaign.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              placeholder="Enter the title"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Campaign Type</Label>
            <Input list="type" placeholder="Select Type [Political Fundraising is NOT allowed]"/>
              <datalist 
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                >
                <option value="Children Education"/>
                <option value="Wedding"/>
                <option value="Berievement"/>
                <option value="Business Activity"/>
                <option value="Health"/>
                <option value="Building a Home"/>
                <option value="Other (Non-Political)"/>
              </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              placeholder="Enter the description"
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Campaign Goal</Label>
            <Input
              id="goal"
              placeholder="Enter the goal"
              value={campaignTarget}
              onChange={(e) => setCampaignTarget(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label for="endtime">Set Campaign End Date & Time</Label>
            <Input
              type="datetime-local"
              id="endtime"
              value={Endtime}
              onChange={(e) => setEndtime(e.target.value)}
              required
            />
          </div>

        </CardContent>
        <CardFooter className="items-end">
          <Button onClick={handleCreateCampaign} className="items-end">Create Campaign</Button>
        </CardFooter>
      </Card>
    </>
  );
}
export default CreateCampaign;
