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
    console.log(elevators);
}

const makeAvailable = (id) => {
    elevators[id].available = true;
}

const applyAnimation = (id, floor) => {
    $(`#elv${id}`).css("color", "#f04c4c") // change elevator to red
        .animate({ bottom: floorHeight(floor) }); // move elevator
  
    $(`#${floor}`).text("Arrived")
        .addClass("arrived-button")
        .removeClass("waiting-button");

    $(`#elv${id}`).css("color", "#5bcd88"); // change elevator to green
  
    setTimeout(() => {  // wait 2 secs
      $(`#${floor}`).text("Call")   // change button text to "Call"
        .removeClass("arrived-button")
        .addClass("call-button");
    }, 2000);

    $(`#elv${id}`).css("color", "black"); // make elevator black
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
    

// Storage:

const elevators = new Array(5).fill(null).map((value, i) => ({
    id: i,
    available: true,
    currentFloor: 0
}));

const queue = [];


// On start:

setInterval(() => executeQueue(), 1000);

$("button").click((e) => {handleClick(e.target.id)});

// $(".elv1").animate({ bottom: floorHeight(3) });