//________________________________________________________________________________Artifact___________________________________________________________________________________\\
// Apply the changes with stored settings or default values
function applyChanges(
	fillColor_attack = "#fc0303",
	fillColor_mining = "#03e8fc",
	fillColor_recruting = "#fc9003",
	fillColor_deffence = "#2030df",
	fillColor_speedIsland = "#42b336",
	fillColor_speed = "#83ff75",
	fillColor_luck = "#8d36ff"
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

	svgPaths.forEach(({ selector, color }) => {
		const svgPath = document.querySelector(selector);
		if (svgPath) {
			svgPath.setAttribute("fill", color);
		} else {
			//console.log(`SVG path with selector ${selector} not found.`);
		}
	});
}

// Load stored settings and apply them
function loadSettingsAndApply() {
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
			applyChanges(
				data.fillColor_attack || "#fc0303",
				data.fillColor_mining || "#03e8fc",
				data.fillColor_recruting || "#fc9003",
				data.fillColor_deffence || "#2030df",
				data.fillColor_speedIsland || "#42b336",
				data.fillColor_speed || "#83ff75",
				data.fillColor_luck || "#8d36ff"
			);
		}
	);
}

// Save settings to storage
function saveSettings(settings) {
	chrome.storage.sync.set(settings, () => {
		console.log("Settings saved", settings);
	});
}

// Check for changes and save them
function triggerChanges() {
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

	saveSettings(settings);
	applyChanges(
		settings.fillColor_attack,
		settings.fillColor_mining,
		settings.fillColor_recruting,
		settings.fillColor_deffence,
		settings.fillColor_speedIsland,
		settings.fillColor_speed,
		settings.fillColor_luck
	);
}
const targetDivs = document.querySelectorAll(
	"div[data-v-62f8e528], div[data-v-e51916f1]"
);

// Iterate through the NodeList and change the class
targetDivs.forEach((div) => {
	// Replace 'new-class' with the desired class name
	div.className = "new-class";
});
let _arti = undefined;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.artiActive !== undefined) {
		_arti = request.artiActive;
	}
	//console.log(_arti);
});
//document.addEventListener("mousemove", () => {
//	//console.log(_arti);
//	if (_arti === "true" || _arti === true) {
//		loadSettingsAndApply();
//	}
//});

//________________________________________________________________________________custom_pfp___________________________________________________________________________________//

const savedValue = localStorage.getItem("selectedImageValue");
let pfp = savedValue;
if (savedValue !== undefined) {
	pfp = savedValue;
}

let _pfp = undefined;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.pfpActive !== undefined) {
		_pfp = request.pfpActive;
	}
	//console.log(_arti);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.value !== undefined) {
		pfp = request.value;
	}
	if (_pfp === "true" || _pfp === true) {
		if (request.action === "updateClass") {
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
						profileIconDiv.classList.add(request.value);
					}
				}
			}
			const targetElement = document.querySelector(
				"[data-v-62f8e528][data-v-0cb4d7c1]"
			);
			if (targetElement) {
				//targetElement.className = '';
				let i = 0;
				while (i < 25) {
					targetElement.classList.remove("p-icon-" + i);
					i++;
				}
				targetElement.classList.add(request.value);
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
					profileIconMenu.classList.add(request.value);
				}
			}
			const chatDivs = document.querySelectorAll(".self");

			chatDivs.forEach((chatDiv) => {
				const profileIconChat = chatDiv.querySelector(".message-icon");
				let i = 0;
				if (profileIconChat) {
					while (i < 25) {
						profileIconChat.classList.remove("p-icon-" + i);
						i++;
					}
					profileIconChat.classList.add(request.value);
				}
			});
			sendResponse({ status: "class updated" });
		}
	}
});

function updatePFP() {
	//console.log(pfp)
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
				profileIconDiv.classList.add(pfp);
			}
		}
	}
	const targetElement = document.querySelector(
		"[data-v-62f8e528][data-v-0cb4d7c1]"
	);
	if (targetElement) {
		//targetElement.className = '';
		let i = 0;
		while (i < 25) {
			targetElement.classList.remove("p-icon-" + i);
			i++;
		}
		targetElement.classList.add(pfp);
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
			profileIconMenu.classList.add(pfp);
		}
	}
	const chatDivs = document.querySelectorAll(".self");

	chatDivs.forEach((chatDiv) => {
		const profileIconChat = chatDiv.querySelector(".message-icon");
		let i = 0;
		if (profileIconChat) {
			while (i < 25) {
				profileIconChat.classList.remove("p-icon-" + i);
				i++;
			}
			profileIconChat.classList.add(pfp);
		}
	});
	//const targetElement3 =document.querySelector('.message-icon');
	//if (targetElement3 != null) {
	//	targetElement3.classList.remove("p-icon-" + i);
	//}
	//if (targetElement != null) {
	//	targetElement3.classList.add(pfp);
	//}
}

//document.addEventListener("mousemove", () => {
//	//console.log(_arti);
//	if (_pfp === "true" || _pfp === true) {
//		updatePFP();
//	}
//});

//________________________________________________________________________________hide_txt___________________________________________________________________________________//

// Function to hide or show text elements based on the checkbox state
function hide_txt() {
	const elements = document.querySelectorAll(".menu-text");
	elements.forEach((element) => {
		element.style.display = "none";
	});
}
let hid_txt = undefined;


// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	
	if (request.hideTxt !== undefined) {
		hid_txt = request.hideTxt;
		console.log(hid_txt);
	}
	console.log(hid_txt);
	if (hid_txt === "true" || hid_txt === true) {
		hide_txt();
	}
});

// Initial check on page load to hide/show text based on stored state
//document.addEventListener("mousemove", () => {
//	if (hid_txt === "true" || hid_txt === true) {
//		hide_txt();
//	}
//});


//-------run-------\\
function runALL() {
	if (_arti === "true" || _arti === true) {
		loadSettingsAndApply();
	}if (_pfp === "true" || _pfp === true) {
		updatePFP();
	}if (hid_txt === "true" || hid_txt === true) {
		hide_txt();
	}
	console.log("update function called")
}
setInterval(runALL, 500);
