
async function startCamera() {
    try {
        const videoElement = document.getElementById(`video-${data.id}`);
        const data  = {}
        if (videoElement) {
            videoElement.src = data?.stream;
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

function addCarToTable(carNumber, checkInTime, checkOutTime, totalCost) {
    const table = document.getElementById('car_table').getElementsByTagName('tbody')[0];

    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    cell1.innerHTML = carNumber;
    cell2.innerHTML = checkInTime;
    cell3.innerHTML = checkOutTime;
    cell4.innerHTML = totalCost;
}

// Example usage: Add some sample data to the table
addCarToTable('ABC123', '10:00 AM', '3:30 PM', '$20');
addCarToTable('XYZ789', '12:45 PM', '6:15 PM', '$15');
addCarToTable('XYZ789', '12:45 PM', '6:15 PM', '$15');
addCarToTable('XYZ789', '12:45 PM', '6:15 PM', '$15');
addCarToTable('XYZ789', '12:45 PM', '6:15 PM', '$15');

// Call the function to start the camera stream when the page loads
window.onload = () => {
    startCamera();
    addCarToTable()
};