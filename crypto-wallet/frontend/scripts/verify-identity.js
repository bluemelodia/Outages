import { apiCall, withTimeout } from "./api.js";

function showVerifyIdentityModal() {
    return new Promise((resolve, reject) => {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'verify-identity-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.position = 'relative';

        // Close button
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '0.5rem';
        closeBtn.style.right = '0.75rem';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '1.5rem';
        closeBtn.addEventListener('click', () => {
            removeModal(modal);
            reject(); // Reject the promise if user closes modal
        });

        // Spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner active';

        // Message
        const message = document.createElement('p');
        message.textContent = 'Verifying your identity...';
        message.style.marginTop = '1rem';
        message.style.color = '#374151';
        message.style.fontWeight = '600';

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(spinner);
        modalContent.appendChild(message);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Disable interaction with page
        document.body.style.pointerEvents = 'none';
        modal.style.pointerEvents = 'auto';

		getConfig().then(cfg => {
			logger.info('Initiate identity verification...');
			verifyIdentity(cfg, modal);
		});
    });
}

function verifyIdentity(config, modal) {
	// Call backend API with timeout
	withTimeout(apiCall(getVerifyIdentityURL()), 5000)
		.then(data => {
			console.log("Identity verified:", data);
			removeModal(modal);
			resolve(data);
		})
		.catch(error => {
			removeModal(modal);
			reject(error);
		});
}

function removeModal(modal) {
	modal.remove();
	document.body.style.pointerEvents = '';
}

export {
	showVerifyIdentityModal
};