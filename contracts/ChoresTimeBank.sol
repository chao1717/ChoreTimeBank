// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ChoresTimeBank {
    address public owner;

    struct Chore {
        string name;
        uint256 points;
    }

    struct Record {
        uint256 choreId;
        uint256 timestamp;
    }

    mapping(uint256 => Chore) public chores;
    uint256 public choreCount;

    mapping(address => Record[]) public records;
    mapping(address => uint256) public totalPoints;

    event ChoreAdded(uint256 id, string name, uint256 points);
    event ChoreSubmitted(address member, uint256 choreId, uint256 points);

    constructor() {
        owner = msg.sender;
    }

    function addChore(string memory _name, uint256 _points) public {
        require(msg.sender == owner, "Only owner can add chores");
        chores[choreCount] = Chore(_name, _points);
        emit ChoreAdded(choreCount, _name, _points);
        choreCount++;
    }

    function submitChore(uint256 _choreId) public {
        require(_choreId < choreCount, "Invalid chore id");
        records[msg.sender].push(Record(_choreId, block.timestamp));
        totalPoints[msg.sender] += chores[_choreId].points;
        emit ChoreSubmitted(msg.sender, _choreId, chores[_choreId].points);
    }

    function getRecords(address _member) public view returns (Record[] memory) {
        return records[_member];
    }

    function getPoints(address _member) public view returns (uint256) {
        return totalPoints[_member];
    }

    function getAllChores() public view returns (Chore[] memory) {
       Chore[] memory result = new Chore[](choreCount);
       for (uint256 i = 0; i < choreCount; i++) {
        result[i] = chores[i];
       }
       return result;
    }
}