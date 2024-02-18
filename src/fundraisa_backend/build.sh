#!/bin/sh

# Run the dfx canister id command and get the canister ID
CANISTER_ID=$(dfx canister id fundraisa_backend)

# Replace the placeholder in the Motoko source file with the actual canister ID
sed -i "s/CANISTER_ID_PLACEHOLDER/$CANISTER_ID/g" src/fundraisa_backend/donors.mo

# Build the project with dfx
dfx deploy