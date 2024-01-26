import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Trie "mo:base/Trie";
import Error "mo:base/Error";
import Iter "mo:base/Iter";

actor {
  // define a record type for the campaign
  type Campaign = {
    goal: Nat;
    owner: Principal;
    contributionDestination: Text;
    ended: Bool;
    totalRaised: Nat;
  };

  type User = {
    name: Text;
    principal: Principal;
    yearOfBirth: Nat;
  };

// define a key type for the trie
// a trie is a map from keys to values
// the key type is a type that can be hashed and compared for equality
  func key(t: Text) : Trie.Key<Text> { { hash = Text.hash t; key = t } };

// define a trie to store the campaigns
  var campaigns : Trie.Trie<Text, Campaign> = Trie.empty();
  var users : Trie.Trie<Text, User> = Trie.empty();

// define the public functions of the actor
// Create a user
public shared(msg) func createUser(name: Text, yearOfBirth: Nat) : async User {
  // Get the principal of the caller
  let principal = msg.caller;
  
  // Check if the user is old enough and does not already exist
  if (isOldEnough(yearOfBirth) and not doesUserExist(principal)) {
    // Create the user
    let user = { name = name; principal = principal; yearOfBirth = yearOfBirth };
    // Put the user in the trie
    let (newUsers, _) = Trie.put(users, key(Principal.toText(principal)), Text.equal, user);
    users := newUsers;
    // Return the user
    return user;
  } else {
    throw Error.reject("User is not old enough or already exists");
  }
};

// create a campaign
  public shared(msg) func createCampaign(name: Text, goal: Nat, contributionDestination: Text) : async Campaign {
    // Get the principal of the caller
    let principal = msg.caller;
    // Check if the user exists
    if (doesUserExist(principal)) {
      // Create the campaign
      let campaign = { goal = goal; owner = principal; contributionDestination = contributionDestination; ended = false; totalRaised = 0 };
      // Put the campaign in the trie
      let (newCampaigns, _) = Trie.put(campaigns, key(name), Text.equal, campaign);
      campaigns := newCampaigns;
      // Return the campaign
      return campaign;
    } else {
      throw Error.reject("User does not exist");
    };
  };

// get the details of a campaign
  public query func getCampaignDetails(name: Text) : async Campaign {
    let maybeCampaign = Trie.get(campaigns, key(name), Text.equal);
    switch (maybeCampaign) {
      case (?campaign) campaign;
      case null { throw Error.reject("Campaign not found") };
    };
  };

// contribute to a campaign
  public shared func contributeToCampaign(name: Text, amount: Nat) : async () {
  let maybeCampaign = Trie.get(campaigns, key(name), Text.equal);
  switch (maybeCampaign) {
    case (?campaign) {
      if (campaign.ended) {
        throw Error.reject("Campaign has ended");
      };
      let totalRaised = campaign.totalRaised + amount;
      let ended = totalRaised >= campaign.goal;
      let (newCampaigns, _) = Trie.put(campaigns, key(name), Text.equal, { campaign with totalRaised = totalRaised; ended = ended });
      campaigns := newCampaigns;
    };
    case null { throw Error.reject("Campaign not found") };
  };
};

// end a campaign make sure only the owner can end the campaign
  public shared(msg) func endCampaign(name: Text) : async () {
  let maybeCampaign = Trie.get(campaigns, key(name), Text.equal);
  switch (maybeCampaign) {
    case (?campaign) {
      if (campaign.owner == msg.caller) {
        let (newCampaigns, _) = Trie.put(campaigns, key(name), Text.equal, { campaign with ended = true });
        campaigns := newCampaigns;
      } else {
        throw Error.reject("Only the owner can end the campaign");
      };
    };
    case null { throw Error.reject("Campaign not found") };
  };
};

// Check if the user is older than 18
func isOldEnough(yearOfBirth: Nat) : Bool {
  return yearOfBirth <= 2000;
};

// Check if the user already exists
func doesUserExist(principal: Principal) : Bool {
  let principalText = Principal.toText(principal);
  let maybeUser = Trie.get(users, key(principalText), Text.equal);
  switch (maybeUser) {
    case (?user) true;
    case null false;
  };
};

};
