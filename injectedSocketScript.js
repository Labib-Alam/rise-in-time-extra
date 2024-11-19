// variable names
let currentMap = [];
let currentFieldID = 0;
let currentIslandID = 0;
let currentOwner = "";
let currentRegion = "";
let summonInterval = null;

//----------------------------------------------------summon-all---------------------------------------------------\\
let StateOFSummon = undefined;

// Listen for forwarded messages from contentScript.js
window.addEventListener("message", (event) => {
	if (event.source !== window) return; // Only accept messages from the same window
	if (event.data.type === "SUMMON_ALL") {
		StateOFSummon = event.data.summonAll;
		//console.log("Injected script received StateOFSummon:", StateOFSummon);
	}
});
// function to be later interavaled
function summonAllMain() {
	//Ading a event listener to UPDATE_FIELD socket event and updating variables based on last field pressed
	if (
		!window.$socket._callbacks.$UPDATE_FIELD ||
		window.$socket._callbacks.$UPDATE_FIELD.filter(
			(f) => f.name === "updateFieldIndex"
		).length === 0
	) {
		window.$socket.on("UPDATE_FIELD", function updateFieldIndex(e) {
			currentFieldID = e.index;
			currentIslandID = e.islandIndex;
			currentOwner = e.owner;
		});
	}

	// Ading a event listener to UPDATE_MAP socket event and updating variables based on last island entered
	if (
		!window.$socket._callbacks.$UPDATE_MAP ||
		window.$socket._callbacks.$UPDATE_MAP.filter(
			(f) => f.name === "updateCurrentMap"
		).length === 0
	) {
		window.$socket.on("UPDATE_MAP", function updateCurrentMap(e) {
			currentMap = e;
			e.forEach((field) => {
				//looking for portal field and extracting its region data
				if (field.nature === "portal") {
					currentRegion == field.region;
				}
			});
		});
	}
	// checking if current gamestate has any fieldwindow opened if so adding a button to summon troops, the div is needed for styling
	const fieldWindow = document.querySelector("div.field.window");
	if (StateOFSummon === "true" || StateOFSummon === true) {
		if (fieldWindow) {
			let summonButton = document.querySelector("#summonButton");
			if (!summonButton) {
				const outerDiv = document.createElement("div");
				outerDiv.classList.add("flex", "ai-c", "jc-c");

				summonButton = document.createElement("div");
				summonButton.classList.add("button", "blue");
				summonButton.id = "summonButton";
				summonButton.style.marginTop = "15px";
				summonButton.style.marginBottom = "15px";
				if (summonInterval) summonButton.innerHTML = "Stop Summon";
				else summonButton.innerHTML = "Summon Troops";

				outerDiv.append(summonButton);
				fieldWindow.append(outerDiv);
				// on button click executing the funtion for
				summonButton.addEventListener("click", () => {
					if (summonInterval) {
						clearInterval(summonInterval);
						summonInterval = null;
						summonButton.innerHTML = "Summon Troops";
						if (currentIslandID !== 0 && currentRegion !== "") {
							window.$socket.emit("CONNECT_MAP", {
								region: currentRegion,
								islandIndex: currentIslandID,
							});
						}
					} else {
						summonButton.innerHTML = "Stop Summon";
						summonAllTroops(
							currentFieldID,
							currentIslandID,
							currentOwner,
							currentMap,
							currentRegion
						);
					}
				});
			}
		}
	}
}

function summonAllTroops(
	summonFieldID,
	summonIslandID,
	summonOwner,
	summonMap,
	summonRegion
) {
	i = 0;
	
	//sending troops every 600ms, because the game doesn't like it when its faster than that
	const sendTroops = setInterval(() => {
		let field = summonMap[i];
		if (i >= summonMap.length) {
			let summonButton = document.getElementById("summonButton")
			summonButton.innerText = "Summon Troops"
			clearInterval(summonInterval);
			summonInterval = null
			window.$socket.emit("CONNECT_MAP", {
				region: summonRegion,
				islandIndex: summonIslandID,
			});
		}
		//Checking if there are any units of specific type on the field and roudning the value to later add to our request
		let units = field.units
			.filter((unit) => unit.amount >= 1 && unit.owner === summonOwner)
			.map((unit) => ({ ...unit, amount: Math.floor(unit.amount) }));
		// not wasting any interval ticks by iterating through fields untill some has any troops
		while (
			(units.length === 0 || summonFieldID === field.index) &&
			i < summonMap.length
		) {
			i++;
			field = summonMap[i];
			units = field.units
				.filter(
					(unit) => unit.amount >= 1 && unit.owner === summonOwner
				)
				.map((unit) => ({ ...unit, amount: Math.floor(unit.amount) }));
		}
		// Sending the request using RiT socket
		if (units.length !== 0 && summonFieldID !== field.index) {
			window.$socket.emit(
				"PUT_MOVE",
				{
					units: units,
					field1: field.index,
					field2: summonFieldID,
					island: summonIslandID,
					layer: 1,
					moveIntent: "defend",
					launchedAt: window.$ping / 2,
					wasSentBlindly: false,
				},
				() => {
					"sent";
				}
			);
		}
		i++;
	}, 600);
	summonInterval = sendTroops;
}
//-----------------------------------------------auto-reroll-------------------------------------------\\
let newUnits = [];
let newRecruitingLevels = undefined;
let newMiningLevels = undefined;
let AllowedUnits = [];
let minRecruitingLevels = undefined;
let minMiningLevels = undefined;
let reroll_val_interval = 0;
let can_reroll = false;


