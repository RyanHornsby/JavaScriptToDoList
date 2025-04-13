// Adds a new task based on what the user had in the text field when they click the button
function add_task() {
    let enteredText = document.getElementById("taskEntry");
    // Only add new entry if it's not just blank characters
    if (enteredText.value.trim() != "") {
        // Creastes the list entry and adds the text from the input
        newListEntry = document.createElement("li");
        newListContainer = document.createElement("div");
        newListContainer.innerHTML = `<span class="listText">${enteredText.value}</span>`;
        newListContainer.className = "listContainer";        
        newListEntry.insertAdjacentElement("beforeend", newListContainer);
        //Creates a container for the task controls
        taskControlContainer = document.createElement("div");
        taskControlContainer.className = "taskControlContainer";
        newListContainer.insertAdjacentElement("beforeend", taskControlContainer);
        //Creates a complete button
        completeButton = document.createElement("button");
        completeButton.className = "completeButton";
        completeButton.setAttribute("onclick", "complete_task(event)");
        completeButton.innerHTML = "<i class='fa-solid fa-check'></i>"
        completeButton.title = "Toggle task completion";
        taskControlContainer.insertAdjacentElement("beforeend", completeButton);
        // Creates an edit button
        editButton = document.createElement("button");
        editButton.className = "editButton";
        editButton.setAttribute("onclick", "edit_task(event)");
        editButton.innerHTML = "<i class='fa-solid fa-pencil'></i>";
        editButton.title = "Edit task";
        taskControlContainer.insertAdjacentElement("beforeend", editButton);
        // Creates a delete button
        deleteButton = document.createElement("button");
        deleteButton.className = "deleteButton";
        deleteButton.setAttribute("onclick", "delete_task(event)");
        deleteButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
        deleteButton.title = "Delete task";
        taskControlContainer.insertAdjacentElement("beforeend", deleteButton);
        // Creates list positioning buttons
        moveUpButton = document.createElement("button");
        moveUpButton.className = "moveUpButton";
        moveUpButton.setAttribute("onclick", "move(event, 'up')");
        moveUpButton.innerHTML = "<i class='fa-solid fa-chevron-up'></i>";
        moveUpButton.title = "Move up list";
        taskControlContainer.insertAdjacentElement("beforeend", moveUpButton);
        moveDownButton = document.createElement("button");
        moveDownButton.className = "moveDownButton";
        moveDownButton.setAttribute("onclick", "move(event, 'down')");
        moveDownButton.innerHTML = "<i class='fa-solid fa-chevron-down'></i>";
        moveDownButton.title = "Move down list";
        taskControlContainer.insertAdjacentElement("beforeend", moveDownButton);
        // If dark mode is already enabled, add dark-mode to the newly created stuff
        if (document.body.classList.contains("dark-mode")) {
            let listEntries = newListEntry.firstChild.lastChild.children
            for (let i=0; i<listEntries.length; i++) {
                listEntries[i].classList.toggle("dark-mode");
            }
        }
        // Adds to the actual unordered list
        let toDoList = document.getElementById("toDoList");
        toDoList.insertAdjacentElement("beforeend", newListEntry);
        // Resets the text input to blank
        enteredText.value = "";

        // Updates the top and bottom tasks arrows
        list_ends_handling();
    }
}

// Marks the task as completed
function complete_task(event) {
    // Marks the row as completed
    let affectedRow = event.target.closest("button").parentElement.parentElement.parentElement;
    affectedRow.classList.toggle("completed");
    // Adjusts the icon
    let icon = affectedRow.firstChild.lastChild.firstChild.firstChild;
    if (icon.classList.contains("fa-check")) {
        icon.classList.replace("fa-check", "fa-arrow-rotate-left");
    }
    else {
        icon.classList.replace("fa-arrow-rotate-left", "fa-check");
    }
    // Hides all the other actions
    let taskControls = icon.parentElement.parentElement.children;
    for (let i=1; i<taskControls.length; i++) {
        if (affectedRow.classList.contains("completed")) {
            taskControls[i].classList.add("hidden");
        }
        else {
            taskControls[i].classList.remove("hidden");
        }
    }
    // Updates the top and bottom tasks arrows
    list_ends_handling();
}

