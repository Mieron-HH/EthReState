import React, { useEffect, useState } from "react";
import "./_login.scss";
import { useDispatch } from "react-redux";
import { BiX } from "react-icons/bi";

// importing services
import { getCurrentUser, loginUser } from "../../services/api-calls";

// importing actions
import { setLoginFormDisplayed, setUser } from "../../slices/common-slice";

const Login = () => {
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	const [emailLabelDisplayed, setEmailLabelDisplayed] = useState(false);
	const [passwordLabelDisplayed, setPasswordLabelDisplayed] = useState(false);

	useEffect(() => {
		return () => {
			setEmail("");
			setPassword("");
			setLoginError("");
			setEmailLabelDisplayed(false);
			setPasswordLabelDisplayed(false);
		};
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();

		const { data, error } = await loginUser(email, password);

		if (data) {
			const data = await getCurrentUser();
			console.log({ data });
			dispatch(setUser(data));
			dispatch(setLoginFormDisplayed(false));
		} else if (error !== "") {
			setLoginError(error);
		}
	};

	return (
		<div className="login-container">
			<div className="logo-container">
				<img src={require("../../images/Logo.png")} alt="" />
			</div>

			{loginError !== "" && (
				<div className="error-message-container">
					<div>{loginError}</div>

					<BiX className="icon" onClick={() => setLoginError("")} />
				</div>
			)}

			<div className="form-container">
				<div className="input-container">
					<div className="input-group">
						{emailLabelDisplayed && (
							<label className="input-label">Email</label>
						)}

						<input
							className="input-item"
							type="text"
							value={email}
							onChange={(value) => {
								setEmail(value.target.value);

								if (value.target.value !== "") setEmailLabelDisplayed(true);
								else setEmailLabelDisplayed(false);
							}}
							placeholder="Email"
						/>
					</div>

					<div className="input-group">
						{passwordLabelDisplayed && (
							<label className="input-label">Password</label>
						)}

						<input
							className="input-item"
							type="password"
							value={password}
							onChange={(value) => {
								setPassword(value.target.value);

								if (value.target.value !== "") setPasswordLabelDisplayed(true);
								else setPasswordLabelDisplayed(false);
							}}
							placeholder="Password"
						/>
					</div>
				</div>

				<button type="button" className="login-button" onClick={handleLogin}>
					Login
				</button>
			</div>
		</div>
	);
};

export default Login;
