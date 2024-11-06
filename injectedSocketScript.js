// variable names
let currentMap = []
let currentFieldID = 0
let currentIslandID = 0
let currentOwner = ''
let currentRegion = ''

// function to be later interavaled
function summonAllMain() {
    //Ading a event listener to UPDATE_FIELD socket event and updating variables based on last field pressed
    if (!window.$socket._callbacks.$UPDATE_FIELD || window.$socket._callbacks.$UPDATE_FIELD.filter(f => f.name==="updateFieldIndex").length===0){
        window.$socket.on("UPDATE_FIELD", function updateFieldIndex(e){currentFieldID=e.index; currentIslandID= e.islandIndex; currentOwner = e.owner});
        
    }
    
    // Ading a event listener to UPDATE_MAP socket event and updating variables based on last island entered
    if (!window.$socket._callbacks.$UPDATE_MAP || window.$socket._callbacks.$UPDATE_MAP.filter(f => f.name==="updateCurrentMap").length===0){
        window.$socket.on("UPDATE_MAP", function updateCurrentMap(e) {currentMap=e
            e.forEach( (field) => {
                //looking for portal field and extracting its region data
                if(field.nature==='portal'){
                    currentRegion == field.region
            }})
        })
    }
// checking if current gamestate has any fieldwindow opened if so adding a button to summon troops, the div is needed for styling 
    const fieldWindow = document.querySelector('div.field.window')
        if (fieldWindow){
            let summonButton = document.querySelector("#summonButton")
            if (!summonButton){
                const outerDiv = document.createElement("div")
                outerDiv.classList.add("flex", "ai-c", "jc-c")

                summonButton = document.createElement("div")
                summonButton.classList.add("button", "blue")
                summonButton.id = "summonButton"
                summonButton.style.marginTop = "15px";
                summonButton.style.marginBottom = "15px";
                summonButton.innerHTML = "Summon Troops"
                
                outerDiv.append(summonButton)
                fieldWindow.append(outerDiv)
                // on button click executing the funtion for 
                summonButton.addEventListener("click", () =>{
                    summonAllTroops(currentFieldID, currentIslandID, currentOwner, currentMap, currentRegion)
                })
            }
        }
    }

function summonAllTroops (summonFieldID, summonIslandID, summonOwner, summonMap, summonRegion) { 
    i = 0 
    //sending troops every 600ms, because the game doesn't like it when its faster than that
    const sendTroops = setInterval( () =>{
        let field = summonMap[i]
        //Checking if there are any units of specific type on the field and roudning the value to later add to our request 
        let units = field.units.filter((unit) => unit.amount>=1&& unit.owner === summonOwner).map(unit => ({ ...unit, amount: Math.floor(unit.amount) }))
        // not wasting any interval ticks by iterating through fields untill some has any troops
        while ((units.length === 0 || summonFieldID===field.index)&&i<summonMap.length ){
            i++
            field = summonMap[i]
            units = field.units.filter((unit) => unit.amount>=1&& unit.owner === summonOwner).map(unit => ({ ...unit, amount: Math.floor(unit.amount) }))
        }
        // Sending the request using RiT socket
        if (units.length!==0 && summonFieldID!==field.index){       
            window.$socket.emit("PUT_MOVE", {
                units: units,
                field1: field.index,        
                field2: summonFieldID,
                island: summonIslandID,
                layer: 1,
                moveIntent: "defend",
                launchedAt: window.$ping / 2,
                wasSentBlindly: false 
            }, ()=> {"sent"});
    }
    i++
    // clearing interval is fine but not sure wheter the socket thing works to be fixed + soemtimes the interval ddoesnt get cleared and need a page restart
        if (i>=summonMap.length) {clearInterval(sendTroops)
            window.$socket.emit("CONNECT_MAP", {
                region: summonRegion,
                islandIndex: summonIslandID
            })
        }
    }, 600)       
}

//---------------------------------------------run---------------------------------------------\\
function runSummon() {
    summonAllMain()
}
setInterval(runSummon, 500)