let StateOFReroll = undefined;

// Listen for forwarded messages from contentScript.js
window.addEventListener("message", (event) => {
	if (event.source !== window) return; // Only accept messages from the same window
	if (event.data.type === "REROLL_ALL") {
		StateOFReroll = event.data.RerollAll;
	}
});

function reroll() {
	if (
		newRecruitingLevels == undefined ||
		newMiningLevels == undefined ||
		minMiningLevels == undefined ||
		minRecruitingLevels == undefined ||
		newUnits.length == 0 ||
		AllowedUnits.length == 0
	) {
		can_reroll = false;
	} else {
		can_reroll = true;
	}
	let unitMatch = newUnits.some((unit) => AllowedUnits.includes(unit));
	let levelsMet =
		parseInt(newRecruitingLevels) >= parseInt(minRecruitingLevels) &&
		parseInt(newMiningLevels) >= parseInt(minMiningLevels);
	//only send the correct data when reroll_val_interval is odd num so it skips even nums
	if (reroll_val_interval % 2 !== 0) {
		if ((!unitMatch || !levelsMet) && isAutoRerolling && can_reroll) {
			if (
				!window.$socket._callbacks.$UPDATE_FIELD ||
				window.$socket._callbacks.$UPDATE_FIELD.filter(
					(f) => f.name === "updateFieldIndex"
				).length === 0
			) {
				window.$socket.on("UPDATE_FIELD", function updateFieldIndex(e) {
					currentFieldID = e.index;
					currentIslandID = e.islandIndex;
					currentOwner = e.owner;
				});
			}

			//const switch_item = fieldWindow.querySelector('div.switch-element.active')

			window.$socket.emit("PUT_FIELD_UPGRADE_REROLL", {
				placeIndex: currentFieldID,
				islandIndex: currentIslandID,
			});
		}
	}
}
let isAutoRerolling = false; // Flag to control reroll loop

function AutoReroll() {
	setTimeout(() => {
		sendDataToContentScript({ message: "SENDdata" });
	}, 200);
	// console.log(
	// 	newUnits,
	// 	AllowedUnits,
	// 	newRecruitingLevels,
	// 	minRecruitingLevels,
	// 	newMiningLevels,
	// 	minMiningLevels
	// );
	//onst unitMatch = newUnits.some((unit) => AllowedUnits.includes(unit));
	//console.log(unitMatch);
	function sendDataToContentScript(data) {
		// Send a message to contentScript.js using window.postMessage
		window.postMessage({ type: "RerollData", data: data }, "*");
		console.log("sent");
	}
	reroll();
}

// Function to stop auto reroll manually
function stopAutoReroll() {
	const autoRerollButton = document.getElementById("AutoRerollButton");
	if (autoRerollButton) {
		autoRerollButton.remove();
	}
	isAutoRerolling = false;
	console.log("Auto reroll stop requested.");
}

function AutoRerollRun() {
	const autoRerollButton = document.getElementById("AutoRerollButton");
	if (autoRerollButton) {
		autoRerollButton.remove();
	}
	isAutoRerolling = true;
	sendDataToContentScript({ message: "SENDdata" });
}

function sendDataToContentScript(data) {
	// Send a message to contentScript.js using window.postMessage
	window.postMessage({ type: "RerollData", data: data }, "*");
	console.log("sent");
}
// Listen for messages from contentScript.js
window.addEventListener("message", (event) => {
	// Only accept messages from the same window context
	if (event.source !== window) return;

	// Check for the specific message type
	if (event.data && event.data.type === "REROLL_VAL_DATA") {
		const receivedData = event.data.data;
		console.log("Received data from content script:", receivedData);

		// Process the data as needed
		handleRerollData(receivedData);
	}
});

