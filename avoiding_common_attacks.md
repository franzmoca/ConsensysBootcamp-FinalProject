## Avoiding main attacks

I believe this contract is not very vulnerable to classic attacks, because there isn't any value exchanged in functions.

**Re-entracy Attacks**: There isn't any function that employs external calls.
**Transaction Ordering and Timestamp Dependence**: No functions depends on the timestamp or in the order.
**Mathematical Overflow and Underflow**: All the uint variables are only incremented by one for each signing, so I didn't consider useful the implementation of SafeMath functions in my contract. 
Spamming petition signing would require spending a lot of fees and I don't consider it useful at this time.
**Denial of Service by Block Gas Limit (or startGas)**: I avoided the usage of any loop code in the smartcontract and I created simple getters for every useful mapping. The iteration of the single item getters happens clientside avoiding in this way the Gas Limit issue.

A problem that needs to be mentioned about my dApp is that we don't do enough to prevent "double signing" of the same petition, the need to register an user is probably not enough, even if making the ENS requirement mandatory in the mainnet, the cost of creating new accounts by naive attackers would became relevant.

For the longer term the exploring of more complex authentication solution like uPort or EIP1078 is very essential.

