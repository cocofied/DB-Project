document.addEventListener("DOMContentLoaded", function () {

    // Determine the current page
    const currentPage = window.location.pathname.split("/").pop();
    //*********************************************************************************/
    const companyBtn = document.getElementById("company-btn");
    if (companyBtn) {
        companyBtn.addEventListener("click", function() {
            window.location.href = "https://db-project-zoyc.onrender.com/company.html";
        });
    }
    //*************************************************************************************/
    const customerBtn = document.getElementById("customer-btn");
    if (customerBtn) {
        customerBtn.addEventListener("click", function() {
            window.location.href = "https://db-project-zoyc.onrender.com/customer_sign_In.html";
        });
    }
    //****************************************************************************/
    // Sign-in function to connect to backend
async function signIn(event) {
    event.preventDefault();

    // Data for backend
    const signinData = {
        Email: document.getElementById("Email").value,
        Password: document.getElementById("Password").value,
    };

    try {
        // POST request to backend
        const response = await fetch("https://db-project-zoyc.onrender.com/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signinData),
        });
        

        if (response.ok) {
            const responseData = await response.json();
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(responseData.user));
            window.location.href = "https://db-project-zoyc.onrender.com/customer.html";
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || "Failed to sign in."}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Network error.");
    }
}

// Attach the Sign-In function to the button
const signinBtn = document.getElementById("signin-btn");
if (signinBtn) {
    signinBtn.addEventListener("click", signIn);
}


    //********************************************************************************/
    // Sign-up function to connect to backend
