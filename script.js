/* =========================================
   COFFEE BLISS - HASURA CONNECTION
   ========================================= */

const HASURA_URL = "https://boss-cod-63.hasura.app/v1/graphql";

// Hasura Console -> Settings -> Admin Secret (pudhu secret-a inga paste pannunga)
const HASURA_ADMIN_SECRET = "PTxWdNUcYMK5xBas7sD2A2v5XyHHt54LVQVxYhAkCObLY2pmkcaUC6z04X5kUmmU";


/* =========================================
   HOME
   ========================================= */

function goOrder() {
    openTab("order");
}


/* =========================================
   ABOUT
   ========================================= */

function learnMore() {
    alert("Coffee Bliss: Where every cup creates a beautiful memory ☕");
}


/* =========================================
   MENU
   ========================================= */
function orderItem(item) {
    alert(item + " added to your order ☕");
    openTab("order");
}


/* =========================================
   ORDER - CALCULATE TOTAL
   ========================================= */

function calculateTotal() {
    const item = document.getElementById("item");
    const quantityInput = document.getElementById("quantity");
    const totalElement = document.getElementById("total");
    const selectedElement = document.getElementById("selected");

    if (!item || !quantityInput || !totalElement) return;

    const price = Number(item.value);
    let quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
        quantity = 1;
        quantityInput.value = 1;
    }

    const total = price * quantity;

    totalElement.innerText = total;

    if (selectedElement) {
        selectedElement.innerText =
            item.options[item.selectedIndex].text.trim();
    }
}

/* =========================================
   PLACE ORDER - SAVE TO HASURA
   ========================================= */

async function placeOrder() {
    const customer = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const item = document.getElementById("item");
    const quantity = Number(document.getElementById("quantity").value);
    const total = Number(document.getElementById("total").innerText);

    const selectedOption = item.options[item.selectedIndex];

    const productId = Number(
        selectedOption.getAttribute("data-product-id")
    );

    const productName = selectedOption.text.trim();

    /* VALIDATION */

    if (!customer) {
        alert("Please enter customer name ☕");
        return;
    }

    if (!phone) {
        alert("Please enter phone number ☕");
        return;
    }

    if (!Number.isInteger(productId) || productId < 1) {
        alert("Please select a valid product.");
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter valid quantity.");
        return;
    }

    if (!Number.isFinite(total) || total < 0) {
        alert("Please check your order total.");
        return;
    }

    /* GRAPHQL MUTATION */

    const mutation = `
        mutation PlaceOrder(
            $customer_name: String!
            $phone: String!
            $product_id: Int!
            $product_name: String!
            $quantity: Int!
            $total: numeric!
        ) {
            insert_orders_one(
                object: {
                    customer_name: $customer_name
                    phone: $phone
                    product_id: $product_id
                    product_name: $product_name
                    quantity: $quantity
                    total: $total
                    status: "Pending"
                }
            ) {
                id
                customer_name
                phone
                product_id
                product_name
                quantity
                total
                status
                created_at
            }
        }
    `;

    /* SEND REQUEST TO HASURA */

    try {
        const response = await fetch(HASURA_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "x-hasura-admin-secret": HASURA_ADMIN_SECRET.trim()
            },

            body: JSON.stringify({
                query: mutation,

                variables: {
                    customer_name: customer,
                    phone: phone,
                    product_id: productId,
                    product_name: productName,
                    quantity: quantity,
                    total: total
                }
            })
        });

        const result = await response.json();

        console.log("Hasura Response:", result);

        /* ERROR CHECKING */

        if (!response.ok || result.errors ||
            !result.data?.insert_orders_one) {

            const errorMessage = result.errors
                ? result.errors.map(error => error.message).join("\n")
                : result.error || ("HTTP error: " + response.status);

            console.error("GraphQL Error:", result.errors || result);

            alert("Order Failed ❌\n\n" + errorMessage);
            return;
        }

        /* ORDER SUCCESS */

        alert(
            "Thank you " + customer +
            "! Your Coffee Bliss order has been saved ☕"
        );

        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("quantity").value = 1;

        calculateTotal();

    } catch (error) {
        console.error("Connection Error:", error);

        alert(
            "Database connection failed ❌\n" +
            "Please check your internet connection and Hasura settings."
        );
    }
}


/* =========================================
   REVIEWS
   ========================================= */

function addReview() {
    const name = document.getElementById("customer").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !message) {
        alert("Please fill all details");
        return;
    }

    const box = document.getElementById("reviewBox");

    const review = document.createElement("div");
    review.className = "review";

    const heading = document.createElement("h2");
    heading.textContent = name;

    const stars = document.createElement("h3");
    stars.textContent = "⭐⭐⭐⭐⭐";

    const paragraph = document.createElement("p");
    paragraph.textContent = '"' + message + '"';

    review.appendChild(heading);
    review.appendChild(stars);
    review.appendChild(paragraph);
    box.appendChild(review);

    alert("Thank you for your review ☕");

    document.getElementById("customer").value = "";
    document.getElementById("message").value = "";
}


/* =========================================
   CONTACT
   ========================================= */

function sendMessage() {
    const name = document.getElementById("cname").value.trim();
    const email = document.getElementById("cemail").value.trim();
    const message = document.getElementById("cmessage").value.trim();

    if (!name || !email || !message) {
        alert("Please fill all fields");
        return;
    }

    alert("Thank you " + name + "! Your message has been sent ☕");

    document.getElementById("cname").value = "";
    document.getElementById("cemail").value = "";
    document.getElementById("cmessage").value = "";
}


/* =========================================
   TAB SWITCHING
   ========================================= */

function showTab(tabName) {
    const sections = document.querySelectorAll(".tab-section");

    sections.forEach(function (section) {
        section.classList.remove("active");
    });

    const target = document.getElementById(tabName + "-section");

    if (target) {
        target.classList.add("active");
    }

    const links = document.querySelectorAll(".tab-link");

    links.forEach(function (link) {
        link.classList.remove("active-link");

        if (link.dataset.tab === tabName) {
            link.classList.add("active-link");
        }
    });

    history.replaceState(null, "", "#" + tabName);
    window.scrollTo(0, 0);
}


/* =========================================
   OPEN TAB
   ========================================= */

function openTab(tabName) {
    showTab(tabName);
    return false;
}


/* =========================================
   PAGE LOAD
   ========================================= */

window.addEventListener("DOMContentLoaded", function () {
    let hash = window.location.hash.replace("#", "");

    const validTabs = [
        "home",
        "about",
        "menu",
        "order",
        "reviews",
        "contact"
    ];

    if (!validTabs.includes(hash)) {
        hash = "home";
    }

    showTab(hash);

    if (document.getElementById("item")) {
        calculateTotal();
    }
});