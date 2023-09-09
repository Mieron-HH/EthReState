const hre = require("hardhat");

const fs = require("fs").promises;
const solc = require("solc");

async function main() {
	// const [deployer] = await hre.ethers.getSigners();
	// console.log(`Deploying contracts with the account: ${deployer.address}`);

	// const EthReState = await ethers.deployContract("EthReState");
	// console.log({ EthReState });
	// console.log(`EthReState contract deployed to ${EthReState.target}`);

	// const EthRow = await ethers.deployContract("EthRow", [EthReState.target]);
	// console.log(`EthRow contract deployed to ${EthRow.target}`);

	const sourceCode = await fs.readFile("../contracts/EthReState.sol", "utf8");
	// Compile the source code and retrieve the ABI and Bytecode
	const { abi, bytecode } = compile(sourceCode, "EthReState");
	// Store the ABI and Bytecode into a JSON file
	const artifact = JSON.stringify({ abi, bytecode }, null, 2);
	await fs.writeFile("Demo.json", artifact);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
