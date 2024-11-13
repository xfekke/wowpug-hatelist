WowpugHatelistDB = WowpugHatelistDB or {}

local function capitalize(text)
    return text:sub(1, 1):upper() .. text:sub(2):lower()
end

local function viewAllPlayers()
    if #WowpugHatelistDB == 0 then
        print("No players found.")
    else
        for _, player in ipairs(WowpugHatelistDB) do
            print(player.name .. " - " .. player.server .. ": " .. player.sin)
        end
    end
end

local function addPlayer(name, server, sin)
    table.insert(WowpugHatelistDB, {
        name = capitalize(name),
        server = capitalize(server),
        sin = capitalize(sin)
    })
    print(name .. " added to the list.")
end

SLASH_WOWPUGHATELIST1 = "/wowpughate"
SlashCmdList["WOWPUGHATELIST"] = function(msg)
    local command, sin = strsplit(" ", msg, 2)

    if command == "view" then
        viewAllPlayers()
    elseif command == "add" then
        -- Get target's name and class
        local name = UnitName("target")
        local class, classId = UnitClass("target")
        
        if not name then
            print("You don't have a target selected.")
        elseif not sin then
            print("Please specify the offense (sin) after the command.")
        else
            addPlayer(name, class, sin)
        end
    else
        print("Usage:")
        print("/wowpughate view - View all players")
        print("/wowpughate add <sin> - Add your current target with the specified sin")
    end
end

