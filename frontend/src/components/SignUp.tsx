import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSignUp = async () => {
		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
				email,
				password,
			});
			navigate("/login");
		} catch (error) {
			setError("Failed to sign up. Please try again.");
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="p-2 border rounded w-full mb-4"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="p-2 border rounded w-full mb-4"
				/>
				<button
					type="button"
					onClick={handleSignUp}
					className="p-2 bg-blue-500 text-white rounded w-full"
				>
					Sign Up
				</button>
			</div>
		</div>
	);
};

export default SignUp;
