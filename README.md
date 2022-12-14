## Inspiration
In the current WEB3 launchpad model, projects raise funds from investors and remain in full control over the liquidity Pool. Even if they lock the funds, after a certain amount of time, the project will always have the ability to withdraw liquidity. This leaves investors extremely vulnerable and doesn’t fit with the idea of decentralization. Projects can simply vanish and remove all liquidity, or they simply do not deliver what was promised, leaving investors stuck with a locked liquidity pool. This increases the number of malicious projects, because the entry barrier to scam users is to simply present a potential idea, without the need to actually implement it. Further, investors lack additional leverage, to have a say in the project going forward. 

## What it does
Our solution is a new platform featuring our innovative decentralized liquidity pools, enabling every single investor to take a share in the liquidity pool. This holds projects accountable for their actions, they now need to work in consultation with their investor base. If projects do not deliver, or simply vanish, investors can withdraw the liquidity they provided drastically minimizing their risk of a total loss.

**The two approaches:**

First a quick recap, currently investors sent USDT/ETH/EVMOS etc. to create a pair with the project’s native asset. Once the presale is successful, the pair gets sent into the liquidity pool and the project owner receives the LP-tokens. He remains in control and nobody except him can withdraw liquidity. 

**We need a new way**

There are two approaches on how to go about such venture. Investors provide a certain amount of tokens, and in addition to the asset they normally would receive, they also directly get a share in the liquidity pool. The investment size, will reflect the share in the pool. We will call this “true ownership”, because you alone can make a decision whether to withdraw the liquidity or not. 

The second approach is a **DAO voting mechanism**. People still get a share in the liquidity pool, but instead of simply withdrawing their share of the liquidity, they can start a vote. Once a consensus is reached, everyone can access their liquidity. Every LP shareholder has the ability to start a vote, to request the withdraw of some or all liquidity, if the vote is successful everyone can collect their share. Otherwise another vote has to be submitted.

We prefer the second approach, because this eliminates selfish behavior. People could be inclined to withdraw their share of the pair and sell it off. With a DAO investors can, as a group, decide how the project should move forward, giving them more leverage to communicate as a collective.

## How we built it
Our background is roughly two years of professional work in the WEB3 space, mainly working with the EVM ecosystem. We first started by creating our “garden”, a solidity smart contract that manages all presales, every one being a newly planted “radish”. We took ERC20, Ownable and Reentrancyguard as our baseline. The Reentrancyguard prevents people from reentry, so they can’t drain the smart contract.
On The frontend we worked with React and daisyui for our general style. Through a web3 injection we enable wallet connection to our website, meaning users can new directly connect with their metamask to our wallet. 

## Challenges we ran into
There are many potential restrictions we want to implement, but this clashes with our goal of keeping it simple. For now, we decided to implement some, in our view necessary, restrictions. For example, a cool-down for new voting periods. Over the next 4 months we want to carefully implement more meaningful restrictions. 

Another challenge is decision between a DAO voting system or a more anarchy type where everyone can withdraw or lock at anytime. While we want to empower everyone as much as possible, it is also important to look whats best for everyone and not attract bad actors. To extend the options, we plan to also implement the individual option, to extend the spectrum we offer.

## Accomplishments that we're proud of
We managed to take our Website with full back-end integration live, all while only working on it during the submission period. Our idea has the potential to reshape how people think about presales and we are proud to finally take it from idea to reality.

## What we learned
We got from know little to nothing about Evmos to having a good understanding of how it works and what it solves. We worked with the Evmos testnet and got used to the specifics that comes with it. We further increased our knowledge with new challenges in solidity and for the first time we worked with daisyui.

## Business model

Our business model is straight forward, we charge a small fee upfront to launch projects on our platform. And only if the project is successfully funded we take a small percentage of the liquidity raised. This way the entry barrier on our platform is very low. We will be able to self sustain our self this way.

## What's next for Radish
We are already exited to take our product from test- to mainnet. This will require another round of extensive testing, but this has our highest priority. 
We will also onboard our first projects and create incentives for early adopters to use our platform.

- upgrading our UI/UX
- project our running costs and initial revenue
- extend our Business-plan
- improve gas efficiency of our smart contract
- hire a designer
- landing page

We only discovered this hackathon a few days ago, but immediately liked the Evmos ecosystem. While we are already proud of what we made until now, we are also eager to massively improve our project over the course of the next few months, to help the Evmos ecosystem thrive.

Right now you can launch a project on our website (live) and deploy right onto the Evmos testnet (live). People can also fund the project and the project creator can finalize and launch to diffusion (live). The voting functionality is already coded into the smart contract but not connected with our website, this will be implemented until the next milestone is due.


## The Radish story

In this bit I want to explain our wording, to give you a good understanding of our website.
Welcome to our **garden**, the radish platform. You can go ahead and **plant a new radish**, by selecting the “Launch Project” button. Once your project is “**planted**” (launched), investors who take part in your presale can “**water your radish**” (fund your project). 

There are two outcomes.

If the time is over and the softcap is not reached, your radish has **withered** (failed) and investors can withdraw back their investment. If you are successful, softcap reached before the funding period is over, your radish is **ripe** (launch is successful). 

You then can **harvest** you radish (finalize presale).
In case you can to cancel your presale you can click on **pluck** radish.

Once you are successful, people can watch the projects they funded and participate in the DAO voting. Currently there are two options, we will expand them as time goes on. **Increase duration** starts a vote, to extend to lock period. **Withdraw Liquidity**, starts a vote to withdraw back the liquidity your provided. The second vote is only possible if the liquidity is currently not locked.

**[Detailed Paper](https://github.com/aschenkuttel/radish/blob/master/Evmos%20Momentum%20Hackathon%20-%20WP.pdf)**

**[Live Demo](https://app.radishpool.com/)**

