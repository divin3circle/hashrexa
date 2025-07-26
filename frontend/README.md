# HASHREXA

## Architecture

### Bank Backed Asset / Proof of reserve

Users but actual stock assets in the realn world and have them stored in a bank or brokrage account such as [Aplapca](). The system then checks and reads the balance of the account holding the stocks, and mints tokens equivalent to the stocks held. the idea is that their exist a centralized authority that allows users to redeem the token and get their stocks back.

`using AAPL stocks for demo`

### Setup

1. Only the owner of the stocks to be minted can mint
1. Anyone can redeem the dAAPL(directly backed apple stock token) for USDC or stablecoin of choice. This will keep the dAAPL stock token pegged as anyone can always sell(burn) their dAAPL tokens for USDC
1. Functions will kickoff a AAPL sell for USDC, and then send it to the contract
1. User can then call finishRedeem to get their USDC

### Backend setup
