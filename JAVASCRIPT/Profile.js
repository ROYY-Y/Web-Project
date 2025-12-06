  const logoutBtn = document.getElementById('logoutBtn');
  const logout = document.getElementById('logout');
  const closeBtn = document.getElementById('close');
  const confirmLogoutBtn = document.getElementById('confirmLogout');

  const delete_a = document.getElementById('Delete_a');
  const Delete_account = document.getElementById('Delete_account');
  const close_d = document.getElementById('close_d');
  const confirmDelete = document.getElementById('confirmDelete');

 // DELETE POPUP
delete_a.addEventListener('click', () => {
  Delete_account.classList.add('show');   // เปิดกล่อง
});

close_d.addEventListener('click', () => {
  Delete_account.classList.remove('show'); // ปิดกล่องด้วยปุ่ม Cancel
});

Delete_account.addEventListener('click', (e) => {
  if (e.target === Delete_account) {       // คลิกพื้นหลังด้านนอก = ปิด
    Delete_account.classList.remove('show');
  }
});

// LOGOUT POPUP
logoutBtn.addEventListener('click', () => {
  logout.classList.add('show');           // เปิดกล่อง
});

closeBtn.addEventListener('click', () => {
  logout.classList.remove('show');        // ปิดด้วยปุ่ม Cancel
});

logout.addEventListener('click', (e) => {
  if (e.target === logout) {              // คลิกพื้นหลัง = ปิด
    logout.classList.remove('show');
  }
});
