const {MerkleTree} = require("merkletreejs")
const keccak256 = require("keccak256")

// List of 7 public Ethereum addresses
let addresses = [0x8cf69b568d603eccE5Bb882de585451c724182C3, 0x8A60157b2690baeFaE77032Cb8A4eA6a5EcE2b82]

// Hash leaves
let leaves = addresses.map(addr => keccak256(addr))

// Create tree
let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
let rootHash = merkleTree.getRoot().toString('hex')

// Pretty-print tree
console.log(merkleTree.toString())
console.log(rootHash)