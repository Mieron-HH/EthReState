import { createBrowserRouter, RouterProvider } from "react-router-dom";

// importing pages
import Home from "./pages/Home/Home";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
