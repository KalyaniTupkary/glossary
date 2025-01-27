// formHandler.js

export function initializeFormHandler(formSelector, successCallback) {
    const formContainer = document.querySelector(".suggest-form");

    // Function to show thank-you message
    function showThankYouMessage() {
        formContainer.innerHTML = `
            <div class="thank-you-message">
                <p>Thanks for submitting!</p>
                <button id="submitAnother">Submit another word</button>
            </div>
        `;

        document.getElementById("submitAnother").addEventListener("click", () => {
            resetForm();
        });
    }

    // Function to reset the form
    function resetForm() {
        formContainer.innerHTML = `
            
                <div class="form-group">
                    <label for="name">name</label>
                    <input type="text" id="name" name="name"  />
                </div>
                <div class="form-group">
                    <label for="email">email</label>
                    <input type="email" id="email" name="email"  />
                </div>
                <div class="form-group">
                    <label for="wordDetails">words about the word</label>
                    <textarea id="word-details" name="wordDetails" required></textarea>
                </div>
                <button type="submit">Submit</button>
           
        `;

        initializeSubmitListener();
    }// Function to handle form submission
function initializeSubmitListener() {
    const form = document.querySelector(formSelector);
    const submitButton = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Change button text and disable it
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            await fetch("https://script.google.com/macros/s/AKfycbxhAQzQS-9UF2ObIaEA5Gt5dKJf6smbGaZ5MzjE71SImJ1UnpM6mPa_xclQru2EWJBdlQ/exec", {
                method: "POST",
                body: formData,
                mode: "no-cors",
            });

            if (successCallback) successCallback();
            showThankYouMessage();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an issue submitting the form. Please try again.");
        } finally {
            // Reset button text and enable it again (if not replaced by the thank-you message)
            if (document.contains(submitButton)) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit";
            }
        }
    });
}

    // Initialize form on first load
    initializeSubmitListener();
}
