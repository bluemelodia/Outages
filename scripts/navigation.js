import { logoutUser } from "./auth.js";
import { loadChangeCredentialsPage } from "./credentials.js";
import { loadSendCryptoPage } from "./send-crypto.js";
import { loadTransactions } from "./transactions.js";

let currentPage = 'menu';

const menuItems = [
	{ label: 'Send Crypto', action: () => navigateTo('send-crypto') },
	{ label: 'Transactions', action: () => navigateTo('transactions') },
	{ label: 'Change Credentials', action: () => navigateTo('credentials') },
	{ label: 'Logout', action: logoutUser }
];

function hideMenu() {
	document.getElementById("menu-page").classList.remove("active");
}

function showMenu() {
	document.getElementById("menu-page").classList.add("active");

	const menuContainer = document.getElementById('menu-items');

	// Clear existing menu items (optional, if rebuilding)
	const existingItems = menuContainer.querySelectorAll('.menu-item');
	existingItems.forEach(item => item.remove());

	// Create and append each menu item
	menuItems.forEach(item => {
		const menuItem = document.createElement('div');
		menuItem.className = 'menu-item';

		const span = document.createElement('span');
		span.textContent = item.label;

		menuItem.appendChild(span);
		menuItem.addEventListener('click', item.action);

		menuContainer.appendChild(menuItem);
	});
}

function navigateTo(pageId) {
	// Hide all pages
	document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
	// Show the selected page
	document.getElementById(`${pageId}-page`).classList.add('active');

	if (pageId === 'transactions') {
		loadTransactions();
	} else if (pageId === 'send-crypto') {
		loadSendCryptoPage();
	}

	// Only render password fields when navigating to credentials
	if (pageId === 'credentials') {
		loadChangeCredentialsPage();
	}
}

export {
	hideMenu,
	showMenu,
	navigateTo
};