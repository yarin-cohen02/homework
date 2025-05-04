// REMAINING TODO:
// - Add timer to show how long it took to arrive (elv0-fl2)

// Variables:

const elevators = new Array(5).fill(null).map((value, i) => ({
    id: i,
    available: true,
    currentFloor: 0,
}));

const queue = [];
let activeRequests = [];


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
}

const makeAvailable = (id) => {
    elevators[id].available = true;
    elevators[id].startTime = -1;
}

const applyAnimation = async (id, floor) => {

    // show timer
    $(`elv${id}-fl${floor}`).show();

    // make elevator red
    $(`#elv${id}`).css("color", "#f04c4c");
  
    // move elevator
    await new Promise(resolve => {
      $(`#elv${id}`).animate({ bottom: floorHeight(floor) }, 2000, resolve);
    });

    // play sound
    const dingSound = new Audio("elevator-ding.mp3");
    dingSound.play();
  
    // change button to Arrived
    $(`#${floor}`).text("Arrived")
      .addClass("arrived-button")
      .removeClass("waiting-button");

    // hide timer
    $(`#elv${id}-fl${floor}`).hide();
  
    // make ekevator green
    $(`#elv${id}`).css("color", "#5bcd88");
  
    // wait 2 secs
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    // change button back to Call
    $(`#${floor}`).text("Call")
      .addClass("call-button")
      .removeClass("arrived-button");
  
    // make elevator black
    $(`#elv${id}`).css("color", "black");

  };  

const executeQueue = async () => {

    for (let requestedFloor of queue) {

      const availableElevator = findElevator(requestedFloor);
      if (availableElevator === -1) return;

      const elevatorRequest = activeRequests.find(a => a.floor === requestedFloor);
      if (elevatorRequest) elevatorRequest.elevator = availableElevator;

      queue.shift();
      await makeBusy(availableElevator, requestedFloor);
      await applyAnimation(availableElevator, requestedFloor);
      await makeAvailable(availableElevator);

      activeRequests = activeRequests.filter(a => !(a.floor === requestedFloor && a.elevator === availableElevator));

    }

}

const handleClick = (floor) => {

    $(`#${floor}`).text("Waiting").addClass("waiting-button").removeClass("call-button");

    activeRequests.push({
      floor: floor,
      elevator: -1,
      startTime: Date.now()
    });

    queue.push(floor);

}

const refreshTimers = () => {
  for (let activeReq of activeRequests) {
    $(`#elv${activeReq.elevator}-fl${activeReq.floor}`).text(`${Math.floor((Date.now() - activeReq.startTime) / 1000)} secs`);
  }
}
    

// On start:

setInterval(() => executeQueue(), 1000); 
setInterval(() => refreshTimers(), 500); 

$("button").click((e) => {handleClick(e.target.id)});