// Allows you to edit the task
function edit_task(event) {
    let affectedRow = event.target.closest("button").parentElement.parentElement.parentElement;
    // Discards any previously open edits
    let previousEdit = document.querySelector(".buttonsContainer");
    if (previousEdit) {
        discard_changes(previousEdit, "cleanup");
    }    
    // Replaces all the elements with stuff for editing
    let controls = affectedRow.firstChild.lastChild.children;
    // Hidden doesn't work on the parent element, I do it for css controlling changing the display type
    controls[0].parentElement.classList.toggle("hidden");
    for (let i=0; i<controls.length; i++) {
        controls[i].classList.toggle("hidden");
    }
    let oldTextValue = affectedRow.firstChild.firstChild.textContent;
    affectedRow.firstChild.firstChild.classList.toggle("hidden");
    // Creates an input field auto-populated with what they previously had
    changeInput = document.createElement("input");
    // If dark mode is already enabled, add dark-mode to the newly created stuff
    if (document.body.classList.contains("dark-mode")) {
        changeInput.className = "dark-mode";
    }
    changeInput.setAttribute("type", "text");
    changeInput.value = oldTextValue;
    buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttonsContainer";
    confirmButton = document.createElement("button");
    // If dark mode is already enabled, add dark-mode to the newly created stuff
    if (document.body.classList.contains("dark-mode")) {
        confirmButton.className = "confirmButton dark-mode";
    }
    else {
        confirmButton.className = "confirmButton";
    }
    confirmButton.innerHTML = "<i class='fa-solid fa-check'></i>";
    confirmButton.title = "Save changes";
    confirmButton.setAttribute("onclick", "save_changes(event)");
    discardButton = document.createElement("button");
     // If dark mode is already enabled, add dark-mode to the newly created stuff
    if (document.body.classList.contains("dark-mode")) {
        discardButton.className = "discardButton dark-mode";
    }
    else {
        discardButton.className = "discardButton";
    }
    discardButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
    discardButton.title = "Discard changes";
    discardButton.setAttribute("onclick", "discard_changes(event, 'onlyInstance')");    
    affectedRow.firstChild.insertAdjacentElement("afterbegin", changeInput);
    buttonsContainer.insertAdjacentElement("beforeend", confirmButton);
    buttonsContainer.insertAdjacentElement("beforeend", discardButton);
    affectedRow.firstChild.insertAdjacentElement("beforeend", buttonsContainer);

    // Updates the list of inputs for the keyboard shortcuts to keep working
    handleKeyStrokes();
}

// Saves the changes
function save_changes(event) {
    let affectedRow = event.target.closest("button").parentElement.parentElement.parentElement;
    let newTextValue = affectedRow.firstChild.firstChild.value;
    // Updates the text to what the user changed it to
    affectedRow.firstChild.children[1].textContent = newTextValue;
    // Now we can just run the discard_changes to clean up
    discard_changes(event, "onlyInstance");
}

// Closes all open edit elements and swaps it back to standard list item
function discard_changes(event, entry) {
    let editElements;
    if (entry == "onlyInstance") {
        editElements = event.target.closest("button").parentElement;
    }
    else if (entry == "fromAddTask") {
        editElements = document.getElementsByClassName("confirmButton")[0].parentElement;
    }
    else {
        editElements = event;
    }
    editElements.parentElement.firstChild.remove();
    editElements.previousElementSibling.classList.toggle("hidden");
    let controls = editElements.previousElementSibling.children;
    for (let i=0; i<controls.length; i++) {
        controls[i].classList.toggle("hidden");
    }
    editElements.previousElementSibling.previousElementSibling.classList.toggle("hidden");
    editElements.remove();
}

// Discards changes if you go to add a new task
document.getElementById("taskEntry").addEventListener("focus", function(event) {
    // Only activates if there's already an edit open
    if (document.querySelectorAll("input[type='text']").length>1) {
        discard_changes(event, "fromAddTask");
    }
});

