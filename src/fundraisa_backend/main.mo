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

// define a key type for the trie
// a trie is a map from keys to values
// the key type is a type that can be hashed and compared for equality
  func key(t: Text) : Trie.Key<Text> { { hash = Text.hash t; key = t } };

// define a trie to store the campaigns
  var campaigns : Trie.Trie<Text, Campaign> = Trie.empty();

// define the public functions of the actor
// create a campaign
  public shared(msg) func createCampaign(name: Text, goal: Nat, destination: Text) : async () {
    // get the principal of the caller
    let owner = msg.caller;
    // put the campaign in the trie
    let (newCampaigns, _) = Trie.put(campaigns, key(name), Text.equal, { goal = goal; owner = owner; contributionDestination = destination; ended = false; totalRaised = 0 });
    campaigns := newCampaigns;
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
  func contributeToCampaign(name: Text, amount: Nat) : async () {
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

// end a campaign
public shared(msg) func endCampaign(name: Text) : async () {
  let maybeCampaign = Trie.get(campaigns, key(name), Text.equal);
  switch (maybeCampaign) {
    case (?campaign) {
      if (campaign.ended) {
        throw Error.reject("Campaign has ended");
      };
      // make sure the caller is the owner of the campaign
      if (campaign.owner != msg.caller) {
        throw Error.reject("Only the campaign owner can end the campaign");
      };
      let (newCampaigns, _) = Trie.put(campaigns, key(name), Text.equal, { campaign with ended = true });
      campaigns := newCampaigns;
    };
    case null { throw Error.reject("Campaign not found") };
  };
};
};