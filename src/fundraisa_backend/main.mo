import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Trie "mo:base/Trie";
import Error "mo:base/Error";

actor {
  
  type Campaign = {
    goal: Nat;
    owner: Principal;
    contributionDestination: Text;
    ended: Bool;
    totalRaised: Nat;
  };

  func key(t: Text) : Trie.Key<Text> { { hash = Text.hash t; key = t } };

  var campaigns : Trie.Trie<Text, Campaign> = Trie.empty();

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