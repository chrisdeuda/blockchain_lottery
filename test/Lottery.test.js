const assert    = require('assert');
const ganache   = require('ganache-cli');
const Web3      = require("web3");

// Provider allows as to connect to given network 
const web3 = new Web3( ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract( JSON.parse(interface))
        .deploy( {data: bytecode})
        .send( {from: accounts[0], gas: '1000000'});

});

describe("Lottery Contract", () => {
    // Checking if the contract successfully deployed
    it('Deploys a contract', () => {
        // Address exists
        assert.ok(lottery.options.address);

    });

    // I want to make sure when they enter . Their address should be put in the players array
    it('allows one account to enter', async  ()=> {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal( accounts[0], players[0]);
        assert.equal(1, players.length);

    })

    /**
     * I want to make sure when they enter . Their address should be put in the players array
     **/ 
    it('allows multiple accounts to enter', async  ()=> {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal( accounts[0], players[0]);
        assert.equal( accounts[1], players[1]);
        assert.equal( accounts[2], players[2]);
        assert.equal(3, players.length);

    })

    it('requires a minimum amountn of ether to enter', async ()=> {
        try {
            // It should fail and stop the execution
            await lottery.methods.send({
                from: accounts[0],
                value: 200 // Not trying to convert into ether
            })
            assert(false); // It will always fail the test
        } catch (err) {
            // Check if there are error exists
            console.log(err);
            assert.ok(err);
        }
    
    })

});
