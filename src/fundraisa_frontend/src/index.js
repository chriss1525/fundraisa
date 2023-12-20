import { fundraisa_backend } from "../../declarations/fundraisa_backend";

// Function to create a campaign
export const createCampaign = async (name, goal, destination) => {
  const result = await fundraisa_backend.createCampaign(name, goal, destination);
  return result;
}

// function to get campaign by id
export const getCampaignDetails = async (id) => {
  const result = await fundraisa_backend.getCampaignDetails(id);
  return result;
}

// contribute to a campaign
export const contributeToCampaign = async (name, amount) => {
  const result = await fundraisa_backend.contributeToCampaign(name, amount);
  return result;
}

// end a campaign
export const endCampaign = async (name) => {
  const result = await fundraisa_backend.endCampaign(name);
  return result;
}