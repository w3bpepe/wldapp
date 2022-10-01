import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import merkleTree, { verifyProof } from 'merkletree';
import Web3 from "web3";
import { ethers } from "ethers";



const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`

`;

export const StyledRoundButton = styled.button`
 
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();


  const { MerkleTree } = require('merkletreejs')
  const SHA256 = require('crypto-js/sha256')
  const KECCAK256 = require('keccak256')
  const { utils } = require('ethers');
  
  let leaves = [
    "0x4De23Ab63dd5e7621A36C55B45FAb4358cd22256",
    "0x5e291d69716D51B3736D43F12A9fc5200A1fAAEA",
    "0x2076a94DF2Ef6BdaF5aA5A8d24E455a5A02B73F3",
    "0x5dEd5c6886EB9B9f7092D1fd8F022009b625B86B",
    "0x54ed838eDA6d80154ba15168D039Bc667AC7827B",
    "0x3e8f659De690f09F2705876F423ca6De1Fae86d1",
    "0x9CB84DCa6510c1D71439C29F6303DbceF5610481",
    "0xEc14567A53F4CBc641a624122A111B7498Cbb446",
    "0xE44C4217535C3463419C1DAa5Df0AF94D51A987E",
    "0x7DE562Cce23Edf75B48A496508D69345F6c69632",
    "0x5f76226EC22E89f4A94C97c7112d169F0c0a2511",
    "0x4e122B9CE11ec2C98AC65cc0Ce88028B3C2d0F18",
    "0x3E14726f0Cf6e739F89831d150e6824acd9e78c6",
    "0x9aAcee33d026694860020AFaAaBa322f7259B97b",
    "0xf611374fC3953177f796B76F1AB7480E88945aA5",
    "0x2fdd79BC5ab52767AbB5dbB068753C25895e2921",
    "0xb3e8a50B33825B73CFf414CDb56eAEb046178f00",
    "0x77C70E90fd69Da6e0ebfCBc739CEb1bff3Be509a",
    "0xFeE06F324CB41dD3E670a7e87f8183f71b0ab6EC",
    "0xBa92E77f70D17f64dB8471c9f67F24B8444c403A",
    "0x8cEd55688B4026673571c06306c29f8CCd6d12CE",
    "0xc7eA2dbD69EEFf09ec66303e959b5648642C5AC8",
    "0x1738D47a283004D278B410277d5509B6E08E339d",
    "0x7f21f35B148EcF054e823200aAc19dCdFc091dD3",
    "0x040a22fE50F250bE9a9313Cd79d0E2bE0bC93286",
    "0x8615FaBb8c4588189eA2fA9caC257CA8c041C6F7",
    "0xA6d7246323abB43bC046FE8A19Bb9465F224e4C4",
    "0x2B061E6acFE9Ed1c95fFA0E90744031E7e8b1791",
    "0xDD90467181a06adEe4A4D78E19357154c40BeB3a",
    "0x9eA9997229217C9B6E5A6c237ffe1Fb58d1dA775",
    "0xD10feF14a0A88B0711e08252a7c33Ea4975b8565",
    "0x22254f1399F59A2847444b665738163c17Ff607a",
    "0x9A1e59ccd527e8aA7AC184a65C2A08C98E08e859",
    "0xad7546735E4A4C41B034c443372035e18cf65760",
    "0xb4d88EEF061229aD4470FB640407347658b0C4Dc",
    "0x53756032203dfF86DDf47be41DF0E9DEdD14880a",
    "0x67013E7AEEbbbA2C27d5075839F15F40018A7724",
    "0xe77448127000E54BCd019b3a221CA61be8219D0f",
    "0x9700Ae499E255d26AD0d80b49034540c5e34EDD8",
    "0x11aD4eA34C222d6D134C5876567cad52Ae7Bcf5E",
    "0x3779a3487a8B0FecBc1029401b8e70174f86a45b",
    "0x0F7850a00b75e735B538c206bE9a26b7b9857010",
    "0x11F8E60F9Ed28F7DEC52F4F11bC6977Be12aF299",
    "0xa06Db72d9B1CE916b70B3509B3D64F356aAF5126",
    "0x6Aaa4952eF126146D7d17999538A5a1168f038A7",
    "0x15B5ed114fDa128534aB71040d740d76bba55FC3",
    "0x3fc50FC57e0FdFCAAE16F62Ef173DF1adbd6a5EA",
    "0xE09efb5f2371e3D067Ae471A6Df60358796C957F",
    "0xc191EbdfdC45b1484f1707Be0cdc8eB705F4767e",
    "0x353c4551C1cc8E0E155f45FE0D7A5D35391a98a3",
    "0xab48062038cAe796edf538aecf54a9d34C6EF4C5",
    "0xbC79B1A45FC4a01E0b16e955b3263b97C10e4351",
    "0x6a290E495f41A79C54367481BbaeB457Fa6C6FA9",
    "0x830baFF82BDd908a0a66B59954b0663EdA404F0e",
    "0xFB68db260A4Bc95dbcA2376A15776F993251FfE2",
    "0x93736e63590751Ce6854f0fFBBf5830C2e92819c",
    "0xB7212563f5a181e0996486577dE2594dC008F89C",
    "0x212c7623CB79d14ac0BC6a4ecf6098668f314277",
    "0x851E1Ab8187A6A0d084B8eBA455496dD38B7232d",
    "0xE6830477dbd33509Fd1343065Ce7cC9536BAFcab",
    "0x0F7fFf07d21447fB9210A361478684d5DF832F3b",
    "0x348C855E7b7413db981704175f1B86e9342Aa1A1",
    "0xb6c27B1798B319Bef195A979C2365707461A93A3",
    "0x45DE47872eC674BD727E8b6BA719b6E028152b70",
    "0x447e19Fd4874259b66D23B9e4ceaCC0D539F0bD7",
    "0x59acd7dF15C8AB78F5f78B533f7D27a8bc1D9a9C",
    "0x1f9d34E31c7Ba3c83EfFf113a26c5b3fAAEaa5C7",
    "0xbC97DFC22c2f256a9189c0844a1F79497D00ae22",
    "0x245fc26E53b34277F5270FD753900451b5411854",
    "0xD74E2C3C38032d312f52d5b38D89EFE87C81879C",
    "0xd78f1BD38e519D093Ec6880a7B4d0F91EF9D5581",
    "0x2E9fBb3f37CE46194B0ECd886d327480b5552693",
    "0x68628c7D24b9212A20D20DD59643e7237F5F7688",
    "0xFA0c0500AF6d301B7d942880C6c1b0eE53935A57",
    "0x364864E81Fd69b7E38f865c7DdbBF3Aa66Bbc1D5",
    "0xF2455BdD2976F99243eFFE55B41f7004bBCf5F65",
    "0xd430A46686159E5E86d4f7E01dDB07D4714eD77b",
    "0xacf959fa2FDB71c8246c522FA8F5e123F33E4541",
    "0x6E482bBD6E2571A784ec092f2Bc0935508387714",
    "0x72b6558a810dE15CE98158E0dC4c58379De48C97",
    "0xA24AC1710CB9D5589f1b608085bdAB4B142CDDe8",
    "0x406a1345CFF56655bAFb2A44009014dE780eFB1E",
    "0x68d11B74459eb8cDB69F004960C82B9a4694b032",
    "0x6617854eB976B8B38138A4611b4FdB804a9F6AA2",
    "0xb8c25E8C7055a628cCAe9E212fF9191e16AD4ba6",
    "0xBd303D8Fc4d71994b3243391Ee431b55B898Eb42",
    "0x0534c17feB2b7ea9E35e3d4708Bc5011881db06d",
    "0xC7094f156fD2e716D3Cadb11F99199fD9e1BeA66",
    "0xC58e93B0906aCa18598c7Ce906589Bf8aef42657",
    "0x799dDeB950B2C96C20C38cf9E210067d1f8d9872",
    "0x3D9583F1FB9eF7F9D0084C24Ff3B55f211FE111b",
    "0x0624621FAf8F60D319bc6E421DC5D15D45380F18",
    "0xecb49066d84aDB66fa58c8447B1417473D425626",
    "0x268744202AF6E5F67540ab8725e6541bC91c8B1C",
    "0x3AbA83C7Ea86Eff7B82767B4E05822780BA94E5c",
    "0x9CFe152d53FBeEd8c54460298443fA8eCEe78B76",
    "0xa5e55E9F31d52F38E6058DF54D6457bCed6e0266",
    "0x075A17215dE3ec57E35d2BFCEdE749b9a91436E4",
    "0x2B975B80b5FfD23b1D4570729cd2FF4426c00c60",
    "0xAd656375c83021ccc25c960c5F8ec597FD01ae1C",
    "0x836591aDeb98cfc43936aE40E108841d9b4cB359",
    "0xA29721B94475d7BE939Dd000Fbb9531DE6792B15",
    "0x6CD36c9B7307eFe267c81dFe663Df00Fa19dAED0",
    "0x12cB05935907B61e7e1c85D7A847d9496ef0ec4B",
    "0x0C22ee09E72CE0223d21c20d794CD64faB7FBc90",
    "0xCa9BCFf4Baf02455C7D74b96F7C82d16463A0bfF",
    "0x8423D30d8a4534899889FCC531B37e1789ed06d4",
    "0x7FDCd867139F0900CD55b63a99D17D28fc5Fbc14",
    "0xb9E3b2C378c769270072454B04Ad61cAf6184a68",
    "0xD1193c2fF4D40E5AF0B3ADEa9ed50B8E5b43EfDD",
    "0x619BF72a44EfE9e5B69bDbf1A1E7073F8a1eF3F2",
    "0x8868b66705d04bF477C8A6a1401628eFb00254ca",
    "0x5c426D9e68941eeEb046c7EDFA8b7577dF777887",
    "0x47CD2b9c4e1e4c1C5Acb6133Ea39F8db5F4a02DD",
    "0x5F238985B6aD007af2c4D11287F331d1E1e08AFc",
    "0xDEf4F2398A124815CE30EBdfDcB005aC1D456d86",
    "0x49E146191e30281366728Ab95ac23b436254b765",
    "0x3e104d51CCBA52BA78e2f5A475B5C15a975e1104",
    "0xbdd91627aEA321AC84FC200A86242B1B91186d4b",
    "0xe9e5BD09566fE820Ae140Ae78b35e74700D3Dd70",
    "0x103c268eAb879ec6BDdbbb89CEAaa70eC8717d0F",
    "0x0828303eb5e8847fEA7dF76A62AC393f8FD92646",
    "0x1316812d201b6181351AFA8e5Be75e9b4Eef5763",
    "0x40AdD73D6Db93E4F09e1f00Bf7e5D804374405e6",
    "0x2528e69D8e38F6dABa7389c2Af9aA70ea4345023",
    "0xDC59C85f9725ac13fc68894B93530e9ff41B2930",
    "0xe452e1e6D1e64C135Be9392679AB721b94135D66",
    "0x905CdEC7E8dfA9fc9F4B69d045f49309fa0b4563",
    "0x4287f10A57554CE254321b292f0bd1A5aE6bB65F",
    "0xAc7eFBE13a840c2Bc538beCCdEF0823eabddb427",
    "0xB39bac5eC0c1E961e27Dca4934d18812cF695694",
    "0x0287153DD2Bd0808812248A1F4276363E0581351",
    "0x14F8991605A8D7eC763d272bC481466474B2d272",
    "0xbE3E34471AA4B62E5A55ee4e87263b6c25b019C1",
    "0xA2674F1B95E8a4741914F9619feBC7C7Cc5aC8d8",
    "0x360d6753027b5b3bE7daE5b9A3f0a7761bA0c9B5",
    "0x3CAFF9195d164d9ffbAF9e60839af2808D1B1693",
    "0xCe96fDddF41D3247f7d931C6C4B50475a29169F5",
    "0xAa99F2dD7222Ae1AFD183d30430C28272A2bf813",
    "0xe2Da6CE3f1cBb2c133cdbB2E26abeF77AaD89624",
    "0xf426063d59795616d7143646E3a184d56Ec248cc",
    "0xBE522482858d5CE8D9A604A949a4a34Ad5Ee0079",
    "0x43AFf08D3925686A2Fc037A82d0f3e4DAbd1a740",
    "0x2B6e5948c663dBD9d55A3082c5FceB300b73F314",
    "0x4C9475ef741ebF61aefE94A977728592Db6bD41e",
    "0x7AA771e8Fccf20654200cC6c0d7A8f8592712e49",
    "0x34a9Ccf5006E04540d0D97Cf2Ce4e7979A7D7188",
    "0x113b87925C895Ca3b5F623D0f88bdC28a8F94c40",
    "0x12891a32307695E46f16DF957AD65a2776E07Ee5",
    "0x51Bd69FF955C6F972A9b680ACd5E27bf200d4574",
    "0xa6505933F4B6cbB3E71124Cf5Be9c5D6c04460A7",
    "0x7583279c3Fa5cA3D95031B0CDc9dAb40F8Ee277d",
    "0x6059E5A089c2ca33466b2Ca554Da010f0c647326",
    "0xF8AAC85adDA185dCF61AC6465ce8432c8833A31C",
    "0x54E78936Bf69acabA19A29bD1Ea92BCAA04080AD",
    "0xF704863ac928e86b6a47BF2aE55DfF112402bB61",
    "0x5D633D1BaFF1c0f6ce01ebC2f3B2F7B901C25E19",
    "0x370248B8a837CEe612880fAaaf9d995266C39103",
    "0x91B5fAC6201Ea2E8F6416CE0AB3361aC83E11e3E",
    "0x7a05CDD39762df9CC85Ac01E9D66c792412C283B",
    "0x8cA52de0E6cc1bD1Bb3cF7930dB5194bCADdBA14",
    "0xC4fA49140cfe2A235402c71e657D1DBa414C8678",
    "0xF1E02152A75644daaFa3bAB2CA81DC95AC3F4d4f",
    "0x8f5A0c65DD30a8A164B5F049b9D9Be6Cbe3f04b8",
    "0x6a76a36bF09BB6b1282ec0Bc000aE4e949dE1AD9",
    "0xb9D86bd991b6a1C4595bdC716E55DAAF24738AcB",
    "0x2ee58BbF45E2A974dbEc70eFc582D533263030E9",
    "0x5076BB9D900d466E69F21A43e45196cb2571bB03"
  ]
  leaves = leaves.map(x => KECCAK256(x))
  const tree = new MerkleTree(leaves, KECCAK256, { sortPairs: true })
  const root = tree.getRoot().toString('hex')

  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Select amount.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [transactionProof, setProof] = useState([{},{}]);
  const [isWL, setWL] = useState(false);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
//    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
//    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
//    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .publicSaleMint(mintAmount)
      .send({
//        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const claimFreeNFTs = () => {
    let cost = 0;
//    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
//    let totalGasLimit = String(gasLimit);
    let address = blockchain.account;
    address = utils.getAddress(address);
    console.log(address)
    const leaf = KECCAK256(address)
    let proof = tree.getHexProof(leaf)
    console.log(proof);
    const v = tree.verify(proof, leaf, root)
    console.log("Cost: ", totalCostWei);
//    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .whitelistMint(mintAmount, proof)
      .send({
//        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    setMintAmount(newMintAmount);
  };

  const upToFive = () => {
    let newMintAmount = 5;
    setMintAmount(newMintAmount);
  };

  const upToTen = () => {
    let newMintAmount = 10;
    setMintAmount(newMintAmount);
  };

  const upToTwenty = () => {
    let newMintAmount = 20;
    setMintAmount(newMintAmount);
  };

  const upToFifty = () => {
    let newMintAmount = 50;
    setMintAmount(newMintAmount);
  };

  const upToOneH = () => {
    let newMintAmount = 100;
    setMintAmount(newMintAmount);
  };

  const upToFiveH = () => {
    let newMintAmount = 500;
    setMintAmount(newMintAmount);
  };

  const upToOneT = () => {
    let newMintAmount = 1000;
    setMintAmount(newMintAmount);
  };

  const upToTwoT = () => {
    let newMintAmount = 2000;
    setMintAmount(newMintAmount);
  };

  const checkWL = () => {
    console.log(root.toString())
    let address = blockchain.account;
    address = utils.getAddress(address);
    console.log(address);
    const leaf = KECCAK256(address)
    console.log(leaf.toString())
    let proof = tree.getProof(leaf)
    console.log(proof.toString())
    const v = tree.verify(proof, leaf, root)
    console.log(v);
    console.log(tree.toString())
    setProof(proof);
    console.log(transactionProof);
    if(v){
      setWL(true);
    }
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      checkWL();
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
        
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "transparent",
              padding: 24,
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >

                <button className="button-54" role="button">CONNECT</button>
                </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                    
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToFive();
                        }}
                      >
                        <button className="button-54" role="button">5</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToTen();
                        }}
                      >
                        <button className="button-54" role="button">10</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToTwenty();
                        }}
                      >
                        <button className="button-54" role="button">20</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToFifty();
                        }}
                      >
                        <button className="button-54" role="button">50</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToOneH();
                        }}
                      >
                        <button className="button-54" role="button">100</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToFiveH();
                        }}
                      >
                        <button className="button-54" role="button">500</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToOneT();
                        }}
                      >
                        <button className="button-54" role="button">1000</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          upToTwoT();
                        }}
                      >
                        <button className="button-54" role="button">2000</button>
                      </StyledRoundButton>
                    </s.Container>

                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        <button className="button-54" role="button">-</button>
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        <button className="button-54" role="button">+</button>
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      

                 {isWL ? (
                    <>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimFreeNFTs();
                          getData();
                        }}
                      >
                        <button className="button-54" role="button">{claimingNft ? "BUSY" : "WL MINT"}</button>
                      </StyledButton>
                    </>
                    ) : (<>
                    <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        <button className="button-54" role="button">{claimingNft ? "BUSY" : "PUBLIC MINT"}</button>
                      </StyledButton>
                    </>)}
                    
                      </s.Container>
                      <s.SpacerSmall />

                    <s.TextDescription
                        style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}
                      >
                        Funds will be used to buy access to hyped alpha groups and the informations will be streamed to AlphaWarriors Holders.
                      </s.TextDescription>
                      <s.TextDescription
                        style={{ textAlign: "center", color: "#FF0000", maxWidth: "50%"}}
                      >
                        <strong>Alpha Holded Ranks</strong>

                      </s.TextDescription>
                      <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}>1 Simple Alpha</s.TextDescription>
                      <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}>2-5 Bronze Alpha</s.TextDescription>
                      <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}>6-10 Silver Alpha</s.TextDescription>
                      <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}>11-20 Gold Alpha</s.TextDescription>
                      <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}>21-50 Platinum Alpha</s.TextDescription>
                      <s.TextDescription style={{ textAlign: "center", color: "var(--accent-text)", maxWidth: "50%"}}>51+ God Alpha</s.TextDescription>

                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />
    
      </s.Container>
    </s.Screen>
  );
}

export default App;
