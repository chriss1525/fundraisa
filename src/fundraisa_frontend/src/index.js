// LINK BETWEENE FRONT END AND BACK END

// Expose the important parts of main.mo code (fundraisa_backend) to Javascript (index.js)
import { fundraisa_backend } from "../../declarations/fundraisa_backend";

document.addEventListener('DOMContentLoaded', async function() { 
    // DATA PROCESSING
    // Receive local host's registration values/objects
    const campaignObject = JSON.parse(localStorage.getItem("campaignObject"));
    const personalObject = JSON.parse(localStorage.getItem("personalObject"));
    //console.log(campaignObject); //to be deleted
    //console.log(personalObject); //to be deleted

    // ADD FUNDRAISING CAMPAIGN DETAILS
    if (campaignObject.length != 0) {
        // Prepare data (campaignPayload object) to send to backend
        let campaignGoal = parseFloat(campaignObject.cGoal);
        let campaignPlayload = {
            campaignTitle: campaignObject.cTitle,
            campaignType: campaignObject.cType,
            campaignDescription: campaignObject.cDescription,
            campaignGoal: campaignGoal,
            campaignEndDateTime: campaignObject.cEndDateTime,
        };
        
        // Send data to backend
        await fundraisa_backend.addCampaign(campaignPlayload);

        // Delete campaign details from local host's browser
        localStorage.removeItem("campaignObject");
    };

    // ADD USER DETAILS
    if (personalObject.length != 0) {
        // Prepare data (userPayload object) to send to backend
        const userPayload = {
            userName: personalObject.userName,
            userNationalIdNo: personalObject.userNationalIdNo,
            userTelNo: personalObject.userTelNo,
            yearOfBirth: personalObject.yearOfBirth,
            contributionDestination: personalObject.userAcNo
        };

        // Send data to backend
        await fundraisa_backend.addUser(userPayload);

        // Delete user's registration values from local host's browser
        localStorage.removeItem("personalObject");
    };

    console.log("Finished sending data to backend"); // to be deleted


    // GET DATA FROM BACK-END TO FRONT-END

    // Testing variable (to be deleted: --for deployment, edit the getCampaign in the backend so as to be called by Principal user)
    var campaignIdCount = 0;
    var campaignId = String(campaignIdCount);
    //campaignIdCount := 0; // Uncomment to reset the testing variable

    console.log("Finished initialising counter " + campaignId);

    // DISPLAY A GAMPAIGN

    // Request data from back end
    const campaignData = await fundraisa_backend.getCampaign(campaignId);
    console.log(campaignData);
    console.log(campaignData[0]["campaignTitle"]);
    document.getElementById("title").innerText = campaignData[0]["campaignTitle"];

    

    campaignIdCount += 1;
});
//#To do
//Retrieve campaing details (campaing ID, Title, Description, goal, time, goal balance etc) from backend for display
