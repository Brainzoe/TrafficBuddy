// Check if the map container exists before initializing the map
var map;
if (!L.DomUtil.get('map')) {
    // Initialize the Leaflet map
    map = L.map('map').setView([51.505, -0.09], 13); // Set initial coordinates and zoom level
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("traffic-form");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get user input from the form
        const origin = document.getElementById("origin").value;
        const destination = document.getElementById("destination").value;

        // Create an object to send as JSON data
        const requestData = { origin, destination };

        // Make an AJAX POST request to your Flask backend
        fetch("/get_traffic_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            // Handle the returned traffic data
            if (data.routes && data.routes.length > 0) {
                // Extract traffic data from the response
                const trafficData = data.routes[0].legs[0].duration_in_traffic;

                // Display the traffic data in the <pre> element
                document.getElementById("traffic-data").textContent = JSON.stringify(trafficData, null, 2);
            } else {
                console.error("Invalid traffic data received");
                document.getElementById("traffic-data").textContent = "Error: Invalid traffic data received.";
            }
        })
        .catch(function(error) {
            // Handle errors
            console.error(error);
            document.getElementById("traffic-data").textContent = "Error fetching traffic data.";
        });
    });
});
