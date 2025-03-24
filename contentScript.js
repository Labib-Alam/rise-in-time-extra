//_______________________________________________________________mobile___________________________________________________________________________________________\\

    function createMobileButton() {
        // Check if screen width is mobile-sized
        if (window.innerWidth > 768) return;

        // Ensure we only add the button once
        if (document.getElementById('mobile-popup-button')) return;

        // Find the target container
        let targetContainer = document.querySelector('.nav-element.nav-infos');
		
        if (!targetContainer) return;

        // Create the button
        let button = document.createElement('button');
        button.id = 'mobile-popup-button';
        button.innerHTML = '<img src="favicon.ico" style="width: 20px; height: 20px; margin-right: 5px;">';
        button.style.padding = '5px 0px';
        button.style.background = '#fff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.zIndex = '1000';
        button.style.display = 'block';

        // Button click event
        button.addEventListener('click', function () {
            window.open(chrome.runtime.getURL('popup.html'), '_blank');
        });

        // Append to the container
        targetContainer.appendChild(button);
    }

	// createMobileButton()



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
		//console.log("Settings saved", settings);
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
let _summon = undefined;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.SummonAll !== undefined) {
		_summon = request.SummonAll;
	}
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
			//pfp in left corner
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
			//pfp in menu
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
			//pfp in chat
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
		//console.log(hid_txt);
	}
	//console.log(hid_txt);
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

//-----------------------------------------------search bar------------------------------------------------------------\\

// Insert search bar at the top of ranking-user-container
function findUser() {
	const rankingUserContainer = document.querySelector(
		".ranking-user-container"
	);

	if (rankingUserContainer) {
		// Check if the search bar already exists
		let searchBar = rankingUserContainer.querySelector(".user-search-bar");

		// If the search bar doesn't exist, create and insert it
		if (!searchBar) {
			searchBar = document.createElement("input");
			searchBar.type = "text";
			searchBar.placeholder = "Search users...";
			searchBar.className = "user-search-bar"; // Assign a class to identify the search bar
			searchBar.style.marginBottom = "10px";

			// Insert the search bar at the top of "ranking-user-container"
			rankingUserContainer.prepend(searchBar);

			// Add event listener for search functionality
			searchBar.addEventListener("input", function () {
				const searchText = searchBar.value.toLowerCase(); // Convert search term to lowercase
				const userRows = rankingUserContainer.querySelectorAll(
					".ranking-row.flex.jc-sa"
				);

				userRows.forEach((row) => {
					const username = row
						.querySelector(".item-username")
						.textContent.toLowerCase(); // Convert username to lowercase

					// Show or hide based on case-insensitive match
					if (username.includes(searchText)) {
						row.style.display = ""; // Show the row
					} else {
						row.style.display = "none"; // Hide the row
					}
				});
			});
		}
	}
}
let Search_User = undefined;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.SearchUser !== undefined) {
		Search_User = request.SearchUser;
		//console.log(Search_User);
	}
	//console.log(Search_User);
	if (Search_User === "true" || Search_User === true) {
		findUser();
	}
});
//---------------------------------------------Summoning---------------------------------------------\\

function injectSummonAllScript() {
	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("injectedSocketScript.js");
	document.head.append(script);
}
// Listen for messages from popup.js and relay them to the injected script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.SummonAll !== undefined) {
		// Forward the message to the injected script via window.postMessage
		window.postMessage(
			{ type: "SUMMON_ALL", summonAll: request.SummonAll },
			"*"
		);

		// Optionally handle in the content script itself
		console.log("Content script received SummonAll:", request.SummonAll);
	}
});
//---------------------------------------------reroll---------------------------------------------\\
function reroll_val() {
	// Collect data from each relevant element
	const data = {
		unitClasses: [],
		recruitingLevels: [],
		miningLevels: [],
	};

	// Get extra classes from elements with class "unit-slot unit not-round"
	document
		.querySelectorAll(".unit-slot.unit.not-round")
		.forEach((element) => {
			const classes = Array.from(element.classList);
			const extraClass = classes.find(
				(cls) =>
					cls !== "unit-slot" && cls !== "unit" && cls !== "not-round"
			);
			if (extraClass) {
				data.unitClasses.push(extraClass);
			}
		});

	// Get recruiting levels from elements with class "efficiency-container recruiting .text.small"
	document
		.querySelectorAll(".efficiency-container.recruiting .text.small")
		.forEach((element) => {
			const textContent = element.textContent.trim();
			const match = textContent.match(/Lv\.\s*(\d+)/);
			if (match) {
				data.recruitingLevels.push(match[1]);
			}
		});

	// Get mining levels from elements with class "efficiency-container mining .text.smaller"
	document
		.querySelectorAll(".efficiency-container.mining .text.smaller")
		.forEach((element) => {
			const textContent = element.textContent.trim();
			const match = textContent.match(/Lv\.\s*(\d+)/);
			if (match) {
				data.miningLevels.push(match[1]);
			}
		});

	// Send the collected data to injectedSocketScript.js via window.postMessage
	window.postMessage({ type: "REROLL_VAL_DATA", data: data }, "*");
}
// Listen for messages from the injected script
window.addEventListener("message", (event) => {
	// Only process messages sent from the same page (not from other extensions or iframes)
	if (event.source !== window) return;

	if (event.data && event.data.type === "RerollData") {
		if (("SENDdata", event.data.data)) {
			//console.log("got")
			reroll_val();
		}
		// Do something with the data, such as forwarding it to the background script
		//chrome.runtime.sendMessage({ fromInjectedScript: event.data.data });
	}
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === "IMG_DATA_VALUES") {
		const receivedDataValues = request.dataValues;
		console.log("Received data-values from popup:", receivedDataValues);

		// Process the data-values as needed
		handleImageDataValues(receivedDataValues);
	}
});

