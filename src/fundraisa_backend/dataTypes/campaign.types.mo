module {
    public type Campaign = {
        campaignId : Text;
        campaignTitle : Text;
        campaignType : Text;
        campaignDescription : Text;
        campaignGoal : Float;
        campaignEndDateTime : Text;
        campaignRaisedAmount : Float;
        campaignEnded : Text;
    };

    public type CampaignPayload = {
        campaignTitle : Text;
        campaignType : Text;
        campaignDescription : Text;
        campaignGoal : Float;
        campaignEndDateTime : Text;
    };

};
