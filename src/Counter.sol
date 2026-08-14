// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
// `public` auto-generates a free getter called count()
	uint256 public count;

    // Writes: change state, so they cost gas and need a signature.
    function increment() public {
        count += 1;
    }

    function decrement() public {
        // require reverts the transaction if the condition is false
        require(count > 0, "Counter: cannot go below zero");
        count -= 1;
    }
}
