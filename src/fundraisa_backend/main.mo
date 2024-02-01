import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Trie "mo:base/Trie";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";

actor Dfundraisa{
  // Define a record types for fundraisa platform
  type Campaign = {
    cTitle: Text;
    cType: Text;
    cDescription: Text;
    cGoal: Nat;
    cEndDateTime: Text;
    ended: Bool;
  };

  type User = {
    userName: Text;
    userId: Text;
    userTelNo: Text;
    yearOfBirth: Nat;
    contributionDestination: Text;
  };

  type Donner = {
    donnerName: Text;
    donnerAmount: Nat;
  };

  // Define TrieMaps to store campaigns, users and donnors
  let campaigns : TrieMap.TrieMap<Principal, Campaign> = TrieMap.TrieMap(Principal.equal, Principal.hash);
  let users : TrieMap.TrieMap<Principal, User> = TrieMap.TrieMap(Principal.equal, Principal.hash);
  let donners : TrieMap.TrieMap<Principal, Donner> = TrieMap.TrieMap(Principal.equal, Principal.hash);

  //USER

  // Add a user - ({caller}) is a verified/certified principal behind the internet identity and the person calling the function
  // shared because the caller's identity is public information
  public shared({ caller } ) func addUser(userName: Text, userId: Text, userTelNo: Text, yearOfBirth: Nat, 
    contributionDestination: Text) : async Result.Result<(), Text> {
    // Add if a user does not exist else thrrow an error
    switch(users.get(caller)) {
      case(null) {
        let user : User = {
          userName;
          userId;
          userTelNo;
          yearOfBirth;
          contributionDestination;
        };
        users.put(caller, user);
        return #ok();
      };
      case(? user) { 
        return #err("The user exists for the caller");
      };
    };
  };


  // Querry a user ({?User} is optional data type)
  public query func getUser(p: Principal) : async ?User {
    return users.get(p);
  };


  // Delete a user (only identified callers can delete a user)
  public shared ({ caller }) func deleteUser() : async () {
    users.delete(caller);
  };

  
  // FUNDRAISING CAMPAIGN

  public shared ({ caller }) func addCampaign(cTitle: Text, cType: Text, cDescription: Text, cGoal: Nat, cEndDateTime: Text, 
    ended: Bool) : async Result.Result<(), Text> {
    // Add if a campaing does not exist else throw an error
    switch(campaigns.get(caller)) {
      case(null) {
        let campaign : Campaign = {
          cTitle;
          cType;
          cDescription;
          cGoal;
          cEndDateTime;
          ended;
        };
        campaigns.put(caller, campaign);
        return #ok();
      };
      case(? campaign) { 
        return #err("There is already a campaign for that caller")
      };
    };
  };

  //delete a campaign
  public shared ({ caller }) func removeCampaign() : async () {
    campaigns.delete(caller);
  };

  // access the principal of the caller
  public shared ({ caller }) func returnPrincipalOfTheCaller() : async Text {
    return Principal.toText(caller);
    };
  //public query func getGampaign(p: Prinipal) : async ?Campaign{
  //  return campaigns.get(p);
  //};

  public func concat(a: Text): async Text{
    var b: Text = "hallo + a";
    Debug.print(b);
    return b;
  };
};
