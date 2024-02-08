// BACKEND CODE FOR FUNDRAISA DAPP.

// import necessary liblaries

import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";


// CANISTER (SMART CONTRACT)
actor Dfundraisa{
  // Define data types for a fundraising campaign, user and donnors
  public type Campaign = {
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

  type Donor = {
    campaignId: Text;
    donorName: Text;
    donatedAmount: Float;
  };

  
  // DATA STRUCTURE
  
  // Define storage (TrieMaps) for fundraising campaigns, users and donnors
  let campaigns : TrieMap.TrieMap<Text, Campaign> = TrieMap.TrieMap<Text, Campaign>(Text.equal, Text.hash);
  let users : TrieMap.TrieMap<Principal, User> = TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);
  let donors : TrieMap.TrieMap<Text, Donor> = TrieMap.TrieMap<Text, Donor>(Text.equal, Text.hash);


  // CAMPAIGN VARIABLES

  // Define a counter variable to manage fundraising campaigns and initialise it to zero.
  stable var campaignIdCount: Nat = 0;
  //campaignIdCount := 0; // Uncomment to reset the counter

  var campaignEnded: Text = "false";  //initialise campaign status
  var campaignRaisedAmount: Float = 0.0;  //initialise campaign raised amount to zero


    // USER

    // ADD a user - ({caller}) is a verified/certified principal behind the internet identity and the person calling the function
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


  // UPDATE a SINGLE user account by the user (i.e using user playload)
  public shared ({ caller }) func updateUser(userPayload: UserPayload) : async Result.Result<(), Text> {
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

  // ADD a fundraising campaign
  public func addCampaign(campaignPayload: CampaignPayload) : async Result.Result<(), Text> {
    //1. authenticate user
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


  // QUERRY a SINGLE fundraising campaign
  public query func getCampaign(campaignId: Text): async ?Campaign {
    //1. Authendicate user
    //2. Query for data
    let campaignResult: ?Campaign = campaigns.get(campaignId);
    //3. Return requested campaign or null.
    return campaignResult;
  };


  // QUERRY ALL fundraising campaigns
  public query func getCampaigns() : async [(Text, Campaign)] {
    Iter.toArray(campaigns.entries());
};
  

  // UPDATE a SINGLE fundraising campaign by a user (using campaign payload, and user's campaignId)
  public func updateCampaignPayload(campaignId: Text, campaignPayload: CampaignPayload): async Result.Result<(), Text> {
    //1. Authendicate user
    //2. Query data
    let campaignResult: ?Campaign = campaigns.get(campaignId);
    //3. Validate if a fundraising campaign exists.
    switch(campaignResult) {
      case(? Null) {
        //4. Prepare data for update if a campaign exists
        //let _campaignEnded: Text = campaignEnded;  //to delete as they are already initialised and stable
        //let _campaignRaisedAmount: Float = campaignRaisedAmount; //to delete as they are already initialised and stable
        let updatedCampaign: Campaign = {
          campaignId = campaignId;
          campaignTitle = campaignPayload.campaignTitle;
          campaignType = campaignPayload.campaignType;
          campaignDescription = campaignPayload.campaignDescription;
          campaignGoal= campaignPayload.campaignGoal;
          campaignEndDateTime = campaignPayload.campaignEndDateTime;
          campaignRaisedAmount = campaignRaisedAmount;
          campaignEnded = campaignEnded;};
        //5. Update the fundraising campaing in store
        campaigns.put(campaignId, updatedCampaign);
        //6. Return success
        return #ok();
      };
      case(null) {
        return #err("You're trying to update a non-existing campaign");
      };
    };
  };


// UPDATE a SINGLE fundraising campaign internally (i.e. without using campaign payload)
  public func updateCampaign(campaign: Campaign): async Result.Result<(), Text> {
    //1. Authendicate user
    //2. Query data
    let campaignResult: ?Campaign = campaigns.get(campaign.campaignId);
    //3. Validate if a fundraising campaign exists.
    switch(campaignResult) {
      case(? Null) {
        //4. Prepare data for update if a campaign exists
        let updatedCampaign: Campaign = {
          campaignId = campaign.campaignId;
          campaignTitle = campaign.campaignTitle;
          campaignType = campaign.campaignType;
          campaignDescription = campaign.campaignDescription;
          campaignGoal= campaign.campaignGoal;
          campaignEndDateTime = campaign.campaignEndDateTime;
          campaignRaisedAmount = campaign.campaignRaisedAmount;
          campaignEnded = campaign.campaignEnded;};
        //5. Update the fundraising campaing in store
        campaigns.put(campaign.campaignId, updatedCampaign);
        //6. Return success
        return #ok();
      };
      case(null) {
        return #err("You're trying to update a non-existing campaign");
      };
    };
  };

  // DELETE a SINGLE fundraising campaign
  public shared ({ caller }) func deleteCampaign(campaignId: Text): async Result.Result<(), Text>  {
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


  // DONATE TO A CAMPAIGN

  //1. Querry the campaignId record with getCampaign()
  //2. Update values of the querried record in index.js
  //3. index.js calls donateToCampaign() with campaignId's updated record and donors details 

  public func donateToCampaign(donor: Donor, updateCampaignIdRecord: Campaign): async Result.Result<(), Text> {
    //1. Initialise donor
    let _donor: Donor = donor;
    //2. Query data
    var campaignResult: ?Campaign = campaigns.get(_donor.campaignId);
    //3. Validate if a fundraising campaign being donated to exists.
    switch(campaignResult) {
      case(? Null) {
        //5. Prepare data to update donor storage
        let donor: Donor = {
          campaignId = _donor.campaignId;
          donorName = _donor.donorName;
          donatedAmount = _donor.donatedAmount;
        };
        //6. Put donor to storage
        donors.put(_donor.campaignId, donor);
        //7. Put updated campaign record to store
        campaigns.put(_donor.campaignId, updateCampaignIdRecord);
        return #ok();
      };
      case(null) {
       return #err("You are trying to donate to a non existing campaign");
      };
    };
  };

  // ENDING A CAMPAIGN (logic to be moved to .js)
  //Time.fromString()
  //let currentTimeNS = Time.now();
  //let localTime = Time.toLocalTime(Time.fromNanoseconds(currentTimeNS));
  

  // Trying to combine addUser() and addCampaign into one function
  // public shared({ caller } )func createCampaign(userPayload: UserPayload, campaignPayload: CampaignPayload) : async Result.Result<(), Text> {
  //   addUser(userPayload);
  //   addCampaign(campaignPayload);
  //   return #ok();
  // };

};