async function signUp(event) {
    event.preventDefault();

    // Collect input data
    const signupData = {
        FirstName: document.getElementById("FirstName").value,
        LastName: document.getElementById("LastName").value,
        Email: document.getElementById("Email").value,
        Password: document.getElementById("Password").value,
        PhoneNumber: document.getElementById("PhoneNumber").value,
        Address: document.getElementById("Address").value,
    };

    // Validate input
    if (Object.values(signupData).some((value) => !value)) {
        alert("All fields are required!");
        return;
    }

    try {
        // POST request to backend
        const response = await fetch("https://db-project-zoyc.onrender.com/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        });

        if (response.ok) {
            const responseData = await response.json();
            alert("Account created successfully!");
            window.location.href = "https://db-project-zoyc.onrender.com/customer_sign_In.html"; // Redirect to sign-in page
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || "Failed to create account."}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Network error. Please try again later.");
    }
}

// Attach the Sign-Up function to the button
const signupForm = document.getElementById("signup-submit-btn");
if (signupForm) {
    signupForm.addEventListener("click", signUp);
}

    //************************************************************************************/
    // Recover password function to connect to backend
async function recoverPassword(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the email value from the input field
    const email = document.getElementById("email").value;

    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }

    // Data to send to the backend
    const data = { Email: email };

    try {
        // POST request to the backend recover-password route
        const response = await fetch("https://db-project-zoyc.onrender.com/recover-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            // Display the recovered password in the HTML
            document.getElementById("password-display").textContent = responseData.password;
            document.getElementById("recovered-password").style.display = "block";
        } else {
            const error = await response.json();
            alert(`Error: ${error.error || "Failed to recover password."}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Network error. Please try again later.");
    }
}

// Attach the recoverPassword function to the Recover button
const recoverBtn = document.getElementById("recover-btn");
if (recoverBtn) {
    recoverBtn.addEventListener("click", recoverPassword);
}

    //*************************************************************************************/
    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", function() {
            window.location.href = "https://db-project-zoyc.onrender.com/customer_sign_up.html";
        });
    }
    //*************************************************************************************/
    const forgotpassBtn = document.getElementById("forgot-pass-btn");
    if (forgotpassBtn) {
        forgotpassBtn.addEventListener("click", function() {
            window.location.href = "https://db-project-zoyc.onrender.com/recover_password.html";
        });
    }
    //***************************************************************************************/
    //validate session on pages needed
    /*
    const restrictedPages = ["customer.html", "review.html"];

    if (restrictedPages.includes(currentPage)) {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user) {
            alert("You must sign in first.");
            window.location.href = "customer_sign_in.html";
            return;
        }
        document.getElementById("welcome-message").textContent = `Welcome, ${user.email}!`;
    }
    */
    //*****************************************************************************************/
    //clear local storage when going to homepage(sign out)
    const homepageBtn = document.getElementById("homepage-btn");
    if (homepageBtn) {
        homepageBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.href = "https://db-project-zoyc.onrender.com/homepage.html";
        });
    }
    //*********************************************************************************************/
  // Customer page-specific functionality
    if (currentPage === "customer.html") {

        const userData = JSON.parse(localStorage.getItem("user"));
        const UserID = userData ? userData.id : null;

        // Fetch and display catering companies
        async function getCateringCompanies() {
            try {
                const response = await fetch("https://db-project-zoyc.onrender.com/companies");
                if (response.ok) {
                    const companies = await response.json();
                    const companySelect = document.getElementById("company-name");
        
                    // Clear existing options before appending new ones
                    companySelect.innerHTML = `<option value="" disabled selected>Select a Catering Service</option>`;
        
                    // Populate dropdown with options
                    companies.forEach(company => {
                        const option = document.createElement("option");
                        option.value = company.CompanyID; // Use ServiceID for the value
                        option.textContent = company.CompanyName; // Display ServiceName
                        companySelect.appendChild(option);
                    });
                } else {
                    console.error("Failed to fetch companies:", response.statusText);
                    alert("Failed to fetch companies. Please try again later.");
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
                alert("Network error. Please try again later.");
            }
        }        


        // Show price when a company is selected
        async function showPrice(event) {
            const selectedCompanyId = event.target.value; // Get the selected ServiceID
            console.log("Selected CompanyID:", selectedCompanyId);
            if (!selectedCompanyId) {
                alert("Please select a valid service.");
                return;
            }
        
            try {
                // Fetch the price using the selected ServiceID
                const response = await fetch(`https://db-project-zoyc.onrender.com/api/services/${selectedCompanyId}`);
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById("price").textContent = `$${data.price}`;
                    document.getElementById("price-section").style.display = "block"; // Show the price section
                } else {
                    console.error("Failed to fetch price:", response.statusText);
                    alert("Failed to fetch price.");
                }
            } catch (error) {
                console.error("Error fetching price:", error);
                alert("Network error. Please try again later.");
            }
        }
        

        // Handle booking confirmation
        async function confirmBooking(event, UserID) {
            event.preventDefault();
            console.log("Inside confirmBooking function.");

            if (!UserID) {
                console.error("UserID is undefined!");
                alert("User is not logged in.");
                return;
            }

            const selectedCompany = companySelect.value;
            if (!selectedCompany) {
                alert("Please select a catering company.");
            return;
            }

            const price = document.getElementById("price").textContent.replace("$", "").trim();
            if (!price) {
                alert("Price is missing! Please select a valid service.");
                return;
            }

            const bookingData = {
                ServiceName: document.getElementById("company-name").selectedOptions[0].textContent,
                Description: document.getElementById("service-description").value,
                PaymentMethod: document.getElementById("payment-method").value,
                Price: price,
                UserID: UserID,
            };

            console.log("Booking Data: ", bookingData);

            try {
                console.log("Booking Data:", bookingData);
                const response = await fetch("https://db-project-zoyc.onrender.com/addBooking", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bookingData),
                });
                if (response.ok) {
                    alert("Booking confirmed!");
                    document.getElementById("booking-form-details").reset();
                    document.getElementById("price").textContent = "";
                } else {
                    const error = await response.json();
                    alert("Error confirming booking: " + error.message);
                }
            } 
            catch (error) {
                console.error("Error", error);
                alert("Network error.");
            }
        }

        const companySelect = document.getElementById("company-name");
        if (companySelect) {
            companySelect.addEventListener("change", showPrice);
        }

        const confirmBookingBtn = document.getElementById("confirm-booking-btn");
        if (confirmBookingBtn) {
            const userData = JSON.parse(localStorage.getItem("user"));
            const UserID = userData ? userData.UserID : null;
            console.log("Confirm booking button found.");
            confirmBookingBtn.addEventListener("click", function (event) {
            console.log("Confirm booking button clicked.");
            confirmBooking(event, UserID);
        });
}

        // Initialize customer page
        getCateringCompanies();
    }
    //*******************************************************************************************/
    const gotoReviewBtn = document.getElementById("go-to-review-btn");
    if (gotoReviewBtn) {
        gotoReviewBtn.addEventListener("click", function() {
            window.location.href = "https://db-project-zoyc.onrender.com/review.html";
        });
    }
    //******************************************************************************************/
    // Review page-specific functionality
    if (currentPage === "review.html") {

        const user = JSON.parse(localStorage.getItem("user"));
        const UserID = user ? user.UserID : null;

if (UserID) {
    // Fetch services for the logged-in user
    fetch(`/getUserServices?UserID=${UserID}`)
        .then(response => response.json())
        .then(services => {
            const serviceDropdown = document.getElementById("service-dropdown");

            services.forEach(service => {
                const option = document.createElement("option");
                option.value = service.ServiceID;  // ServiceID as the value for the option
                option.textContent = service.ServiceName;  // ServiceName as the text
                serviceDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching services:", error));
}

// Event listener for dropdown change (display service details)
document.getElementById("service-dropdown").addEventListener("change", function() {
    const selectedServiceID = this.value;
    
    if (selectedServiceID) {
        // Fetch the service details based on selected ServiceID
        fetch(`/getServiceDetails?ServiceID=${selectedServiceID}`)
            .then(response => response.json())
            .then(service => {
                // Populate the service details in the UI
                document.getElementById("service-name").textContent = service.ServiceName;
                document.getElementById("service-description").textContent = service.Description;
                document.getElementById("service-price").textContent = service.Price;

                document.getElementById("service-details").style.display = "block";
            })
            .catch(error => console.error("Error fetching service details:", error));
    } else {
        // Reset service details if no service is selected
        document.getElementById("service-details").style.display = "none";
    }
});

// Handle review submission
document.getElementById("submit-review-btn").addEventListener("click", () => {
    const rating = document.getElementById("rating").value;
    const reviewDescription = document.getElementById("review-description").value;
    const serviceID = document.getElementById("service-dropdown").value;
    const user = JSON.parse(localStorage.getItem("user"));
    const UserID = user ? user.UserID : null;

    if (UserID && rating && reviewDescription && serviceID) {
        const reviewData = {
            Rating: rating,
            Comments: reviewDescription,
            UserID: UserID,
            ServiceID: serviceID
        };

        // Send the review to the backend
        fetch("/addReview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Display success message
            // Optionally reset the form after submission
            document.getElementById("review-form").reset();
        })
        .catch(error => console.error("Error submitting review:", error));
    } else {
        alert("All fields are required.");
    }
});
    }
    //******************************************************************************************/
    const gotoBookingBtn = document.getElementById("go-to-customer-btn");
    if (gotoBookingBtn) {
        gotoBookingBtn.addEventListener("click", function() {
            window.location.href = "https://db-project-zoyc.onrender.com/customer.html";
        });
    }
    //********************************************************************************************/
    //add company
    async function addCompany(event) {
        event.preventDefault();
        
        const companyData = {
            companyName: document.getElementById("add_company_name").value,
            contactName: document.getElementById("add_contact_name").value,
            contactEmail: document.getElementById("add_contact_email").value,
            contactPhone: document.getElementById("add_contact_phone").value,
            address: document.getElementById("add_address").value,
            price: document.getElementById("add_price").value,
        };

        try {
            const response = await fetch("https://db-project-zoyc.onrender.com/add_companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(companyData),
            });
    
            if (response.ok) {
                alert("Company added.");
                document.getElementById("add-company-form").reset();
            } else {
                const error = await response.json();
                alert("Error adding company: " + error.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error.");
        }
    }
    const addCompanyBtn = document.getElementById("add-company-btn");
    if (addCompanyBtn) {
        addCompanyBtn.addEventListener("click", addCompany);
    }
    //***************************************************************************************************/
    //delete company
    async function deleteCompany(event) {
        event.preventDefault();
    
        const deleteData = {
            CompanyName: document.getElementById("delete-company-name").value,
            Address: document.getElementById("delete-address").value,
        };
    
        try {
            const response = await fetch("https://db-project-zoyc.onrender.com/delete_companies", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deleteData),
            });
    
            if (response.ok) {
                alert("Company deleted.");
                document.getElementById("delete-company-form").reset();
            } else {
                const error = await response.json();
                alert("Error deleting company: " + error.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error.");
        }
    }
    const deleteCompanyBtn = document.getElementById("delete-company-btn");
    if (deleteCompanyBtn) {
        deleteCompanyBtn.addEventListener("click", deleteCompany);
    }
    //**********************************************************************************/
});