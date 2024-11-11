const prompt = require('prompt-sync')();
const fs = require('fs');
const path = 'userData.json';
const bannedWords = require('./bannedWords'); //Naughty words

// Function to load existing data from userData.json
function loadUserData() {
  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path, 'utf-8');
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON data. Resetting file.");
      return []; 
    }
  }
  return [];
}

// Name
function askForName() {
  let name;
  do {
    name = prompt("What's the player's name? ");
    if (!/^[A-Za-z]+$/.test(name)) {
      console.log("Please enter letters only.");
    }
  } while (!/^[A-Za-z]+$/.test(name));
  return name;
}

function censorWords(text) {
  bannedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(regex, 'womp');
  });
  return text;
}

// Server
function askForServer() {
    let server;
    do {
      server = prompt("What's the player's server? ");
      server = server.replace(/\s+/g, ''); // Remove all spaces
      if (!/^[A-Za-z]+$/.test(server)) {
        console.log("Please enter letters only, without spaces.");
      }
    } while (!/^[A-Za-z]+$/.test(server));
    return server;
  }

// Function to ask for sin
function askForSin() {
  let sin = prompt("What sin did they commit? ");
  return censorWords(sin);
}

// Function to add a player
function addPlayer() {
  const name = capFirstLetter(askForName());
  const server = capFirstLetter(askForServer());
  const sin = capFirstLetter(askForSin());
  const newEntry = { name, server, sin };
  saveToFile(newEntry);
}

// Function to search for a player by name
function searchPlayer() {
  const name = askForName();
  const userData = loadUserData();
  const result = userData.filter(entry => entry.name.toLowerCase() === name.toLowerCase());
  
  if (result.length > 0) {
    console.log("Player(s) found:");
    console.log(result);
  } else {
    console.log("Player not found.");
  }
}

// View all players
function viewAllPlayers() {
    const userData = loadUserData();

    if (userData.length === 0) {
        console.log("No players found");
        return;
    }

    console.log("Players: ");
    userData.forEach(entry => {
        console.log(capFirstLetter(entry.name) + " - " + capFirstLetter(entry.server));
    });
}

function removePlayer() {
    console.log("Once a sinner, always a sinner....")
}

// Function to search for players by server
function searchServer() {
  const server = askForServer();
  const userData = loadUserData();
  const result = userData.filter(entry => entry.server.toLowerCase() === server.toLowerCase());
  
  if (result.length > 0) {
    console.log("Player(s) on server found:");
    console.log(result);
  } else {
    console.log("No players found on this server.");
  }
}

// Function to save data to the JSON file, appending new entries
function saveToFile(newEntry) {
  const userData = loadUserData(); // Load existing data
  userData.push(newEntry); // Add the new entry

  // Write the updated data back to the JSON file
  fs.writeFileSync(path, JSON.stringify(userData, null, 2));
  console.log('Player has been added');
}

function capFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function main() {
  console.log("Booting Wowpug Hatelist...");
  console.log("What do you wish to do?");
  console.log("1. Add player");
  console.log("2. Search for player");
  console.log("3. Search for server");
  console.log("4. View all players");
  console.log("5. Remove a player");

  const choice = prompt("Enter your choice: ");

  switch (choice) {
    case '1':
      addPlayer();
      break;
    case '2':
      searchPlayer();
      break;
    case '3':
      searchServer();
      break;
    case '4':
      viewAllPlayers();
      break;
    case '5':
      removePlayer();
      break;
    default:
      console.log("Invalid choice. Please enter 1, 2, or 3.");
      break;
  }
}

main();
