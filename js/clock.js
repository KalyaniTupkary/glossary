// Function to get the natural language representation of the current time
export function getNaturalLanguageTime() {
    const date = new Date();

    // Determine the time of day
    const hours = date.getHours();
    let timeOfDay;
    if (hours < 12) {
        timeOfDay = "morning of";
    } else if (hours < 18) {
        timeOfDay = "afternoon of";
    } else {
        timeOfDay = "evening of";
    }

    // Get the day of the month and convert to words
    const day = date.getDate();
    const dayInWords = numberToWordsWithOrdinal(day);

    // Add line break before the date
    return `${timeOfDay}<br>the ${dayInWords}`;
}

// Function to convert numbers to words with ordinals
function numberToWordsWithOrdinal(num) {
    const words = [
        "zero", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth",
        "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth",
        "seventeenth", "eighteenth", "nineteenth"
    ];

    const tens = ["", "", "twentieth", "thirtieth"];
    const tensWithOnes = [
        "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];

    if (num <= 19) {
        return words[num];
    } else if (num <= 29) {
        return num === 20 ? tens[2] : `${tensWithOnes[2]}-${words[num - 20]}`;
    } else if (num === 30) {
        return tens[3];
    } else if (num <= 31) {
        return `${tensWithOnes[3]}-${words[num - 30]}`;
    }
}

// Function to add the clock to the page and update it
export function addClock() {
    const clockElement = document.getElementById("clock");

    if (!clockElement) {
        console.error("Clock element not found");
        return;
    }

    const updateClock = () => {
        clockElement.innerHTML = getNaturalLanguageTime(); // Use innerHTML to handle the <br>
    };

    // Update the clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}
