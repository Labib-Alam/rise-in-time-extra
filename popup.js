//________________________________________________________________________________loading_popup___________________________________________________________________________________\\

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.closePopup) {
		const Loading = document.getElementById("Loading");
		Loading.style.display = "block";
		// const menuItems = document.querySelectorAll('.menu');
		// menuItems.forEach(item => { item.style.display = 'block'; });
		setTimeout(() => {
			window.close();
		}, 50);
	}
});
//chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//	if (request.closePopup) {
//		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//			// Check if the active tab is the sender tab
//			if (tabs[0].id === sender.tab.id) {
//				const Loading = document.getElementById("Loading");
//				Loading.style.display = "block";
//				// const menuItems = document.querySelectorAll('.menu');
//				// menuItems.forEach(item => { item.style.display = 'block'; });
//				setTimeout(() => {
//					window.close();
//				}, 50);
//			}
//		});
//	}
//});

//________________________________________________________________________________variables___________________________________________________________________________________\\

let fillColor_attack = "#fc0303";
let fillColor_mining = "#03e8fc";
let fillColor_recruting = "#fc9003";
let fillColor_deffence = "#2030df";
let fillColor_speedIsland = "#42b336";
let fillColor_speed = "#83ff75";
let fillColor_luck = "#8d36ff";
let arti_visible = false;
let arti_active = false;
let pfp_visible = false;
let pfp_active = false;
let hide_txt_visible = false;
let hide_txt_active = false;
let Search_user_visible = false;
let Search_user_active = false;

//________________________________________________________________________________Artifact___________________________________________________________________________________\\

// Add event listeners to color input fields
document.getElementById("fillColor_attack").addEventListener("input", () => {
	fillColor_attack = document.getElementById("fillColor_attack").value;
	triggerChanges();
});

document.getElementById("fillColor_mining").addEventListener("input", () => {
	fillColor_mining = document.getElementById("fillColor_mining").value;
	triggerChanges();
});

document.getElementById("fillColor_recruting").addEventListener("input", () => {
	fillColor_recruting = document.getElementById("fillColor_recruting").value;
	triggerChanges();
});

document.getElementById("fillColor_deffence").addEventListener("input", () => {
	fillColor_deffence = document.getElementById("fillColor_deffence").value;
	triggerChanges();
});

document
	.getElementById("fillColor_speedIsland")
	.addEventListener("input", () => {
		fillColor_speedIsland = document.getElementById(
			"fillColor_speedIsland"
		).value;
		triggerChanges();
	});

document.getElementById("fillColor_speed").addEventListener("input", () => {
	fillColor_speed = document.getElementById("fillColor_speed").value;
	triggerChanges();
});

document.getElementById("fillColor_luck").addEventListener("input", () => {
	fillColor_luck = document.getElementById("fillColor_luck").value;
	triggerChanges();
});
// Get the checkbox element
const artifactActive = document.getElementById("arti_active");
// Listen for changes on the checkbox
artifactActive.addEventListener("change", () => {
	if (artifactActive.checked) {
		arti_active = true;
		// Add any additional actions you want to trigger when the switch is on
	} else {
		arti_active = false;
		// Add any additional actions you want to trigger when the switch is off
	}
});

function triggerChanges() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			function: applyChanges,
			args: [
				fillColor_attack,
				fillColor_mining,
				fillColor_recruting,
				fillColor_deffence,
				fillColor_speedIsland,
				fillColor_speed,
				fillColor_luck,
			],
		});
	});
}

function applyChanges(
	fillColor_attack,
	fillColor_mining,
	fillColor_recruting,
	fillColor_deffence,
	fillColor_speedIsland,
	fillColor_speed,
	fillColor_luck
) {
	const svgPaths = [
		{
			selector: 'path[data-v-546e1c28][fill="#b31919"]',
			color: fillColor_attack,
		},
		{
			selector: 'path[data-v-546e1c28][fill="#1d8fc9"]',
			color: fillColor_mining,
		},
		{
			selector: 'path[data-v-546e1c28][fill="#cfbf17"]',
			color: fillColor_recruting,
		},
		{
			selector: 'path[data-v-546e1c28][fill="#2030df"]',
			color: fillColor_deffence,
		},
		{
			selector: 'path[data-v-546e1c28][fill="#19b366"]',
			color: fillColor_speedIsland,
		},
		{
			selector: 'path[data-v-546e1c28][fill="#4cb319"]',
			color: fillColor_speed,
		},
		{
			selector: 'path[data-v-546e1c28][fill="#bb6f18"]',
			color: fillColor_luck,
		},
	];
	if (arti_active) {
		svgPaths.forEach(({ selector, color }) => {
			const svgPath = document.querySelector(selector);
			if (svgPath) {
				svgPath.setAttribute("fill", color);
			} else {
				//console.log(`SVG path with selector ${selector} not found.`);
			}
		});
	}
}

