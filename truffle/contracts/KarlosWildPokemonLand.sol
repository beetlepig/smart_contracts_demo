// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

contract KarlosWildPokemonLand {
  // Attributes

  // Struct is a group of elements with a different data type, like a Record in typescript.
  struct Owner {
    address owner; // default value is a "empty" direction, "0x0000..."
    bool owned; // default value is false
  }

  /*  A mapping is like a dictionary, e.g.
  *   {
  *       "dragonite": {owner: "address", owned: true}
  *   }
  */
  mapping(string => Owner) ownership;


  constructor() public {}

  // Modifiers are used to modify the behaviour of a function.
  modifier onlyAvailablePokemon(string memory pokemonName) {
    require(!ownership[pokemonName].owned, "This pokemon has already been captured.");
    _;
  }


  // function <name>(<parameters>) <access type> <modifier> <visibility> <return type>

  // Catch pokemon function
  function catchPokemon(string memory pokemonName) public onlyAvailablePokemon(pokemonName) returns (string memory) {
    ownership[pokemonName].owner = msg.sender;
    ownership[pokemonName].owned = true;

    return pokemonName;
  }

  // Checks if the pokemon has already been caught
  function isOwned(string memory pokemonName) public view returns (bool) {
    return ownership[pokemonName].owned;
  }

  // Returns the current pokemon owner address.
  function getOwner(string memory pokemonName) public view returns (address) {
    return ownership[pokemonName].owner;
  }

}
