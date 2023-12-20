import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Trie "mo:base/Trie";
import Error "mo:base/Error";

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
  public func createCampaign(name: Text, goal: Nat, owner: Principal, destination: Text) : async () {
    let (newCampaigns, _) = Trie.put(campaigns, key(name), Text.equal, { goal = goal; owner = owner; contributionDestination = destination; ended = false; totalRaised = 0 });
    campaigns := newCampaigns;
  };

  public query func getCampaignDetails(name: Text) : async Campaign {
    let maybeCampaign = Trie.get(campaigns, key(name), Text.equal);
    switch (maybeCampaign) {
      case (?campaign) campaign;
      case null { throw Error.reject("Campaign not found") };
    };
  };

  public func contributeToCampaign(name: Text, amount: Nat) : async () {
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
}
};