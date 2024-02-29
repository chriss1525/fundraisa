import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { fundraisa_backend } from "../../declarations/fundraisa_backend";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Link } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [ NationalID, setNationalID] = useState("");
    const [TelNo, setTelNo] = useState("");
    const [yearOfBirth, setYearOfBirth] = useState("");
    const [ Destination, setDestination] = useState("");
  
    const handleAddUser = async () => {
      try {
        // Assuming you have a method called addUser in your smart contract
        const payload = { 
          userName: username, 
          userNationalIdNo: NationalID, 
          userTelNo: TelNo, yearOfBirth, 
          contributionDestination: Destination 
        };
        await fundraisa_backend.addUser(payload);
        // Redirect to the landing page after adding the user
        navigate("/createCampaign");
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    }
  
    return (
      <>
      <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
          <img alt="Logo" className="" src="fundraisa_logo4.png" width="100" height="100"/>
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
      <Card className="max-w-3xl mx-auto flex flex-col items-center gap-4 pt-12">
      <CardHeader>
        <CardTitle className="text-2xl">Update Your Profile</CardTitle>
        <CardDescription>Fill in the details below to update your profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalID">National ID</Label>
          <Input
            id="nationalID"
            type="text"
            placeholder="Enter your National ID"
            value={NationalID}
            onChange={(e) => setNationalID(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telNo">Telephone Number</Label>
          <Input
            id="telNo"
            type="text"
            placeholder="Enter your Telephone Number"
            value={TelNo}
            onChange={(e) => setTelNo(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearOfBirth">Year of Birth</Label>
          <Input
            id="yearOfBirth"
            type="date"
            placeholder="Enter your Year of Birth"
            value={yearOfBirth}
            onChange={(e) => setYearOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            type="text"
            placeholder="Enter your Destination"
            value={Destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddUser}>Update Profile</Button>
      </CardFooter>
    </Card>
    </>
  );
  }

export default Profile;
