// // Import the necessary functions from your declarations
// import { fundraisa_backend } from "../../declarations/fundraisa_backend";

// // Function to initialize the backend and get the canister ID
// async function initializeBackend() {
//   // Call the appropriate function from your declarations to get the canister ID
//   try {
//     const canisterId = await fundraisa_backend.getCanisterId();
//     return canisterId;
//   } catch (error) {
//     console.error("Error fetching canister ID:", error);
//     // Handle the error appropriately
//     throw error;
//   }
// }

// // Function to extract query parameters from the URL
// function getQueryParam(name) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(name);
// }

// // Update the Create Campaign link with the canister ID
// document.addEventListener('DOMContentLoaded', async function() {
//   try {
//     // Initialize the backend and get the canister ID
//     const canisterId = await initializeBackend();

//     // Update the Create Campaign link with the canister ID
//     const createCampaignLink = document.getElementById('createCampaignLink');
//     createCampaignLink.href = `create_campaign.html?`;

//     // Get the canister ID from the URL
//     // const id = getQueryParam('canisterId');

//     // Open create campaign page
//     const createCampaignPage = document.getElementById('createCampaignPage');
//     createCampaignPage.href = `create_campaign.html`;
//   } catch (error) {
//     console.error("Initialization error:", error);
//     // Handle the initialization error appropriately
//   }
// });
