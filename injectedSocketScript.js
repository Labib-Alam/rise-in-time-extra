// variable names
let currentMap = [];
let currentFieldID = 0;
let currentIslandID = 0;
let currentOwner = "";
let currentRegion = "";
let summonInterval = null
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
			e.every( (field) => {
                //looking for portal field and extracting its region data
                if(field.nature==='portal'){
                    currentRegion = field.region;
                    // works like break in this context 
                    return false;
            }})
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
				  // on button click executing the funtion for 
                  summonButton.addEventListener("click", () =>{
                    if (summonInterval) {
                        clearInterval(summonInterval);
                        summonInterval = null;
                        summonButton.innerHTML = "Summon Troops";
                        if (currentIslandID!==0 && currentRegion!==''){
                            window.$socket.emit("CONNECT_MAP", {
                                region: currentRegion,
                                islandIndex: currentIslandID});
                        }
                    }else{
                    summonButton.innerHTML = "Stop Summon";
                    summonAllTroops(currentFieldID, currentIslandID, currentOwner, currentMap, currentRegion)}
                })
			}
		}
	}
}

function flashIslands  (flashMap, flashRegion){
    let i = 0
    const flash = setInterval(() => {
        let island = flashMap[i]
        while (island && (island.islandEventClass === 'none' || island.islandEventClass === null) && i<flashMap.length){
            i++;
            island = flashMap[i];
        }
        if (i>= flashMap.length)clearInterval(flash);
            
        window.$socket.emit("CONNECT_MAP", {
        region: flashRegion,
        islandIndex: island.index});
        i++;
    }, 1000);
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
				() => {}
			);
		}
		i++;
		// clearing interval is fine but not sure wheter the socket thing works to be fixed + soemtimes the interval doesnt get cleared and need a page restart
		if (i >= summonMap.length) {
			clearInterval(sendTroops);
			window.$socket.emit("CONNECT_MAP", {
				region: summonRegion,
				islandIndex: summonIslandID,
			});
		}
	}, 600);
	summonInterval = sendTroops
}

function AutoReroll(rerollID, min_recruit_lvl=0,min_mining_lvl = 0) {
    let AllowedUnits = ["spotterNaki", "elderSpirit","grassSpirit","druidNaki","guardNaki","pangoan","ranax","forestSpirit", "nyxi"]

    function reroll(fieldIndex,islandIndex){
        window.$socket.emit("PUT_FIELD_UPGRADE_REROLL", {
            placeIndex: fieldIndex,
            islandIndex: islandIndex
        })
    }

    function checkConditions(newUnits, fieldbuffs) {
        // Check if any value in newUnits matches any value in AllowedUnits
        const unitMatch = newUnits.some((unit) => AllowedUnits.includes(unit));

        // Check if recruiting and mining levels meet minimum requirements
        
        const miningLevel = fieldbuffs?.['mining']?.level ?? 0;
        const recruitingLevel = fieldbuffs?.['recruiting']?.level ?? 0;
    
    // Return true if both levels are above the threshold, false otherwise
        const levelsMet =  miningLevel >= min_mining_lvl && recruitingLevel >= min_recruit_lvl;
        console.log(levelsMet, unitMatch)
        return unitMatch && levelsMet;
    }

    window.$socket.on("UPDATE_FIELD", (e)=>{
        if (e.index === rerollID){
            if(checkConditions(e.recruitableUnits, e.fieldBuffs)){
                console.log("Conditions met. Stopping reroll.");
                return
            }

            setTimeout(() =>{reroll(rerollID, currentIslandID)},650)
        }
        })
    window.$socket.emit("GET_FIELD", {
        islandIndex: currentIslandID,
        placeIndex: rerollID
    })
}



//---------------------------------------------run---------------------------------------------\\
function run() {
	summonAllMain();
}
setInterval(run, 200);
