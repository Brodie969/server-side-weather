/* How reminders will work:
Client uses a form to submit a date and title (for example 1/1/2000 and "New Millennium")
Javascript formats that properly then sends a POST
Python can take that raw data and place it in the file, in chronological order

There will also be a delete button next to every reminder/countdown to be handled by Javscript */

const formHead = document.getElementById("remindersTitle");
formHead.textContent = "Add A Reminder:";
const formHead2 = document.getElementById("remindersTitle2");
formHead2.textContent = "Select A Reminder To Delete:";
const head = document.getElementById("remindersStatic");
head.innerHTML = "Reminders:";

function getReminders() {
    fetch("/data")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(text => {
            const lines = text.split("\n");
            const parent = document.getElementById("reminders");
            parent.innerHTML = "";

            lines.forEach(line => {
                const [title, date] = line.split(",");
                console.log(`Title: ${title.trim()}, Date: ${date.trim()}`);

                const div = document.createElement("div");
                div.textContent = `${title.trim()} on ${date.trim()}`;
                parent.appendChild(div);
            });
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}

function formatDate(inputDate) {
    const dateNumbers = inputDate.split('-');
    if (dateNumbers.length === 3) {
      const year = dateNumbers[0];
      const month = dateNumbers[1];
      const day = dateNumbers[2];
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
}  

function clearForm() {
    let form = document.getElementById("create");
    for (let i = 0; i < form.elements.length; i++) {
        let field = form.elements[i];
        field.value = "";
    }
}

// Load Form
const formElement = document.getElementById("remindersAdd");
formElement.innerHTML = `<form id="create"><label for="name">Name:</label><input type="text" id="name" required><br><br><label for="date">Date:</label><input type="date" id="date" required><br><br><button type="submit">Submit</button></form>`;

const form = document.getElementById("create");
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents the form from submitting normally
    let date = document.getElementById("date").value;
    let name = document.getElementById("name").value;
    date = formatDate(date);
    let reminder = `${name},${date}`;

    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminder),
    })
    .then(response => response.text())
    .then(result => {
        console.log(result); // Logging the response from Flask
        alert("Working! " + result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    getReminders();
    clearForm();
});

getReminders();