// Function to handle the received data-values
function handleImageDataValues(dataValues) {
	// Example: Log the data-values or perform actions with them
	dataValues.forEach((value) => {});
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === "IMG_DATA_VALUES") {
		const dataValues = request.dataValues;

		// Forward the data to injectedSocketScript.js using window.postMessage
		window.postMessage(
			{ type: "IMG_DATA_VALUES_FOR_INJECTED", dataValues: dataValues },
			"*"
		);
	}
});
// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === "DROPDOWN_VALUES") {
		// Forward the dropdown values to injectedSocketScript.js
		window.postMessage(
			{ type: "DROPDOWN_VALUES_FOR_INJECTED", values: request.values },
			"*"
		);
	}
});

// Listen for messages from popup.js and relay them to the injected script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.RerollAll !== undefined) {
		// Forward the message to the injected script via window.postMessage
		window.postMessage(
			{ type: "REROLL_ALL", RerollAll: request.RerollAll },
			"*"
		);

		// Optionally handle in the content script itself
		console.log("Content script received RerollAll:", request.RerollAll);
	}
});
//---------------------------------------------Flash---------------------------------------------\\

// Listen for messages from popup.js and relay them to the injected script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.flash !== undefined) {
		// Forward the message to the injected script via window.postMessage
		window.postMessage({ type: "flash", flash: request.flash }, "*");

		// Optionally handle in the content script itself
		console.log("Content script received flash:", request.flash);
	}
});
//---------------------------------------------VULNERABLE---------------------------------------------\\
let vurnability = undefined;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.Vurnability !== undefined) {
		vurnability = request.Vurnability;
		console.log(vurnability);
	}
	console.log(vurnability);
	if (vurnability === "true" || vurnability === true) {
		vulnerable();
	}
});

