import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { fundraisa_backend } from "../../declarations/fundraisa_backend";
import { useNavigate } from "react-router-dom";

const profile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [ NationalID, setNationalID] = useState("");
    const [TelNo, setTellNo] = useState("");
    const [yearOfBirth, setYearOfBirth] = useState("");
    const [ Destination, setDestination] = useState("");
  
    const handleAddUser = async () => {
      try {
        // Assuming you have a method called addUser in your smart contract
        const payload = { userName: username, userNationalIdNo: NationalID, userTelNo: TelNo, yearOfBirth, contributionDestination: Destination };
        await fundraisa_backend.addUser(payload);
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

export default profile;