function handleRerollData(data) {
	newUnits = data.unitClasses;
	console.log("Unit Classes:", newUnits);
	newRecruitingLevels = data.recruitingLevels;
	console.log("Recruiting Levels:", newRecruitingLevels);
	newMiningLevels = data.miningLevels;
	console.log("Mining Levels:", newMiningLevels);
	let unitMatch = newUnits.some((unit) => AllowedUnits.includes(unit));
	let levelsMet =
		parseInt(newRecruitingLevels) >= parseInt(minRecruitingLevels) &&
		parseInt(newMiningLevels) >= parseInt(minMiningLevels);
	reroll_val_interval++;
	if (!unitMatch || !levelsMet) {
		setTimeout(() => {
			AutoReroll();
		}, 0.25 * 1000);
	} else {
		isAutoRerolling = false;
	}
}
// Listen for messages from contentScript.js
window.addEventListener("message", (event) => {
	// Ensure the message comes from the same window
	if (event.source !== window) return;

	// Check for the specific message type
	if (event.data && event.data.type === "IMG_DATA_VALUES_FOR_INJECTED") {
		const dataValues = event.data.dataValues;
		console.log("Received data-values from content script:", dataValues);

		// Process the data-values as needed
		handleDataValuesFromContentScript(dataValues);
	}
});

// Function to handle the received data-values
function handleDataValuesFromContentScript(dataValues) {
	AllowedUnits = dataValues;
	dataValues.forEach((value) => {
		// Perform any required actions with each data-value
		;
	});
}
// Listen for messages from contentScript.js
window.addEventListener("message", (event) => {
	if (event.source !== window) return;

	if (event.data && event.data.type === "DROPDOWN_VALUES_FOR_INJECTED") {
		const { minimumMiningAllowed, minimumRecruitingAllowed } =
			event.data.values;
		console.log("Received dropdown values from content script:");
		//console.log("Minimum Mining Allowed:", minimumMiningAllowed);
		//console.log("Minimum Recruiting Allowed:", minimumRecruitingAllowed);

		// Handle the received values as needed in injectedSocketScript.js
		handleDropdownValues(minimumMiningAllowed, minimumRecruitingAllowed);
	}
});

// Function to handle the received dropdown values
function handleDropdownValues(minMining, minRecruiting) {
	minMiningLevels = minMining;
	console.log("Handling minimum mining level:", minMiningLevels);
	minRecruitingLevels = minRecruiting;
	console.log("Handling minimum recruiting level:", minRecruitingLevels);
	// Add your processing logic here
}

function reroll_button() {
	if (StateOFReroll) {
		const fieldWindow = document.querySelector("div.field.window");
		if (fieldWindow) {
			let AutoRerollButton = document.querySelector("#AutoRerollButton");
			// Check for the div with class "switch-element active" containing the text "Upgrade"
			const switchElement = document.querySelector(".switch-element.active");
			const containsUpgradeText =
				switchElement && switchElement.textContent.includes("Upgrade");

			// If the div contains the text "Upgrade", create the button if it doesn't exist
			if (containsUpgradeText) {
				if (!AutoRerollButton) {
					const outerDiv = document.createElement("div");
					outerDiv.classList.add("flex", "ai-c", "jc-c");

					AutoRerollButton = document.createElement("div");
					AutoRerollButton.classList.add("button", "blue");
					AutoRerollButton.id = "AutoRerollButton";
					AutoRerollButton.style.marginTop = "15px";
					AutoRerollButton.style.marginBottom = "15px";
					//AutoRerollButton.innerHTML = "Auto Reroll";
					if (isAutoRerolling) {
						console.log(isAutoRerolling);
						AutoRerollButton.innerHTML = "Stop Auto Reroll";
					} else if (!isAutoRerolling) {
						console.log(isAutoRerolling);
						AutoRerollButton.innerHTML = "Auto Reroll";
					}

					outerDiv.append(AutoRerollButton);
					fieldWindow.append(outerDiv);

					// Attach event listener to the button
					AutoRerollButton.addEventListener("click", () => {
						if (!isAutoRerolling) {
							AutoRerollRun();
						} else if (isAutoRerolling) {
							stopAutoReroll();
						}
					});
				}
			} else {
				// If the div does not contain the text "Upgrade", remove the button if it exists
				if (AutoRerollButton) {
					AutoRerollButton.remove();
					AutoRerollButton = null;
				}
			}
		}
	}
}
//---------------------------------------------flash island---------------------------------------------\\
function flashIslands(flashMap, flashRegion) {
	let i = 0;
	const flash = setInterval(() => {
		let island = flashMap[i];
		while (
			island &&
			(island.islandEventClass === "none" ||
				island.islandEventClass === null) &&
			i < flashMap.length
		) {
			i++;
			island = flashMap[i];
		}
		if (i >= flashMap.length) clearInterval(flash);

		window.$socket.emit("CONNECT_MAP", {
			region: flashRegion,
			islandIndex: island.index,
		});
		i++;
	}, 1000);
}
//---------------------------------------------run---------------------------------------------\\
function run() {
	summonAllMain();
	reroll_button();
}
setInterval(run, 200);