// Load stored color settings and apply them to input fields
function loadSettings() {
	chrome.storage.sync.get(
		[
			"fillColor_attack",
			"fillColor_mining",
			"fillColor_recruting",
			"fillColor_deffence",
			"fillColor_speedIsland",
			"fillColor_speed",
			"fillColor_luck",
		],
		(data) => {
			document.getElementById("fillColor_attack").value =
				data.fillColor_attack || "#fc0303";
			document.getElementById("fillColor_mining").value =
				data.fillColor_mining || "#03e8fc";
			document.getElementById("fillColor_recruting").value =
				data.fillColor_recruting || "#fc9003";
			document.getElementById("fillColor_deffence").value =
				data.fillColor_deffence || "#2030df";
			document.getElementById("fillColor_speedIsland").value =
				data.fillColor_speedIsland || "#42b336";
			document.getElementById("fillColor_speed").value =
				data.fillColor_speed || "#83ff75";
			document.getElementById("fillColor_luck").value =
				data.fillColor_luck || "#8d36ff";
		}
	);
}

// Save the selected colors to chrome.storage
function saveSettings() {
	const settings = {
		fillColor_attack: document.getElementById("fillColor_attack").value,
		fillColor_mining: document.getElementById("fillColor_mining").value,
		fillColor_recruting: document.getElementById("fillColor_recruting")
			.value,
		fillColor_deffence: document.getElementById("fillColor_deffence").value,
		fillColor_speedIsland: document.getElementById("fillColor_speedIsland")
			.value,
		fillColor_speed: document.getElementById("fillColor_speed").value,
		fillColor_luck: document.getElementById("fillColor_luck").value,
	};

	chrome.storage.sync.set(settings, () => {
		console.log("Settings saved", settings);
		triggerChanges();
	});
}

// Add event listeners to color input fields
document
	.getElementById("fillColor_attack")
	.addEventListener("input", saveSettings);
document
	.getElementById("fillColor_mining")
	.addEventListener("input", saveSettings);
document
	.getElementById("fillColor_recruting")
	.addEventListener("input", saveSettings);
document
	.getElementById("fillColor_deffence")
	.addEventListener("input", saveSettings);
document
	.getElementById("fillColor_speedIsland")
	.addEventListener("input", saveSettings);
document
	.getElementById("fillColor_speed")
	.addEventListener("input", saveSettings);
document
	.getElementById("fillColor_luck")
	.addEventListener("input", saveSettings);

// Load the stored settings when the popup is opened
document.addEventListener("DOMContentLoaded", loadSettings);

document.getElementById("arti_drop").addEventListener("click", () => {
	if (arti_visible) {
		arti_visible = false;
		document.getElementById("Artifact_color").style.display = "none";
	} else {
		arti_visible = true;
		document.getElementById("Artifact_color").style.display = "block";
	}
});

const artiActive = document.getElementById("arti_active");

// Load the saved state from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
	const savedState = localStorage.getItem("arti_active_state");
	if (savedState === "true") {
		artiActive.checked = true;
	} else {
		artiActive.checked = false;
	}
	console.log(savedState);
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { artiActive: savedState });
	});
});

// Save the state to localStorage whenever the switch is toggled
artiActive.addEventListener("change", () => {
	const isChecked = artiActive.checked;
	localStorage.setItem("arti_active_state", isChecked);
});

document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("arti_active");

	// Load saved state
	chrome.storage.sync.get("artiActive", function (data) {
		checkbox.checked = data.artiActive || false;
	});

	checkbox.addEventListener("change", function () {
		const isActive = checkbox.checked;

		// Save state
		chrome.storage.sync.set({ artiActive: isActive });

		// Send message to content script
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { artiActive: isActive });
			}
		);
	});
});

