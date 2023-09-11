const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const web3 = require("web3");

const tokens = (n) => {
	return ethers.parseEther(n);
};

describe("EthReState", () => {
	let ethReState;
	let buyer, seller;

	beforeEach(async () => {
		[buyer, seller] = await ethers.getSigners();

		const EthReState = await ethers.getContractFactory("EthReState");
		ethReState = await EthReState.deploy();
	});

	it("mints an nft from a URI", async () => {
		const URI =
			"https://ipfs.io/ipfs/QmQJc3tWrenPYqqHHWFVTTNxBww3Zagyr2udhPGCYn6mze?filename=1.json";

		let transaction = await ethReState.connect(seller).mint(URI);
		await transaction.wait();

		expect(await ethReState.totalSupply()).to.be.equal(1);
		expect(await ethReState.ownerOf(1)).to.be.equal(seller.address);
	});
});

describe("EthRow", () => {
	let buyer, seller;
	let ethReState, ethRow;
	const URI =
		"https://ipfs.io/ipfs/QmQJc3tWrenPYqqHHWFVTTNxBww3Zagyr2udhPGCYn6mze?filename=1.json";

	beforeEach(async () => {
		[buyer, seller, inspector, lender] = await ethers.getSigners();

		const EthReState = await ethers.getContractFactory("EthReState");
		ethReState = await EthReState.deploy();

		const EthRow = await ethers.getContractFactory("EthRow");
		ethRow = await EthRow.deploy(ethReState.target);
	});

	describe("Minting", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			const transactionResult = await transaction.wait();
			// const receipt = await provider.getTransactionReceipt(
			// 	transactionResult.hash
			// );
			// tokenID = web3.utils.hexToNumber(receipt.logs[0].topics[3]);
		});

		it("Returns the total NFT supply", async () => {
			expect(await ethReState.totalSupply()).to.be.equal(1);
		});

		it("Checks ownership of the NFT", async () => {
			expect(await ethReState.ownerOf(1)).to.be.equal(seller.address);
		});
	});

	describe("Listing", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			const transactionResult = await transaction.wait();
			// const receipt = await provider.getTransactionReceipt(
			// 	transactionResult.hash
			// );
			// tokenID = web3.utils.hexToNumber(receipt.logs[0].topics[3]);

			transaction = await ethReState.connect(seller).approve(ethRow.target, 1);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(1, tokens("20"), tokens("10"));
			await transaction.wait();
		});

		it("Updates as listed", async () => {
			expect(await ethRow.listed(1)).to.be.equal(true);
		});

		it("Checks the owner of the NFT", async () => {
			expect(await ethReState.ownerOf(1)).to.be.equal(ethRow.target);
		});

		// it("Returns inspector", async () => {
		// 	expect(await ethRow.inspector(1)).to.be.equal(inspector.address);
		// });
	});

	// describe("Inspection", () => {
	// 	beforeEach(async () => {
	// 		let transaction = await ethReState.connect(seller).mint(URI);
	// 		await transaction.wait();

	// 		transaction = await ethReState.connect(seller).approve(ethRow.target, 1);
	// 		await transaction.wait();

	// 		transaction = await ethRow
	// 			.connect(seller)
	// 			.list(1, tokens("20"), tokens("10"), inspector.address);
	// 		await transaction.wait();

	// 		transaction = await ethRow.connect(inspector).inspect(1, true);
	// 		await transaction.wait();
	// 	});

	// 	it("Updates inspection status", async () => {
	// 		expect(await ethRow.inspected(1)).to.be.equal(true);
	// 	});
	// });

	describe("Reserving", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			const transactionResult = await transaction.wait();
			// const receipt = await provider.getTransactionReceipt(
			// 	transactionResult.hash
			// );
			// tokenID = web3.utils.hexToNumber(receipt.logs[0].topics[3]);

			transaction = await ethReState.connect(seller).approve(ethRow.target, 1);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(1, tokens("20"), tokens("10"));
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.reserve(1, { value: tokens("10") });
			await transaction.wait();
		});

		it("Updates property reservation", async () => {
			expect(await ethRow.reserved(1)).to.be.equal(true);
		});

		it("Returns the buyer", async () => {
			expect(await ethRow.buyer(1)).to.be.equal(buyer.address);
		});

		// it("Returns the lender", async () => {
		// 	expect(await ethRow.lender(1)).to.be.equal(lender.address);
		// });

		it("deposits earnest money", async () => {
			expect(await ethRow.getBalance()).to.be.greaterThanOrEqual(tokens("10"));
		});
	});

	describe("Approval", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 1);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(1, tokens("20"), tokens("10"));
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.reserve(1, { value: tokens("10") });
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.approve(1, { value: tokens("10") });
			await transaction.wait();

			// transaction = await ethRow
			// 	.connect(lender)
			// 	.approve(1, { value: tokens("10") });
			// await transaction.wait();

			transaction = await ethRow.connect(seller).approve(1);
			await transaction.wait();
		});

		it("Updates buyer approval", async () => {
			expect(await ethRow.approved(1, buyer.address)).to.be.equal(true);
		});

		// it("Updates lender approval", async () => {
		// 	expect(await ethRow.approved(1, lender.address)).to.be.equal(true);
		// });

		it("Updates seller approval", async () => {
			expect(await ethRow.approved(1, seller.address)).to.be.equal(true);
		});

		it("Pays the remaining amount", async () => {
			expect(await ethRow.getBalance()).to.be.greaterThanOrEqual(tokens("20"));
			// expect(await ethRow.lended(1)).to.be.equal(true);
		});
	});

	describe("Finalizing", () => {
		let contractBalanceBefore, contractBalanceAfter;

		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 1);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(1, tokens("20"), tokens("10"));
			await transaction.wait();

			// transaction = await ethRow.connect(inspector).inspect(1, true);
			// await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.reserve(1, { value: tokens("10") });
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.approve(1, { value: tokens("10") });
			await transaction.wait();

			contractBalanceBefore = await ethRow.getBalance();

			// transaction = await ethRow
			// 	.connect(lender)
			// 	.approve(1, { value: tokens("10") });
			// await transaction.wait();

			transaction = await ethRow.connect(seller).approve(1);
			await transaction.wait();

			transaction = await ethRow.finalize(1);
			await transaction.wait();

			contractBalanceAfter = await ethRow.getBalance();
		});

		it("Updates property as sold", async () => {
			expect(await ethRow.sold(1, seller.address, buyer.address)).to.be.equal(
				true
			);
		});

		it("Updates as not listed", async () => {
			expect(await ethRow.listed(1)).to.be.equal(false);
		});

		it("Updates ownership to the buyer", async () => {
			expect(await ethReState.ownerOf(1)).to.be.equal(buyer.address);
		});

		it("Pays the seller the purchase amount", async () => {
			expect(contractBalanceAfter + tokens("20")).to.be.equal(
				contractBalanceBefore
			);
			// expect(balanceAftere).to.be.equal(balanceBefore + tokens("20"));
		});
	});
});
