// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RPS {
    enum Move { Rock, Paper, Scissors }

    mapping(address => int256) public scores;

    Move public lastPlayerMove;
    Move public lastContractMove;
    int8 public lastResult; // 1 = player win, 0 = draw, -1 = player lose

    event Played(address indexed player, Move playerMove, Move contractMove, int8 result, int256 newScore);

    // Play a round. _move: 0=Rock,1=Paper,2=Scissors
    function play(uint8 _move) external returns (Move contractMove, int8 result, int256 newScore) {
        require(_move < 3, "Invalid move");

        // Updated: use block.prevrandao (post-merge randomness field).
        // Note: still insecure for high-value games — see alternatives below.
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
        uint8 c = uint8(rand % 3);

        lastPlayerMove = Move(_move);
        lastContractMove = Move(c);

        if (_move == c) {
            result = 0;
        } else if ((_move + 1) % 3 == c) {
            // contract move beats player -> player loses
            result = -1;
        } else {
            // player beats contract
            result = 1;
        }

        scores[msg.sender] += int256(result);
        lastResult = result;

        emit Played(msg.sender, lastPlayerMove, lastContractMove, result, scores[msg.sender]);

        return (lastContractMove, result, scores[msg.sender]);
    }

    function getMyScore(address player) external view returns (int256) {
        return scores[player];
    }
}
