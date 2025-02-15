import { Link, useNavigate } from "react-router-dom";
import type React from "react";

interface NavbarProps {
	darkMode: boolean;
	toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
	const isAuthenticated = !!localStorage.getItem("token");
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-lg p-4">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-xl font-bold">Stock Trading Dashboard</h1>
				<div className="flex items-center space-x-4">
					{isAuthenticated ? (
						<button
							type="button"
							onClick={handleLogout}
							className="p-2 bg-red-500 text-white rounded-lg"
						>
							Logout
						</button>
					) : (
						<>
							<Link
								to="/signup"
								className="p-2 bg-blue-500 text-white rounded-lg"
							>
								Sign Up
							</Link>
							<Link
								to="/login"
								className="p-2 bg-blue-500 text-white rounded-lg"
							>
								Login
							</Link>
						</>
					)}
					<button
						type="button"
						onClick={toggleDarkMode}
						className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
					>
						{darkMode ? "🌙" : "☀️"}
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
