import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import networkChain from "./network-chain.json";

// importing pages
import Home from "./pages/Home/Home";
import Properties from "./pages/Properties/Properties";
import Dashboard from "./pages/Dashboard/Dashboard";
import Publish from "./pages/Publish/Publish";

// importing states selectors and actions
import {
	setAccount,
	setProvider,
	setChainId,
	setSigner,
} from "./slices/config-slice";
import { setUser } from "./slices/common-slice";

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
	{
		path: "/properties",
		element: <Properties />,
	},
	{
		path: "/dashboard",
		element: <Dashboard />,
	},
	{
		path: "/publish",
		element: <Publish />,
	},
]);

export const ContextValues = createContext({
	rethState: null,
	ethRow: null,
});

const App = () => {
	const dispatch = useDispatch();

	const { provider, chainId } = useSelector((state) => state.config);
	const [rethState, setRethState] = useState(null);
	const [ethRow, setEthRow] = useState(null);

	useEffect(() => {
		connectWithBlockchain();
	}, []);

	useEffect(() => {
		if (!provider || !chainId) return;

		setRethState(
			loadContract(networkChain[chainId].rethState.address, RethState, provider)
		);

		setEthRow(
			loadContract(networkChain[chainId].ethRow.address, EthRow, provider)
		);
	}, [provider, chainId]);

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
				dispatch(setSigner(signer));
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ContextValues.Provider value={{ rethState, ethRow }}>
			<RouterProvider router={router} />
		</ContextValues.Provider>
	);
};

export default App;
