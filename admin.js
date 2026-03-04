document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.getElementById('#user-list');

    try {
        const response = await fetch('https://coffeeshopwebapp.onrender.com/admin/users');
        const users = await response.json();

        if(response.ok) {
            userList.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');

                const regDate = new Date(user.date).toLocaleDateString('tr-TR');
                row.innerHTML = `
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${regDate}</td>
                    `;

                    userList.appendChild(row);
            });
        } else {
            userList.innerHTML = '<tr><td colspan="3">An error has occurred while the data is uploading.</td></tr>'; 
        }
    } catch (error){
        console.error("Admin data retrieve error:", error);
        userList.innerHTML = '<tr><td colspan="3">You cannot access the server!</td></tr>';
    }
});