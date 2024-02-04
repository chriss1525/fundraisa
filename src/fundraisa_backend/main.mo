// BACKEND CODE FOR FUNDRAISA DAPP.

// import necessary liblaries
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Hash "mo:base/Hash";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";

// CANISTER (SMART CONTRACT)
actor Dfundraisa{
  // Define data types for a fundraising campaign, user and donnors
  type Campaign = {
    campaignId: Nat;
    campaignTitle: Text;
    campaignType: Text;
    campaignDescription: Text;
    campaignGoal: Float;
    campaignEndDateTime: Text;
    campaignEnded: Bool;
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
    userTelNo: Text;
    yearOfBirth: Text;
    contributionDestination: Text;
  };

  type UserPayload = {
    userName: Text;
    userTelNo: Text;
    yearOfBirth: Text;
    contributionDestination: Text;
  };

  type Donner = {
    campaignId: Text;
    donnerName: Text;
    donnerAmount: Nat;
  };

  
  //  STORAGE DATA STRUCTURE
  
  // Define storage (TrieMaps) for fundraising campaigns, users and donnors
  //let campaigns : TrieMap.TrieMap<Nat, Campaign> = TrieMap.TrieMap<Nat, Campaign>(Nat.equal, Blob.hash);
  let users : TrieMap.TrieMap<Principal, User> = TrieMap.TrieMap<Principal, User>(Principal.equal, Principal.hash);
  let donners : TrieMap.TrieMap<Text, Donner> = TrieMap.TrieMap<Text, Donner>(Text.equal, Text.hash);

// define a key type for the trie
// a trie is a map from keys to values
// the key type is a type that can be hashed and compared for equality
  func key(t: Nat) : Trie.Key<Nat> { { hash = Hash.hash(Nat) t; key = t } };

// define a trie to store the campaigns
  var campaigns : Trie.Trie<Nat, Campaign> = Trie.empty();
  //var users : Trie.Trie<Text, User> = Trie.empty();



  // CAMPAIGN COUNTER

  // Define a counter variable to manage fundraising campaigns and initialise it to zero.
  stable var campaignIdCount: Nat = 0;


  // USER

  // ADD/CREATE a user - ({caller}) is a verified/certified principal behind the internet identity and the person calling the function
  // shared because the caller's identity is public information
  public shared({ caller } ) func addUser(userPayload: UserPayload) : async Result.Result<(), Text> {
    // Add if a user does not exist else thrrow an error
    switch(users.get(caller)) {
      case(null) {
        let _userId: Principal = caller.caller;
        let user : User = {
          userId = _userId;
          userName = userPayload.userName;
          userTelNo = userPayload.userTelNo;
          yearOfBirth = userPayload.yearOfBirth;
          contributionDestination = userPayload.contributionDestination;
        };
        users.put(_userId, user);
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
        let _userId: Principal = caller;
        let updatedUser : User = {
          userId = _userId;
          userName = userPayload.userName;
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
  public func addCampaign(campaignPayload: CampaignPayload) : async Result.Result<(), Text> {
    //1. authendicate user
    //2. Prepare the data
    let _campaignId: Nat = campaignIdCount;
    campaignIdCount += 1;
    let campaignEnded: Bool = false;
    let campaign: Campaign = {
      campaignId = _campaignId;
      campaignTitle = campaignPayload.campaignTitle;
      campaignType = campaignPayload.campaignType;
      campaignDescription = campaignPayload.campaignDescription;
      campaignGoal= campaignPayload.campaignGoal;
      campaignEndDateTime = campaignPayload.campaignEndDateTime;
      campaignEnded = campaignEnded;};
    //3. Add a campaign to storage
    campaigns.put(_campaignId, campaign);
    //4. Return confirmation
    return #ok();
  };


  // QUERRY  a SINGLE fundraising campaign
  public query func getCampaign(campaignId: Nat): async ?Campaign {
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
  public query func updateCampaign(campaignId: Nat, campaignPayload: CampaignPayload): async Result.Result<(), Text> {
    //1. Authendicate user
    //2. Query data
    let campaignResult: ?Campaign = campaigns.get(campaignId);
    //3. Validate if a fundraising campaign exists.
    switch(campaignResult) {
      case(?Null) {
        //4. Prepare data for update if a campaign exists
        let _campaignEnded: Bool = false; //#a user cannot update an ended campaign
        let _campaignId = campaignId;
        let updateCampaign: Campaign = {
          campaignId = _campaignId;
          campaignTitle = campaignPayload.campaignTitle;
          campaignType = campaignPayload.campaignType;
          campaignDescription = campaignPayload.campaignDescription;
          campaignGoal= campaignPayload.campaignGoal;
          campaignEndDateTime = campaignPayload.campaignEndDateTime;
          campaignEnded = _campaignEnded;};
      };
      case(null) {
        return #err("You're trying to update a non-existing post");
      };
    };
    //5. Update the fundraising campaing in store
    campaigns.put(campaignId, updateCampaign);
    //6. Return success
    return #ok();
  };


  // DELETE a SINGLE fundraising campaign
  public query func deleteCampaign(campaignId: Nat): async Result.Result<(), Text>  {
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
  // Add code for donnors contributing to a campaign

  // ENDING A CAMPAIGN


  // function to access the principal of the caller
  public shared ({ caller }) func returnPrincipalOfTheCaller() : async Text {
    return Principal.toText(caller);
  };

};
