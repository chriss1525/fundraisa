module {
    public type User = {
        userId : Principal;
        userName : Text;
        userNationalIdNo : Text;
        userTelNo : Text;
        yearOfBirth : Text;
        contributionDestination : Text;
    };

    public type UserPayload = {
        userName : Text;
        userNationalIdNo : Text;
        userTelNo : Text;
        yearOfBirth : Text;
        contributionDestination : Text;
    };

};