function vulnerable() {
	const vulnerabilities = {
		"guard-naki": [
			"forest-spirit",
			"grass-spirit",
			"nyxi",
			"raider-naki",
			"ovivi",
		],
		athlas: ["forest-spirit", "guard-naki", "teryx"],
		nyxi: ["grass-spirit", "ranax", "vahloc"],
		"forest-spirit": ["druid-naki", "ranax", "teryx"],
		"grass-spirit": ["druid-naki", "ranax", "teryx"],
		"elder-spirit": ["druid-naki", "guard-naki"],
		vahloc: ["guard-naki", "athlas", "teryx"],
		teryx: ["elder-spirit"],
		ranax: ["elder-spirit", "vahloc"],
		"druid-naki": ["nyxi", "vahloc", "raider-naki"],
		"raider-naki": ["athlas"],
		ovivi: ["athlas"],
		pangoan: [],
		"spotter-naki": [],
	};

	const unitDetail = document.querySelector(".unit-detail");
	if (unitDetail) {
		const vulnerableDiv = document.getElementById("vulnerableDiv");
		let unitName = unitDetail.querySelector(".title").innerHTML;

		if (!vulnerableDiv) {
			let div = document.createElement("div");
			div.classList.add("effective-container");
			div.setAttribute("data-v-4d9dcced", "");
			div.setAttribute("data-troop", `${unitName}`);
			div.id = "vulnerableDiv";

			let text = document.createElement("div");
			text.classList.add("label");
			text.innerText = "Vulnerable against: ";
			text.setAttribute("data-v-4d9dcced", "");
			div.append(text);

			let effectiveContainer = document.createElement("div");
			effectiveContainer.classList.add("effective");
			effectiveContainer.setAttribute("data-v-4d9dcced", "");
			div.append(effectiveContainer);

			let formattedUnitName = unitName.replace(" ", "-").toLowerCase();
			vulnerabilities[formattedUnitName].forEach((unit) => {
				let unitdiv = document.createElement("div");
				unitdiv.classList.add(`${unit}`, "unit-small");
				unitdiv.setAttribute("data-v-4d9dcced", "");
				effectiveContainer.append(unitdiv);
			});
			unitDetail.append(div);
		} else if (unitName !== vulnerableDiv.getAttribute("data-troop")) {
			unitDetail.removeChild(vulnerableDiv);
			vulnerable();
		}
	}
}
//---------------------------------------------rank-player---------------------------------------------\\
function rank() {
    if (!rankEnabled) return;

    // Select the element with the "title" class
    const titleElement = document.querySelector(".title");
    
    // Exit early if no title element found
    if (!titleElement) return;

    // Check if a <p> with the "rank" class already exists after the title element
    const existingRankElement = titleElement.nextElementSibling;
    if (existingRankElement && existingRankElement.classList.contains("rank")) {
        return;
    }

    // Create the new <p> element
    const newElement = document.createElement("p");
    newElement.className = "rank";

    // Switch based on title content
    switch (titleElement.textContent.trim()) {
        case "Fexeek":
            newElement.innerHTML = '<br><span style="background-color: green">​ modder ​</span>  <span style="background-color: yellow; color: black;">​ Regional Master ​</span>  <span style="background-color: orange;">​ Dominion pro ​</span>';
            break;
        case "Sherovec":
            newElement.innerHTML = '<br><span style="background-color: purple">​ G.O.A.T ​</span>  <span style="background-color: red">​ Grand Master ​</span>  <span style="background-color: red">​ Dominion Master ​</span> <br> <br> <span style="background-color: black">​  Dragon Hunter ​</span>  <span style="background-color: black">​ Quickstab King  ​</span>';
            break;
        case "GameCoder":
            newElement.innerHTML = '<br><span style="background-color: green">​ modder ​</span>  <span style="background-color: red">​ Youtube ​</span>  <span style="background-color: orange">​ Master ​</span>';
            break;
        case "AskAlice":
            newElement.innerHTML = '<br><span style="background-color: blue">​ Dev ​</span>  <span style="background-color: red">​ Grand Master ​</span>  <span style="background-color: red">​ Dominion Master ​</span>';
            break;
        case "Hitesh":
            newElement.innerHTML = '<br><span style="background-color: red">​ Dominion Master ​</span>  <span style="background-color: orange">​ Master ​</span>';
            break;
		case "Ratte":
		case "Extirpator":
            newElement.innerHTML = '<br>  <span style="background-color: red">​ Grand Master ​</span>  <span style="background-color: red">​ Dominion Master ​</span>';
            break;
        case "m453":
            newElement.innerHTML = '<br>  <span style="background-color: red">​ Grand Master ​</span>  <span style="background-color: orange">​ Dominion pro ​</span>';
            break;
        case "memememe":
            newElement.innerHTML = '<br>  <span style="background-color: red">​ Grand Master ​</span>  <span style="background-color: orange">​ Dominion pro ​</span>';
            break;
        case "Zahikusa":
        case "Ibexor":
        case "Ramsus":
            newElement.innerHTML = '<br><span style="background-color: blue">​ Dev ​</span>  <span style="background-color: red">​ Grand Master ​</span>  <span style="background-color: orange">​ Dominion pro ​</span>';
            break;
        default:
            return; // Don't add rank for unrecognized names
    }

    // Insert the new element after the title element
    titleElement.insertAdjacentElement("afterend", newElement);
}
//---------------------------------------------run---------------------------------------------\\

injectSummonAllScript();
function runALL() {
	//flash();
	if (_arti === "true" || _arti === true) {
		loadSettingsAndApply();
	}
	if (_pfp === "true" || _pfp === true) {
		updatePFP();
	}
	if (hid_txt === "true" || hid_txt === true) {
		hide_txt();
	}
	if (Search_User === "true" || Search_User === true) {
		findUser();
	}
	if (vurnability === "true" || vurnability === true) {
		vulnerable();
	}
	if (rankEnabled) rank();
		//console.log("update function called");
	createMobileButton()
	
}
setInterval(runALL, 200);

let bookEnabled = undefined;
let rankEnabled = undefined;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.book !== undefined) {
        bookEnabled = request.book;
        window.postMessage({ type: "book", book: request.book }, "*");
    }
    if (request.rank !== undefined) {
        rankEnabled = request.rank;
    }
});

// Add this near the end of the file
// Listen for guide URL requests from injectedSocketScript
window.addEventListener("message", (event) => {
    if (event.data.type === "GET_GUIDE_URL") {
        const guideUrl = chrome.runtime.getURL('guide.html');
        window.postMessage({ type: "GUIDE_URL_RESPONSE", url: guideUrl }, "*");
    }
});
