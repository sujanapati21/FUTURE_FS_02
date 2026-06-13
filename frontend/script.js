const leadForm = document.getElementById("leadForm");
const leadList = document.getElementById("leadList");

const API_URL = "http://localhost:5000/leads";

// Load Leads
async function loadLeads() {
    try {
        const res = await fetch(API_URL);
        const leads = await res.json();

        leadList.innerHTML = "";

        leads.forEach((lead) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.source}</td>

                <td>
                    <select onchange="updateStatus(this, '${lead.id}')">
                        <option value="New" ${lead.status === "New" ? "selected" : ""}>New</option>
                        <option value="Contacted" ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
                        <option value="Interested" ${lead.status === "Interested" ? "selected" : ""}>Interested</option>
                        <option value="Closed" ${lead.status === "Closed" ? "selected" : ""}>Closed</option>
                    </select>
                </td>

                <td>${lead.notes}</td>

                <td>
                    <button onclick="deleteLead('${lead.id}')">
                        Delete
                    </button>
                </td>
            `;

            leadList.appendChild(row);
        });
    } catch (error) {
        console.log("Error loading leads:", error);
    }
}

// Add Lead
leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lead = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        source: document.getElementById("source").value,
        notes: document.getElementById("notes").value,
        status: "New"
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });

        leadForm.reset();
        loadLeads();
    } catch (error) {
        console.log("Error adding lead:", error);
    }
});

// Update Status
async function updateStatus(selectElement, id) {
    const newStatus = selectElement.value;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: newStatus
            })
        });

        loadLeads();
    } catch (error) {
        console.log("Error updating status:", error);
    }
}

// Delete Lead
async function deleteLead(id) {
    const confirmDelete = confirm("Are you sure you want to delete this lead?");

    if (confirmDelete) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            loadLeads();
        } catch (error) {
            console.log("Error deleting lead:", error);
        }
    }
}

// Load leads when page opens
loadLeads();