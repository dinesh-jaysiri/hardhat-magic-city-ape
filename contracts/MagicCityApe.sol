// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/finance/PaymentSplitter.sol';
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// @author Dinesh Jayasiri
// @contact ywdinesh@gmail.com

contract MagicCityApe is 
    ERC721, 
    Ownable, 
    ReentrancyGuard, 
    PaymentSplitter 
{
    using Strings for uint256;
    using Counters for Counters.Counter;

    bytes32 public root;

    uint256 public maxSupply = 100;

    string public baseURI; 
    string public notRevealedUri = "ipfs://QmUNNr7yGkZynBpuKTZf3rqQtsEDHJHxeQwrdm5gaNKKY1?filename=notRevealed.json";
    string public baseExtension = ".json";

    bool public paused = false;
    bool public revealed = false;
    bool public presaleM = false;
    bool public publicM = false;

    uint256 public presaleAmountLimit = 3;
    mapping(address => uint256) public _presaleClaimed;

    uint256 _price = 10000000000000000; // 0.01 ETH

    Counters.Counter private _tokenIds;

    uint256[] private _teamShares = [75,25]; // 2 PEOPLE IN THE TEAM
    address[] private _team = [
        0x8aA50Fd50beCA814AAF03D01A396854C0096B0f3,
        0xee9DAB72b81083C8Ba7836a4aeF16E74235487E1
    ];

    constructor(string memory uri, bytes32 merkleroot)
        ERC721("MagicCityApe", "APE")
        PaymentSplitter(_team, _teamShares) // Split the payment based on the teamshares percentages
        ReentrancyGuard() // A modifier that can prevent reentrancy during certain functions
    {
        root = merkleroot;

        setBaseURI(uri);
    }

    function setBaseURI(string memory _tokenBaseURI) public onlyOwner {
        baseURI = _tokenBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function reveal() public onlyOwner {
        revealed = true;
    }

    function setMerkleRoot(bytes32 merkleroot) 
    onlyOwner 
    public 
    {
        root = merkleroot;
    }

    modifier onlyAccounts () {
        require(msg.sender == tx.origin, "Not allowed origin");
        _;
    }

    modifier isValidMerkleProof(bytes32[] calldata _proof) {
         require(MerkleProof.verify(
            _proof,
            root,
            keccak256(abi.encodePacked(msg.sender))
            ) == true, "Not allowed origin");
        _;
   }

    function togglePause() public onlyOwner {
        paused = !paused;
    }

    function togglePresale() public onlyOwner {
        presaleM = !presaleM;
    }

    function togglePublicSale() public onlyOwner {
        publicM = !publicM;
    }


    function presaleMint(address account, uint256 _amount, bytes32[] calldata _proof)
    external
    payable
    isValidMerkleProof(_proof)
    onlyAccounts
    {
        require(msg.sender == account,"MagicCityApe: Not allowed");
        require(presaleM,"MagicCityApe: Presale is OFF");
        require(!paused,"MagicCityApe: Contract is paused");
        require(_amount <= presaleAmountLimit,"MagicCityApe: You can't mint so much tokens");
        require(_presaleClaimed[msg.sender] + _amount <= presaleAmountLimit,"MagicCityApe: You can't mint so much tokens");


        uint current = _tokenIds.current();

        require(current + _amount <= maxSupply,"MagicCityApe: max supply exceeded"
        );
        require(_price * _amount <= msg.value,"MagicCityApe: Not enough ethers sent"
        );
             
        _presaleClaimed[msg.sender] += _amount;

        for (uint i = 0; i < _amount; i++) {
            mintInternal();
        }
    }

    function publicSaleMint(uint256 _amount) 
    external 
    payable
    onlyAccounts
    {
        require(publicM,"MagicCityApe: PublicSale is OFF");
        require(!paused,"MagicCityApe: Contract is paused");
        require(_amount > 0,"MagicCityApe: zero amount");

        uint current = _tokenIds.current();

        require(
            current + _amount <= maxSupply,
            "MagicCityApe:Max supply exceeded"
        );
        require(
            _price * _amount <= msg.value,
            "MagicCityApe:Not enough ethers sent"
        );
        
        
        for (uint i = 0; i < _amount; i++) {
            mintInternal();
        }
    }

    function mintInternal() internal nonReentrant {
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata:URI query for nonexistent token"
        );
        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
    
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function totalSupply() public view returns (uint) {
        return _tokenIds.current();
    }

   
}



