// Specific version of the solidity  that our source code is written
// Version Identifier of the code
pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    function Lottery() public {
        // Global Variable msg
        manager = msg.sender;
        
    }
    
    // Functions types - send some ether 
    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    
    // Pseudo Random Generator
    function _random() private view returns (uint){
        //Converting the hash into unsign integer 
        return uint(keccak256(block.difficulty, now,players));
    }
    
    function pickWinner() public restriced{
        
        uint index = _random() % players.length;
        
        // Send entire balance of the contract
        players[index].transfer( this.balance );
        
        // Resetting the state of the contract
        players = new address[](0);
    }
    
    
    modifier restriced(){
        require(msg.sender == manager);
        _;
    }
    
}