//________________________________________________________________________________custom_pfp___________________________________________________________________________________\\

let val = console.log(localStorage.getItem("selectedImageValue"));

document.getElementById("pfp_drop").addEventListener("click", () => {
	if (pfp_visible) {
		pfp_visible = false;
		document.getElementById("custom_pfp").style.display = "none";
	} else {
		pfp_visible = true;
		document.getElementById("custom_pfp").style.display = "block";
	}
});

const pfp_Active = document.getElementById("pfp_active");

// Load the saved state from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
	const savedState = localStorage.getItem("pfp_active_state");
	if (savedState === "true") {
		pfp_Active.checked = true;
	} else {
		pfp_Active.checked = false;
	}
});

// Save the state to localStorage whenever the switch is toggled
pfp_Active.addEventListener("change", () => {
	const isChecked = pfp_Active.checked;
	localStorage.setItem("pfp_active_state", isChecked);
});

const images = document.querySelectorAll("#image-container img");
const selectedClass = "selected-image-border";

// Function to load the saved image value from localStorage
function loadSelectedImage() {
	const savedValue = localStorage.getItem("selectedImageValue");
	console.log(localStorage.getItem("selectedImageValue"));
	if (savedValue) {
		images.forEach((image) => {
			if (image.getAttribute("data-value") === savedValue) {
				image.classList.add(selectedClass);
				updateDOMElementClass(savedValue);
			}
		});
	}
}

// Function to update the class of the DOM element on the website
function updateDOMElementClass(value) {
	const mainDiv = document.querySelector("div[data-v-06630c0a]");
	if (mainDiv) {
		const profileIconDiv = mainDiv.querySelector(".profile-icon");
		const generalInfoSectionDiv = mainDiv.querySelector(
			".general-info-section"
		);
		if (profileIconDiv && generalInfoSectionDiv) {
			const messageButtonDiv =
				generalInfoSectionDiv.querySelector(".message-button");
			let i = 0;
			if (!messageButtonDiv) {
				while (i < 25) {
					profileIconDiv.classList.remove("p-icon-" + i);
					i++;
				}
				profileIconDiv.classList.add(value);
			}
		}
	}
	const targetElement = document.querySelector(
		"[data-v-62f8e528][data-v-e22ea070]"
	);
	if (targetElement) {
		//targetElement.className = '';
		let i = 0;
		while (i < 25) {
			targetElement.classList.remove("p-icon-" + i);
			i++;
		}
		targetElement.classList.add(value);
	}
	const menu_div = document.querySelector(".menuu");
	if (menu_div) {
		const profileIconMenu = menu_div.querySelector(".profile-icon");
		let i = 0;
		if (profileIconMenu) {
			while (i < 25) {
				profileIconMenu.classList.remove("p-icon-" + i);
				i++;
			}
			profileIconMenu.classList.add(value);
		}
	}
	const chat_div = document.querySelector(".self");
	if (chat_div) {
		const profileIconChat = chat_div.querySelector(".message-icon");
		let i = 0;
		if (profileIconChat) {
			while (i < 25) {
				profileIconChat.classList.remove("p-icon-" + i);
				i++;
			}
			profileIconChat.classList.add(value);
		}
	}
	//const targetElement3 =document.querySelector('.message-icon');
	//if (targetElement3 != null) {
	//	targetElement3.classList.remove("p-icon-" + i);
	//}
	//if (targetElement != null) {
	//	targetElement3.classList.add(pfp);
	//}
}

// Add click event listeners to images
images.forEach((image) => {
	image.addEventListener("click", function () {
		// Remove the border from any previously selected image
		images.forEach((img) => img.classList.remove(selectedClass));

		// Add a red border to the clicked image
		this.classList.add(selectedClass);

		// Save the selected image's value to localStorage
		const selectedValue = this.getAttribute("data-value");
		localStorage.setItem("selectedImageValue", selectedValue);

		// Update the class of the target DOM element
		updateDOMElementClass(selectedValue);
	});
});

// Load the saved image on popup open
loadSelectedImage();

