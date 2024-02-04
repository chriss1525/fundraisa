// Expose the important parts of main.mo code (fundraisa_backend) to Javascript (index.js)
import { fundraisa_backend } from "../../declarations/fundraisa_backend";

// Receive local host's registration objects/values
const campaignObject = JSON.parse(localStorage.getItem("campaignObject"));
const personalObject = JSON.parse(localStorage.getItem("personalObject"));
//console.log(campaignObject); //to be deleted
//console.log(personalObject); //to be deleted

// ADD FUNDRAISING CAMPAIGN DETAILS
if (campaignObject.length != 0) {
    // Prepare data (campaignPayload object) to send to backend
    const campaignGoal = parseFloat(campaignObject.cGoal);
    let campaignPlayload = {
        campaignTitle: campaignObject.cTitle,
        campaignType: campaignObject.cType,
        campaignDescription: campaignObject.cDescription,
        campaignGoal: campaignGoal,
        campaignEndDateTime: campaignObject.cEndDateTime
    };
    
    console.log(campaignPlayload); //to be deleted
    // Send data to backend
    await fundraisa_backend.addCampaign(campaignPlayload);

    // Delete local host's registration objects/values from user's browser
    localStorage.removeItem("campaignObject");

    // Get values from backend for display at frontend
    // # To do
};


// ADD USER DETAILS
if (personalObject.length != 0) {
    // Prepare data (userPayload object) to send to backend
    let userPayload = {
        userName: personalObject.userName,
        userTelNo: personalObject.userTelNo,
        yearOfBirth: personalObject.yearOfBirth,
        contributionDestination: personalObject.userAcNo
    };

    console.log(userPlayload); //to be deleted
    // Send data to backend
    await fundraisa_backend.addUser(userPayload);

    // Delete local host's registration objects/values from user's browser
    localStorage.removeItem("personalObject");

};

//#To do
//Retrieve campaing details (campaing ID, Title, Description, goal, time, goal balance etc) from backend for display
