const hre = require("hardhat");

async function main() {
	const EthReState = await hre.ethers.deployContract("EthReState");
	await EthReState.waitForDeployment();
	console.log(`EthReState contract deployed to ${EthReState.target}`);

	const EthRow = await hre.ethers.deployContract("EthRow", [EthReState.target]);
	await EthRow.waitForDeployment();
	console.log(`EthRow contract deployed to ${EthRow.target}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
