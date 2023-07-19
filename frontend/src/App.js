import { createContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import networkChain from "./network-chain.json";

// importing pages
import Home from "./pages/Home/Home";

// importing states selectors and actions
import {
	setAccount,
	setProvider,
	setChainId,
	setSigner,
} from "./slices/config-slice";

// importing services
import loadContract from "./services/load-contract";

// importing ABIs
import RethState from "./abis/RethState.json";
import EthRow from "./abis/EthRow.json";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
]);

export const ContextValues = createContext({
	rethState: null,
	ethRow: null,
});

const App = () => {
	const [rethState, setRethState] = useState(null);
	const [ethRow, setEthRow] = useState(null);

	const dispatch = useDispatch();
	const { account, provider, chainId } = useSelector((state) => state.config);

	const connectWithBlockchain = async () => {
		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			dispatch(setProvider(provider));

			const network = await provider.getNetwork();

			dispatch(setChainId(network.chainId.toString()));

			window.ethereum.on("accountsChanged", async () => {
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});

				dispatch(setAccount(accounts[0]));
				const signer = await provider.getSigner();
				setSigner(signer);
			});
		} catch (error) {
			console.error(error);
		}
	};

	const loadSigner = async () => {
		const signer = await provider.getSigner();
		setSigner(signer);
	};

	useEffect(() => {
		connectWithBlockchain();
	}, []);

	useEffect(() => {
		if (!provider || !chainId) return;

		loadSigner();

		setRethState(
			loadContract(networkChain[chainId].rethState.address, RethState, provider)
		);

		setEthRow(
			loadContract(networkChain[chainId].ethRow.address, EthRow, provider)
		);
	}, [provider, chainId]);

	return (
		<ContextValues.Provider value={{ rethState, ethRow }}>
			<RouterProvider router={router} />
		</ContextValues.Provider>
	);
};

export default App;
