// REMAINING TODO:
// - Add timer to show how long it took to arrive (elv0-fl2)

// Variables:

const elevators = new Array(5).fill(null).map((value, i) => ({
    id: i,
    available: true,
    currentFloor: 0,
    startTime: -1 // change startTime to be in each floor - maybe in executeQueue()?
}));

const queue = [];


// Functions:

const floorHeight = (x) => x * 62;

const findElevator = (floor) => {
    return elevators.filter((a) => a.available)
        .sort((a, b) => Math.abs(a.currentFloor - floor) - Math.abs(b.currentFloor - floor))[0]
        .id;
}

const makeBusy = (id, floor) => {
    elevators[id].available = false;
    elevators[id].currentFloor = floor;
    elevators[id].startTime = Date.now();
}

const makeAvailable = (id) => {
    elevators[id].available = true;
    elevators[id].startTime = -1;
}

const applyAnimation = async (id, floor) => {

    // show timer
    $(`#elv${id}-fl${floor}`).text("0 secs");
    $(`elv${id}-fl${floor}`).show();

    // make elevator red
    $(`#elv${id}`).css("color", "#f04c4c");
  
    // move elevator
    await new Promise(resolve => {
      $(`#elv${id}`).animate({ bottom: floorHeight(floor) }, 1000, resolve);
    });

    // play sound
    const dingSound = new Audio("elevator-ding.mp3");
    dingSound.play();
  
    // change button to "Arrived"
    $(`#${floor}`).text("Arrived")
      .addClass("arrived-button")
      .removeClass("waiting-button");

    // hide timer
    $(`#elv${id}-fl${floor}`).hide();
  
    // make ekevator green
    $(`#elv${id}`).css("color", "#5bcd88");
  
    // wait 2 secs
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    // change button back to "Call"
    $(`#${floor}`).text("Call")
      .addClass("call-button")
      .removeClass("arrived-button");
  
    // make elevator black
    $(`#elv${id}`).css("color", "black");

  };  

const executeQueue = async () => {

    if (!queue.length) return;

    const requestedFloor = queue[0];

    const availableElevator = findElevator(requestedFloor);
    console.log(availableElevator);
    
    if (availableElevator === -1) return;

    queue.shift();
    await makeBusy(availableElevator, requestedFloor);
    await applyAnimation(availableElevator, requestedFloor);
    await makeAvailable(availableElevator);

}

const handleClick = (floor) => {
    $(`#${floor}`).text("Waiting").addClass("waiting-button").removeClass("call-button");
    queue.push(floor);
}

const refreshTimers = () => {
  $(`#elv${id}-fl${floor}`).text(`${Math.floor((Date.now() - elevators[id].startTime) / 1000)} secs`);
}
    

// On start:

setInterval(() => executeQueue(), 1000); 
setInterval(() => refreshTimers(), 1000); 

$("button").click((e) => {handleClick(e.target.id)});