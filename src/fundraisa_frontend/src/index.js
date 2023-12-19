import { fundraisa_backend } from "../../declarations/fundraisa_backend";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const name = document.getElementById("name").value.toString();
  const goal = BigInt(document.getElementById("goal").value);
  const owner = document.getElementById("owner").value.toString();
  const destination = document.getElementById("destination").value.toString();

  button.setAttribute("disabled", true);

  // Call the createCampaign function in the backend canister
  await fundraisa_backend.createCampaign(name, goal, owner, destination);

  // Optionally, you can retrieve campaign details or perform other actions here

  button.removeAttribute("disabled");

  // Update the UI or perform other actions as needed

  return false;
});