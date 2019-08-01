## List of design patter used

**Fail early and fail loud** : Funcions called incorrectly throw exeptions as soon as possible. This is obtained using both "modifiers" and "requires" at the beginning of the functions,

**Restricting Access** : Using modifiers there are 4 different roles in the smart contract: notUser, Users, Creators and the owner.

**Circuit Breaker**: Using the Pausable contract implemented by OpenZeppeling, it's possible to pause for a period the main functions of the  contract using a modifier.