// Deletes the task
function delete_task(event) {
    let affectedRow = event.target.closest("button").parentElement.parentElement.parentElement;
    // Closes edit if they have it open
    if (document.querySelectorAll("input[type='text']").length>1) {
        discard_changes(event, "fromAddTask");
    }
    affectedRow.remove();

    // Updates the top and bottom tasks arrows
    list_ends_handling();
}

// Moves the tasks up / down the list
function move(event, direction) {
    let affectedRow = event.target.closest("button").parentElement.parentElement.parentElement;
    // Closes edit if they have it open
    if (document.querySelectorAll("input[type='text']").length>1) {
        discard_changes(event, "fromAddTask");
    }

    // Handles it differently if they moved up or down
    let task1;
    if (direction == "up") {
        task1 = affectedRow.previousElementSibling;
        task2 = affectedRow;
    }
    else {
        task1 = affectedRow;
        task2 = affectedRow.nextElementSibling;
    }
    // Swaps the two values
    affectedRow.parentElement.insertBefore(task2, task1);

    // Updates the top and bottom tasks arrows
    list_ends_handling();
}

// Hides the up button for the top entry and the down button for the last entry
function list_ends_handling() {
    let unorderedList = document.querySelector("ul");
    // Doesn't activate if the list is emptied
    if (unorderedList.children.length > 0) {
        let topElement = unorderedList.firstElementChild.firstChild.lastChild.children[3];
        let bottomElement = unorderedList.lastElementChild.firstChild.lastChild.children[4];
        // Enables the buttons for every entry (to deal with previously hidden ones)
        for (let i=0; i<unorderedList.children.length; i++) {
            unorderedList.children[i].firstChild.lastChild.children[3].classList.remove("hidden");
            unorderedList.children[i].firstChild.lastChild.children[4].classList.remove("hidden");
        }
        // Hides the up button for the top entry
        topElement.classList.add("hidden");
        // Hides the down button from the bottom entry
        bottomElement.classList.add("hidden");
    }  
}

// Toggles dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.querySelector("h1").classList.toggle("dark-mode");
    document.querySelector("ul").classList.toggle("dark-mode");
    // If they have an edit open, swaps that as well
    for (let i=0; i<document.querySelectorAll("input").length; i++) {
        document.querySelectorAll("input")[i].classList.toggle("dark-mode");
    }
    // Same thing but for all buttons
    for (let i=0; i<document.querySelectorAll("button").length; i++) {
        document.querySelectorAll("button")[i].classList.toggle("dark-mode");
    }
}

// Allows clicking enter when the user is in a text box
// Binds enter to simulate pressing the releveant button for each of the text inputs whilst they are active
function clickYesButton(whichTextBox) {
    if (whichTextBox.getAttribute("id") != "taskEntry") {
        whichTextBox.nextElementSibling.nextElementSibling.nextElementSibling.firstChild.click();
    }
    else {
        whichTextBox.nextElementSibling.click();
    }
}

function clickNoButton(whichTextBox) {
    if (whichTextBox.getAttribute("id") != "taskEntry") {
        whichTextBox.nextElementSibling.nextElementSibling.nextElementSibling.lastChild.click();
    }
}

function pressEnter(whichTextBox) {
    return function(e) {
        if (e.key === "Enter") {
            clickYesButton(whichTextBox);
        }
    };
}
function pressEsc(whichTextBox) {
    return function(e) {
        if (e.key === "Escape") {
            clickNoButton(whichTextBox);
        }
    };
}

// This gets a list of each text input and whenever they are selected, makes that one the one I am referencing
function handleKeyStrokes() {
    const textInputs = document.querySelectorAll("input[type='text']");
    textInputs.forEach(textBox => {
        const checkForEnter = pressEnter(textBox);
        const checkForEsc = pressEsc(textBox);

        textBox.addEventListener("focus", () => {
            textBox.addEventListener("keyup", checkForEnter);
        });
        textBox.addEventListener("focus", () => {
            textBox.addEventListener("keyup", checkForEsc);
        });

        textBox.addEventListener("blur", () => {
            textBox.removeEventListener("keyup", checkForEnter);
        });
        textBox.addEventListener("blur", () => {
            textBox.removeEventListener("keyup", checkForEsc);
        });
    });
};
// Runs it at first
handleKeyStrokes();
 
// Think about adding in the option to re-order tasks 