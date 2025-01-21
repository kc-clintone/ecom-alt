const form = document.getElementById("productForm");
const successMessage = document.getElementById("successMessage");

// Helper function to show error
function showError(inputId, message) {
  const errorElement = document.getElementById(inputId + "Error");
  errorElement.textContent = message;
}

// Helper function to clear error
function clearError(inputId) {
  const errorElement = document.getElementById(inputId + "Error");
  errorElement.textContent = "";
}

// Real-time validation
form.addEventListener("input", (e) => {
  const target = e.target;

  if (target.id === "email") {
    const email = target.value;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showError("email", "Invalid email format.");
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

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate all fields
  let isValid = true;

  const requiredFields = ["productName", "serialNumber", "purchaseDate", "customerName", "email", "phoneNumber", "terms"];
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);

    if ((field.type === "checkbox" && !field.checked) || !field.value) {
      isValid = false;
      showError(fieldId, "This field is required.");
    }
  });

  // If the form is valid
  if (isValid) {
    successMessage.textContent = "Thank you for registering your product!";
    form.reset();
    document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  }
});