// Assuming this is part of the popup.js script
document.addEventListener("DOMContentLoaded", function () {
	// Function to send a message to the content script
	function updateDOMElementClass(value) {
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "updateClass",
					value: value,
				});
			}
		);
	}

	// Rest of your code to handle image selection...
	const images = document.querySelectorAll("#image-container img");
	images.forEach((image) => {
		image.addEventListener("click", function () {
			// ...existing code...
			let selectedValue = this.getAttribute("data-value");
			updateDOMElementClass(selectedValue);
		});
	});
	updateDOMElementClass(localStorage.getItem("selectedImageValue"));
	// Load the selected image on popup open...
});

const pfpActive = document.getElementById("pfp_active");

// Load the saved state from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
	const savedState = localStorage.getItem("pfp_active_state");
	if (savedState === "true") {
		pfpActive.checked = true;
	} else {
		pfpActive.checked = false;
	}
	console.log(savedState);
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { pfpActive: savedState });
	});
});

// Save the state to localStorage whenever the switch is toggled
pfpActive.addEventListener("change", () => {
	const isChecked = pfpActive.checked;
	localStorage.setItem("pfp_active_state", isChecked);
});

document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("pfp_active");

	// Load saved state
	chrome.storage.sync.get("pfpActive", function (data) {
		checkbox.checked = data.pfpActive || false;
	});

	checkbox.addEventListener("change", function () {
		const isActive = checkbox.checked;

		// Save state
		chrome.storage.sync.set({ pfpActive: isActive });

		// Send message to content script
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { pfpActive: isActive });
			}
		);
	});
});

//________________________________________________________________________________hide_txt___________________________________________________________________________________\\

const hide_txt_ = document.getElementById("text_hide_active");
// Listen for changes on the checkbox
hide_txt_.addEventListener("change", () => {
	if (hide_txt_.checked) {
		hide_txt_active = true;
		// Add any additional actions you want to trigger when the switch is on
	} else {
		hide_txt_active = false;
		// Add any additional actions you want to trigger when the switch is off
	}
});

document.getElementById("hide_txt_drop").addEventListener("click", () => {
	if (hide_txt_visible) {
		hide_txt_visible = false;
		document.getElementById("hide_txt").style.display = "none";
	} else {
		hide_txt_visible = true;
		document.getElementById("hide_txt").style.display = "block";
	}
});

document.addEventListener("DOMContentLoaded", () => {
	// Load the saved state from localStorage when the page loads
	const savedState_txt = localStorage.getItem("hide_txt_active_state");
	if (savedState_txt === "true") {
		hide_txt_.checked = true;
	} else {
		hide_txt_.checked = false;
	}

	// Save the state to localStorage whenever the switch is toggled
	hide_txt_.addEventListener("change", () => {
		const isChecked_txt = hide_txt_.checked;
		localStorage.setItem("hide_txt_active_state", isChecked_txt);

		// Communicate the state to the content script
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { hideTxt: isChecked_txt });
		});
	});
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { hideTxt: hide_txt_.checked });
	});
});
//________________________________________________________________________________Search_user___________________________________________________________________________________\\

document.getElementById("Search_user_drop").addEventListener("click", () => {
	if (Search_user_visible) {
		Search_user_visible = false;
		document.getElementById("Search_user").style.display = "none";
	} else {
		Search_user_visible = true;
		document.getElementById("Search_user").style.display = "block";
	}
});
const Search_ = document.getElementById("Search_active");
// Listen for changes on the checkbox
Search_.addEventListener("change", () => {
	if (Search_.checked) {
		Search_user_active = true;
		// Add any additional actions you want to trigger when the switch is on
	} else {
		Search_user_active = false;
		// Add any additional actions you want to trigger when the switch is off
	}
});

document.addEventListener("DOMContentLoaded", () => {
	// Load the saved state from localStorage when the page loads
	if (localStorage.getItem("Search_state") === "true") {
		Search_.checked = true;
	} else {
		Search_.checked = false;
	}

	// Save the state to localStorage whenever the switch is toggled
	Search_.addEventListener("change", () => {
		const isChecked_Search = Search_.checked;
		localStorage.setItem("Search_state", isChecked_Search);

		// Communicate the state to the content script
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				SearchUser: isChecked_Search,
			});
		});
	});
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { SearchUser: Search_.checked });
	});
});
