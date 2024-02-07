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

    // CREATE A CAMPAIGN
    if (campaignObject.length != 0 && personalObject.length != 0) {
        // Prepare data (campaignPayload and userPayload object) to send to backend
        let campaignGoal = parseFloat(campaignObject.cGoal);
        let campaignPlayload = {
            campaignTitle: campaignObject.cTitle,
            campaignType: campaignObject.cType,
            campaignDescription: campaignObject.cDescription,
            campaignGoal: campaignGoal,
            campaignEndDateTime: campaignObject.cEndDateTime,
        };

        const userPayload = {
            userName: personalObject.userName,
            userNationalIdNo: personalObject.userNationalIdNo,
            userTelNo: personalObject.userTelNo,
            yearOfBirth: personalObject.yearOfBirth,
            contributionDestination: personalObject.userAcNo
        };

        // Send data to backend
        await fundraisa_backend.addUser(userPayload);
        await fundraisa_backend.addCampaign(campaignPlayload);

        // Delete campaign details from local host's browser
        localStorage.removeItem("campaignObject");
        localStorage.removeItem("personalObject");

    };

    console.log("Finished sending campaign registration to backend"); // to be deleted

    // GET DATA FROM BACK-END TO FRONT-END
    // Testing variable (to be deleted: --for deployment, edit the getCampaign in the backend so as to be called by Principal user)
    var campaignIdCount = 0;
    var campaignIdTest1 = String(campaignIdCount);
    //campaignIdCount = 0; // Uncomment to reset the testing variable
    console.log("Finished initialising counter " + campaignId);

    // DISPLAY A GAMPAIGN

    // Request data from back end
    //const campaignData = await fundraisa_backend.getCampaign(campaignId);
    //console.log(campaignData);
    //console.log(campaignData[0]["campaignTitle"]);
    //document.getElementById("title").innerText = campaignData[0]["campaignTitle"];

    campaignIdCount += 1;


    //CAMPAIGN TIME
    //1. Get campaignId from backend
    const campaignData = await fundraisa_backend.getCampaign(campaignIdTest1);
    const campaignEndDateTime = new Date(campaignData[0]["campaignEndDateTime"]);
    const campaignEnded = campaignData[0]["campaignEnded"];
    console.log(campaignEndDateTime); //To be deleted
    console.log(campaignEnded); //To be deleted
    
    //2. calculate time difference
    const currentDateTime = new Date();
    const campaignRemainingTime = campaignEndDateTime - currentDateTime; // possible use for displa
    console.log(campaignRemainingTime);
    console.log(Math.abs(campaignEndDateTime - currentDateTime)); // safe to use for display

    //3. Set status of the campaign
    if (currentDateTime > campaignEndDateTime) {
        campaignEnded = "true";
    } else {
        campaignEnded = "false";
    }
    //4. Prepare campaign data to update the record in the store
    let updateCampaignRecord = {
        campaignId: campaignData[0]["campaignId"],
        campaignTitle: campaignData[0]["campaignTitle"],
        campaignType: campaignData[0]["campaignType"],
        campaignDescription: campaignData[0]["campaignDescription"],
        campaignGoal: campaignData[0]["campaignGoal"],
        campaignEndDateTime: campaignData[0]["campaignEndDateTime"],
        campaignRaisedAmount: campaignData[0]["campaignRaisedAmount"],
        campaignEnded: campaignEnded,
    }
    //5. update campaign record in store


});

// DONATE TO A CAMPAIGN

//Listen to open window and grab its campaignId (below is a testing Id)
const campaignIdTest = String(0);

window.addEventListener("load", async function() {
    console.log("finished loading window");
    //1. Receive local host's donor values/objects
    const donorObject = JSON.parse(localStorage.getItem("donorObject"));
    console.log(donorObject); //to be deleted
    
    //2. Prepare donor's data to send to backend
    if (donorObject.length != 0) {
        let donor = {
            campaignId: campaignIdTest,
            donorName: donorObject.donorName,
            donatedAmount: parseFloat(donorObject.donatedAmount)};
        

        //3. Get campaignId's record from backend
        const campaignData = await fundraisa_backend.getCampaign(campaignIdTest);
        console.log(campaignData); //To be deleted
        
        //4. calculate campaign raised amount
        const availableCampaignAmount = parseFloat(campaignData[0]["campaignRaisedAmount"]);
        const currentDonationAmount = parseFloat(donorObject.donatedAmount);
        const campaignRaisedAmount = availableCampaignAmount + currentDonationAmount;
        
        //5. Prepare updated campaignId's data to send to backend
        let updateCampaignIdRecord = {
            campaignId: campaignIdTest,
            campaignTitle: campaignData[0]["campaignTitle"],
            campaignType: campaignData[0]["campaignType"],
            campaignDescription: campaignData[0]["campaignDescription"],
            campaignGoal: campaignData[0]["campaignGoal"],
            campaignEndDateTime: campaignData[0]["campaignEndDateTime"],
            campaignRaisedAmount: campaignRaisedAmount,
            campaignEnded: campaignData[0]["campaignEnded"]
        };
        //6. Send donor and updated campaign record to backend
        await fundraisa_backend.donateToCampaign(donor, updateCampaignIdRecord);
    }
    //7. Delete donor details from local host's browser
    localStorage.removeItem("donorObject");
});
