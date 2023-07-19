import { ethers } from "ethers";

const loadContract = (address, abi, provider) => {
	return new ethers.Contract(address, abi, provider);
};

export default loadContract;
