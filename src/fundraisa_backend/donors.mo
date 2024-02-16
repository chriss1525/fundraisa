// DONOR CANISTER
// import necessary liblaries
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import CampaignTypes "dataTypes/campaign.types";
import DonorTypes "dataTypes/donor.types";

// CANISTER (SMART CONTRACT)
actor Donors {
    type Donor = DonorTypes.Donor;
    public type Campaign = CampaignTypes.Campaign;

    // DATA STRUCTURE
    // Define storage (TrieMaps) for donors
    let donors : TrieMap.TrieMap<Text, Donor> = TrieMap.TrieMap<Text, Donor>(Text.equal, Text.hash);

    // REFERENCE DFUNDRAISER CANISTER
    // Call Dfundraisa canister for campaign details by reference
    let dfundraisaCanister = actor ("bd3sg-teaaa-aaaaa-qaaba-cai") : actor {
        getCampaign(campaignId : Text) : async ?Campaign;
        updateCampaign(campaign : Campaign) : async Result.Result<(), Text>;
    };

    // DONATE TO A CAMPAIGN
    // collect donor details and update the campaign record from front end
    public func donateToCampaign(donor : Donor, updateCampaignIdRecord : Campaign) : async Result.Result<(), Text> {
        //1. Initialise donor
        let _donor : Donor = donor;
        //2. Query data
        var campaignResult : ?Campaign = await dfundraisaCanister.getCampaign(_donor.campaignId);
        //3. Validate if a fundraising campaign being donated to exists.
        switch (campaignResult) {
            case (?Null) {
                //4. Prepare data to update donor storage
                let donor : Donor = {
                    campaignId = _donor.campaignId;
                    donorName = _donor.donorName;
                    donatedAmount = _donor.donatedAmount;
                };
                //5. Put donor to storage
                donors.put(_donor.campaignId, donor);
                //6. Send updated campaign record to dfundraiser canister for storage
                await dfundraisaCanister.updateCampaign(updateCampaignIdRecord);
            };
            case (null) {
                return #err("You are trying to donate to a non existing campaign");
            };
        };
    };

};

