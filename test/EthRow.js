const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
	return ethers.parseEther(n);
};

describe("EthReState", () => {
	let ethReState;
	let buyer, seller, inspector, lender;

	beforeEach(async () => {
		[buyer, seller, inspector, lender] = await ethers.getSigners();

		const EthReState = await ethers.getContractFactory("EthReState");
		ethReState = await EthReState.deploy();
	});

	it("mints an nft from a URI", async () => {
		const URI =
			"https://ipfs.io/ipfs/QmQJc3tWrenPYqqHHWFVTTNxBww3Zagyr2udhPGCYn6mze?filename=1.json";

		let transaction = await ethReState.connect(seller).mint(URI);
		await transaction.wait();

		expect(await ethReState.totalSupply()).to.be.equal(1);
		expect(await ethReState.ownerOf(0)).to.be.equal(seller.address);
	});
});

describe("EthRow", () => {
	let buyer, seller, inspector, lender;
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
			await transaction.wait();
		});

		it("Returns the total NFT supply", async () => {
			expect(await ethReState.totalSupply()).to.be.equal(1);
		});

		it("Checks ownership of the NFT", async () => {
			expect(await ethReState.ownerOf(0)).to.be.equal(seller.address);
		});
	});

	describe("Listing", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 0);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(0, tokens("20"), tokens("10"), inspector.address);
			await transaction.wait();
		});

		it("Updates as listed", async () => {
			expect(await ethRow.listed(0)).to.be.equal(true);
		});

		it("Checks the owner of the NFT", async () => {
			expect(await ethReState.ownerOf(0)).to.be.equal(ethRow.target);
		});

		it("Returns inspector", async () => {
			expect(await ethRow.inspector(0)).to.be.equal(inspector.address);
		});
	});

	describe("Inspection", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 0);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(0, tokens("20"), tokens("10"), inspector.address);
			await transaction.wait();

			transaction = await ethRow.connect(inspector).inspect(0, true);
			await transaction.wait();
		});

		it("Updates inspection status", async () => {
			expect(await ethRow.inspected(0)).to.be.equal(true);
		});
	});

	describe("Reserving", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 0);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(0, tokens("20"), tokens("10"), inspector.address);
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.reserve(0, lender.address, { value: tokens("10") });
			await transaction.wait();
		});

		it("Updates property reservation", async () => {
			expect(await ethRow.reserved(0)).to.be.equal(true);
		});

		it("Returns the buyer", async () => {
			expect(await ethRow.buyer(0)).to.be.equal(buyer.address);
		});

		it("Returns the lender", async () => {
			expect(await ethRow.lender(0)).to.be.equal(lender.address);
		});

		it("deposits earnest money", async () => {
			expect(await ethRow.getBalance()).to.be.greaterThanOrEqual(tokens("10"));
		});
	});

	describe("Approval", () => {
		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 0);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(0, tokens("20"), tokens("10"), inspector.address);
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.reserve(0, lender.address, { value: tokens("10") });
			await transaction.wait();

			transaction = await ethRow.connect(buyer).approve(0);
			await transaction.wait();

			transaction = await ethRow
				.connect(lender)
				.approve(0, { value: tokens("10") });
			await transaction.wait();

			transaction = await ethRow.connect(seller).approve(0);
			await transaction.wait();
		});

		it("Updates buyer approval", async () => {
			expect(await ethRow.approved(0, buyer.address)).to.be.equal(true);
		});

		it("Updates lender approval", async () => {
			expect(await ethRow.approved(0, lender.address)).to.be.equal(true);
		});

		it("Updates seller approval", async () => {
			expect(await ethRow.approved(0, seller.address)).to.be.equal(true);
		});

		it("Lends the remaining amount", async () => {
			expect(await ethRow.getBalance()).to.be.greaterThanOrEqual(tokens("20"));
			expect(await ethRow.lended(0)).to.be.equal(true);
		});
	});

	describe("Finalizing", () => {
		let contractBalance;

		beforeEach(async () => {
			let transaction = await ethReState.connect(seller).mint(URI);
			await transaction.wait();

			transaction = await ethReState.connect(seller).approve(ethRow.target, 0);
			await transaction.wait();

			transaction = await ethRow
				.connect(seller)
				.list(0, tokens("20"), tokens("10"), inspector.address);
			await transaction.wait();

			transaction = await ethRow.connect(inspector).inspect(0, true);
			await transaction.wait();

			transaction = await ethRow
				.connect(buyer)
				.reserve(0, lender.address, { value: tokens("10") });
			await transaction.wait();

			transaction = await ethRow.connect(buyer).approve(0);
			await transaction.wait();

			transaction = await ethRow
				.connect(lender)
				.approve(0, { value: tokens("10") });
			await transaction.wait();

			transaction = await ethRow.connect(seller).approve(0);
			await transaction.wait();

			contractBalance = await ethRow.getBalance();

			transaction = await ethRow.finalize(0);
			await transaction.wait();
		});

		it("Pays the seller the purchase amount", async () => {
			expect((await ethRow.getBalance()) + tokens("20")).to.be.equal(
				contractBalance
			);
		});

		it("Updates ownership to the buyer", async () => {
			expect(await ethReState.ownerOf(0)).to.be.equal(buyer.address);
		});

		it("Updates as not listed", async () => {
			expect(await ethRow.listed(0)).to.be.equal(false);
		});
	});
});
