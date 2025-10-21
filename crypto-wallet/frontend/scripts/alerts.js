function setupAlerts() {
	const modal = document.getElementById("custom-alert");
	const titleEl = document.getElementById("custom-alert-title");
	const messageEl = document.getElementById("custom-alert-message");
	const okBtn = document.getElementById("custom-alert-ok");

	// Override alert
	window.alert = function (inputTitle, inputMessage) {
		let title = "";
		let message = "";

		if (typeof inputTitle === "string") {
			title = inputTitle;
		} else {
			title = "Alert"
		}

		if (typeof inputMessage === "string") {
			message = inputMessage;
		} else {
			message = ""
		}

		titleEl.textContent = title;
		messageEl.innerHTML = message.replace(/\n/g, '<br>');

		modal.classList.add("active");

		return new Promise(resolve => {
			okBtn.onclick = () => {
				modal.classList.remove("active");
				resolve();
			};
		});
	};
}

export { 
	setupAlerts
};