![bounty manager logo](./static/Logo_readme.svg)

# Bounty Manager

### A UI to streamline Polkadot Bounties

Bounty Manager is a front-end dApp, built to simplify interaction with bounties for curators, by providing a simple to use interface, with one click buttons for each action.

#### Visit the deployed version at [bountymanager.io](https://www.bountymanager.io)

## Developing and Building

1. Make a copy of `.env.example` and rename it to `.env`. Edit the file to set the public Polkadot API Endpoint.
1. Install the dependencies.

   ```bash
   npm install
   ```

1. Build the project

   ```bash
   npm run build
   ```

   Note: running the build command once is necessary for running the development server, as it executes a required papi command.

1. Start the development server.

   ```bash
   npm run dev

   # or start the server and open the app in a new browser tab
   npm run dev -- --open
   ```
