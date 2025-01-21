const form = document.getElementById("productForm");
const successMessage = document.getElementById("successMessage");

// funtion to show loading spinner
function showLoading() {
  const spinner = document.createElement("div");
  spinner.id = "loadingSpinner";
  spinner.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border: 5px solid #ccc;
    border-top: 5px solid blue;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;
  document.body.appendChild(spinner);
}

// funtion for hiding loading spinner
function hideLoading() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.remove();
  }
}

// Save form data to local storage (implementing storage)
function saveFormData() {
  const formData = {};
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    formData[input.id] = input.value || input.checked;
  });
  localStorage.setItem("formData", JSON.stringify(formData));
}

// Loading stored form data from local storage
function loadFormData() {
  const formData = JSON.parse(localStorage.getItem("formData"));
  if (formData) {
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        input.checked = formData[input.id] || false;
      } else {
        input.value = formData[input.id] || "";
      }
    });
  }
}

// Helper function for showing error
function showError(inputId, message) {
  const errorElement = document.getElementById(inputId + "Error");
  errorElement.textContent = message;
}

// Helper function to clear error
function clearError(inputId) {
  const errorElement = document.getElementById(inputId + "Error");
  errorElement.textContent = "";
}

// Real-time form validation
form.addEventListener("input", (e) => {
  saveFormData(); // Saving the data on each input
  const target = e.target;

  if (target.id === "email") {
    const email = target.value;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError("email", "Enter a valid email address.");
    } else {
      clearError("email");
    }
  }

  if (target.id === "phoneNumber") {
    const phone = target.value;
    if (!/^\d{10}$/.test(phone)) {
      showError("phoneNumber", "Phone number must be 10 digits.");
    } else {
      clearError("phoneNumber");
    }
  }

  if (target.id === "serialNumber") {
    const serial = target.value;
    if (!/^[a-zA-Z0-9]{12}$/.test(serial)) {
      showError("serialNumber", "Serial number must be 12 alphanumeric characters.");
    } else {
      clearError("serialNumber");
    }
  }

  if (target.id === "productName" && target.value === "") {
    showError("productName", "Please select a product.");
  } else {
    clearError("productName");
  }
});

// handling form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validating all fields
  let isValid = true;

  const requiredFields = ["productName", "serialNumber", "purchaseDate", "customerName", "email", "phoneNumber", "terms"];
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if ((field.type === "checkbox" && !field.checked) || !field.value) {
      isValid = false;
      showError(fieldId, "This field is required.");
    } else {
      clearError(fieldId);
    }
  });

  if (isValid) {
    showLoading();

    // handling the AJAX requests
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        successMessage.textContent = "You have successfully registered your product!";
        successMessage.style.color = "green";
        form.reset();
        localStorage.removeItem("formData");
      } else {
        successMessage.textContent = "Failed to submit the form. Please try again.";
        successMessage.style.color = "red";
      }
    } catch (error) {
      successMessage.textContent = "An error occurred. Please try again.";
      successMessage.style.color = "red";
    } finally {
      hideLoading();
    }
  }
});

// Loading saved data when the page loads
window.addEventListener("DOMContentLoaded", loadFormData);
