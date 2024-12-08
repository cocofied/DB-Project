document.addEventListener("DOMContentLoaded", function () {

    // Determine the current page
    const currentPage = window.location.pathname.split("/").pop();
    //*********************************************************************************/
    const companyBtn = document.getElementById("company-btn");
    if (companyBtn) {
        companyBtn.addEventListener("click", function() {
            window.location.href = "company.html";
        });
    }
    //*************************************************************************************/
    const customerBtn = document.getElementById("customer-btn");
    if (customerBtn) {
        customerBtn.addEventListener("click", function() {
            window.location.href = "customer_sign_in.html";
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
        const response = await fetch("http://localhost:3000/sign-in", {
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
            window.location.href = "customer.html";
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
        const response = await fetch("http://localhost:3000/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        });

        if (response.ok) {
            const responseData = await response.json();
            alert("Account created successfully!");
            window.location.href = "customer_sign_in.html"; // Redirect to sign-in page
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
        const response = await fetch("/recover-password", {
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
            window.location.href = "customer_sign_up.html";
        });
    }
    //*************************************************************************************/
    const forgotpassBtn = document.getElementById("forgot-pass-btn");
    if (forgotpassBtn) {
        forgotpassBtn.addEventListener("click", function() {
            window.location.href = "recover_password.html";
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
            window.location.href = "homepage.html";
        });
    }
    //*********************************************************************************************/
  // Customer page-specific functionality
    if (currentPage === "customer.html") {
        // Fetch and display catering companies
        async function getCateringCompanies() {
            try {
                const response = await fetch("http://localhost:3000/companies");
                if (response.ok) {
                    const companies = await response.json();
                    const companySelect = document.getElementById("company-name");
        
                    // Clear existing options before appending new ones
                    companySelect.innerHTML = `<option value="" disabled selected>Select a Catering Service</option>`;
        
                    // Populate dropdown with options
                    companies.forEach(company => {
                        const option = document.createElement("option");
                        option.value = company.ServiceID; // Use ServiceID for the value
                        option.textContent = company.ServiceName; // Display ServiceName
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
            const selectedServiceId = event.target.value; // Get the selected ServiceID
            console.log("Selected ServiceID:", selectedServiceId);
            if (!selectedServiceId) {
                alert("Please select a valid service.");
                return;
            }
        
            try {
                // Fetch the price using the selected ServiceID
                const response = await fetch(`http://localhost:3000/api/services/${selectedServiceId}`);
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
        async function confirmBooking(event) {
            event.preventDefault();
            const companyName = document.getElementById("company-name").value;
            const description = document.getElementById("service-description").value;
            const paymentMethod = document.getElementById("payment-method").value;
            const price = document.getElementById("price").textContent.replace("$", "");

            if (!companyName || !description || !paymentMethod || !price) {
                alert("All fields are required.");
                return;
            }

            const bookingData = {
                companyName,
                description,
                paymentMethod,
                price,
            };

            try {
                const response = await fetch("", {
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
            confirmBookingBtn.addEventListener("click", confirmBooking);
        }

        // Initialize customer page
        getCateringCompanies();
    }
    //*******************************************************************************************/
    const gotoReviewBtn = document.getElementById("go-to-review-btn");
    if (gotoReviewBtn) {
        gotoReviewBtn.addEventListener("click", function() {
            window.location.href = "review.html";
        });
    }
    //******************************************************************************************/
    // Review page-specific functionality
    if (currentPage === "review.html") {

        // Fetch the booked services for the user
        async function getBookedServices() {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                alert("You must be signed in to leave a review.");
                window.location.href = "customer_sign_in.html";
                return;
            }

            try {
                const response = await fetch(``);
                if (response.ok) {
                    const services = await response.json();
                    const serviceList = document.getElementById("service-list");

                    services.forEach(service => {
                        const serviceItem = document.createElement("div");
                        serviceItem.classList.add("service-item");
                        serviceItem.innerHTML = `
                            <p><strong>${service.companyName}</strong></p>
                            <p>Description: ${service.description}</p>
                            <p>Price: $${service.price}</p>
                            <div id="review-${service.id}">
                                ${service.review ? 
                                    `<p>Rating: ${service.review.rating} / 5</p>
                                     <p>Review: ${service.review.description}</p>` : 
                                    `<button class="leave-review-btn" data-service-id="${service.id}">Leave a Review</button>`
                                }
                            </div>
                        `;
                        serviceList.appendChild(serviceItem);

                        // If review button exists, attach click event to open the review form
                        const reviewBtn = serviceItem.querySelector(".leave-review-btn");
                        if (reviewBtn) {
                            reviewBtn.addEventListener("click", () => openReviewForm(service));
                        }
                    });
                } else {
                    alert("Failed to fetch booked services.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Network error.");
            }
        }

        // Open the review form for a specific service
        function openReviewForm(service) {
            document.getElementById("review-form").style.display = "block";

            const submitBtn = document.getElementById("submit-review-btn");
            submitBtn.onclick = function(event) {
                event.preventDefault();

                const rating = document.getElementById("rating").value;
                const description = document.getElementById("review-description").value;

                if (!rating || !description) {
                    alert("All fields are required.");
                    return;
                }

                // Send review data to the backend
                submitReview(service.id, rating, description);
            };
        }

        // Submit the review to the backend
        async function submitReview(serviceId, rating, description) {
            const user = JSON.parse(localStorage.getItem("user"));
            const reviewData = {
                userId: user.id,
                serviceId: serviceId,
                rating: rating,
                description: description
            };

            try {
                const response = await fetch("", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reviewData)
                });

                if (response.ok) {
                    alert("Review submitted successfully!");
                    document.getElementById("review-form").reset();
                    document.getElementById("review-form").style.display = "none";
                    getBookedServices(); // Reload services to update the review status
                } else {
                    const error = await response.json();
                    alert("Error submitting review: " + error.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Network error.");
            }
        }

        // Initialize review page
        getBookedServices();
    }
    //******************************************************************************************/
    const gotoBookingBtn = document.getElementById("go-to-customer-btn");
    if (gotoBookingBtn) {
        gotoBookingBtn.addEventListener("click", function() {
            window.location.href = "customer.html";
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
        };

        try {
            const response = await fetch("/companies", {
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
            companyName: document.getElementById("delete-company-name").value,
            address: document.getElementById("delete-address").value,
        };
    
        try {
            const response = await fetch("/companies/:companyId", {
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