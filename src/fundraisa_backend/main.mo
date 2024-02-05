// BACKEND CODE FOR FUNDRAISA DAPP.

// import necessary liblaries

import Bool "mo:base/Bool";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";


// CANISTER (SMART CONTRACT)
actor Dfundraisa{
  // Define data types for a fundraising campaign, user and donnors
  type Campaign = {
    campaignId: Text;
    campaignTitle: Text;
    campaignType: Text;
    campaignDescription: Text;
    campaignGoal: Float;
    campaignEndDateTime: Text;
    campaignRaisedAmount: Float;
    campaignEnded: Text;
  };

  type CampaignPayload = {
    campaignTitle: Text;
    campaignType: Text;
    campaignDescription: Text;
    campaignGoal: Float;
    campaignEndDateTime: Text;
  };

  type User = {
    userId: Principal;
    userName: Text;
    userNationalIdNo: Text;
    userTelNo: Text;
    yearOfBirth: Text;
    contributionDestination: Text;
  };

  type UserPayload = {
    userName: Text;
    userNationalIdNo: Text;
    userTelNo: Text;
    yearOfBirth: Text;
    contributionDestination: Text;
  };

  type Donner = {
    campaignId: Text;
    donnerName: Text;
    donnetedAmount: Float;
  };

  
  // DATA STRUCTURE
  
  // Define storage (TrieMaps) for fundraising campaigns, users and donnors
  let campaigns : TrieMap.TrieMap<Text, Campaign> = TrieMap.TrieMap<Text, Campaign>(Text.equal, Text.hash);
  let users : TrieMap.TrieMap<Principal, User> = TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);
  let donners : TrieMap.TrieMap<Text, Donner> = TrieMap.TrieMap<Text, Donner>(Text.equal, Text.hash);


  // CAMPAIGN COUNTER

  // Define a counter variable to manage fundraising campaigns and initialise it to zero.
  stable var campaignIdCount: Nat = 0;
    //campaignIdCount := 0; // Uncomment to reset the counter


  // USER

  // ADD/CREATE a user - ({caller}) is a verified/certified principal behind the internet identity and the person calling the function
  // shared because the caller's identity is public information
  public shared({ caller } ) func addUser(userPayload: UserPayload) : async Result.Result<(), Text> {
    // Add if a user does not exist else thrrow an error
    switch(users.get(caller)) {
      case(null) {
        let userId: Principal = caller;
        let user : User = {
          userId = userId;
          userName = userPayload.userName;
          userNationalIdNo = userPayload.userNationalIdNo;
          userTelNo = userPayload.userTelNo;
          yearOfBirth = userPayload.yearOfBirth;
          contributionDestination = userPayload.contributionDestination;
        };
        users.put(userId, user);
        return #ok();
      };
      case(?user) { 
        return #err("The user already has a user account"); //add code to return the userId for other processing
      };
    };
  };


  // QUERRY a SINGLE user - Note: ({?User} refers to optional data type. i.e. null or value)
  public query func getUser(p: Principal) : async ?User {
    return users.get(p);
  };

  // QUERRY ALL users
  //public shared query ({ caller }) func getUsers() : async Result.Result<(), Text> {
    //return #ok(users.values()); //#values function to be verified later if it's code is correct)
  //};

  // UPDATE a SINGLE user
  public shared query ({ caller }) func updateUser(userPayload: UserPayload) : async Result.Result<(), Text> {
      switch(users.get(caller)) {
      case(? Null) {
        let updatedUser : User = {
          userId = caller;
          userName = userPayload.userName;
          userNationalIdNo = userPayload.userNationalIdNo;
          userTelNo = userPayload.userTelNo;
          yearOfBirth = userPayload.yearOfBirth;
          contributionDestination = userPayload.contributionDestination;
        };
        users.put(caller, updatedUser);
        return #ok();
      };
      case(null) { 
        return #err("The user account has not been found. Kindly add a user account");
      };
    };
  };

  // DELETE a user (only identified callers can delete a user)
  public shared ({ caller }) func deleteUser() : async () {
    users.delete(caller);
  };

  
  // FUNDRAISING CAMPAIGN

  // ADD/CREATE a fundraising campaign
  stable var campaignEnded: Text = "false";  //initialise campaign status
  stable var campaignRaisedAmount: Float = 0;  //initialise campaign raised amount to zero

  public func addCampaign(campaignPayload: CampaignPayload) : async Result.Result<(), Text> {
    //1. authendicate user
    //2. Prepare the data
    let campaignId: Text = Nat.toText(campaignIdCount);  //set campaign ID
    campaignIdCount += 1;
    let campaign: Campaign = {
      campaignId = campaignId;
      campaignTitle = campaignPayload.campaignTitle;
      campaignType = campaignPayload.campaignType;
      campaignDescription = campaignPayload.campaignDescription;
      campaignGoal= campaignPayload.campaignGoal;
      campaignEndDateTime = campaignPayload.campaignEndDateTime;
      campaignRaisedAmount = campaignRaisedAmount;
      campaignEnded = campaignEnded;};
    //3. Add a campaign to storage
    campaigns.put(campaignId, campaign);
    //4. Return confirmation
    return #ok();
  };


  // QUERRY  a SINGLE fundraising campaign
  public query func getCampaign(campaignId: Text): async ?Campaign {
    //1. Authendicate user
    //2. Query for data
    let campaignResult: ?Campaign = campaigns.get(campaignId);
    //3. Return requested campaign or null.
    return campaignResult;
  };


  // QUERRY ALL fundraising campaigns
  //public query func getCampaigns(): async ?Campaign {
  //  return users.values(); //#values function to be verified later if it's code is correct)
  //};


  // UPDATE a SINGLE fundraising campaign
  public query func updateCampaign(campaignId: Text, campaignPayload: CampaignPayload): async Result.Result<(), Text> {
    //1. Authendicate user
    //2. Query data
    let campaignResult: ?Campaign = campaigns.get(campaignId);
    //3. Validate if a fundraising campaign exists.
    switch(campaignResult) {
      case(? Null) {
        //4. Prepare data for update if a campaign exists
        let _campaignEnded: Text = campaignEnded;
        let _campaignRaisedAmount: Float = campaignRaisedAmount;
        let updatedCampaign: Campaign = {
          campaignId = campaignId;
          campaignTitle = campaignPayload.campaignTitle;
          campaignType = campaignPayload.campaignType;
          campaignDescription = campaignPayload.campaignDescription;
          campaignGoal= campaignPayload.campaignGoal;
          campaignEndDateTime = campaignPayload.campaignEndDateTime;
          campaignRaisedAmount = _campaignRaisedAmount;
          campaignEnded = _campaignEnded;};
        //5. Update the fundraising campaing in store
        campaigns.put(campaignId, updatedCampaign);
        //6. Return success
        return #ok();
      };
      case(null) {
        return #err("You're trying to update a non-existing post");
      };
    };
  };


  // DELETE a SINGLE fundraising campaign
  public query func deleteCampaign(campaignId: Text): async Result.Result<(), Text>  {
    //1. Authendicate user
    //2. Query data
    let campaignResult: ?Campaign = campaigns.get(campaignId);
    //3. Validate if the campaign exists
    switch(campaignResult) {
      case(? Null) {
        //4. Delete if a campaign exists
        campaigns.delete(campaignId);
      };
      case(null) {
        return #err("You're trying to delete a non-existing post");
      };
    };
    //5. Return success
    return #ok();
  };


  // DONNORS
  // Add code for donnors contributing to a campaign from original code

  // ENDING A CAMPAIGN
 // Add code for ending a campaign from original code

  // function to access the principal of the caller
  public shared ({ caller }) func returnPrincipalOfTheCaller() : async Text {
    return Principal.toText(caller);
  };


};
