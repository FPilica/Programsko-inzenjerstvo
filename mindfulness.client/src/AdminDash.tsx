import { useEffect, useState } from 'react'
import Header from './components/Header'
import './App.css'
import './AdminDash.css'

function AdminDash() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/UserProfile/getallusers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching users");
        return;
      }

      const usersData = await response.json();
      // Filtriraj admina iz liste
      const filteredUsers = usersData.filter((user: any) => 
        user.role?.toLowerCase() !== "admin"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `https://localhost:7070/api/UserProfile/deleteprofile${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri brisanju korisnika");
      }

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Greška pri brisanju korisnika");
      return false;
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (!window.confirm(`Jeste li sigurni da želite izbrisati korisnika ${selectedUser.firstName} ${selectedUser.lastName}?`)) {
      return;
    }

    const success = await deleteUser(selectedUser.id);
    if (success) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      handleCloseModal();
      alert("Korisnik uspješno izbrisan!");
    }
  };

  return (
    <>
      <div className="background">
        <div className="adminContainer">
          <Header userRole={"admin"}/>
          <h1>Admin Dashboard</h1>
          
          <div className="admin-users-section">
            <h2>Svi korisnici</h2>
            {loading ? (
              <p className="loading-text">Učitavanje...</p>
            ) : (
              <div className="admin-users-grid">
                  {users.map((user) => (
                    <div 
                      key={user.id} 
                      className="admin-user-card"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="admin-user-info">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p className="admin-user-email">{user.email}</p>
                        {user.role && <span className="admin-user-role">{user.role}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Detalji korisnika</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            
            <div className="admin-modal-body">
              <div className="admin-detail-row">
                <span className="admin-detail-label">Ime i prezime:</span>
                <span className="admin-detail-value">{selectedUser.firstName} {selectedUser.lastName}</span>
              </div>
              
              <div className="admin-detail-row">
                <span className="admin-detail-label">Email:</span>
                <span className="admin-detail-value">{selectedUser.email}</span>
              </div>
              
              {selectedUser.role && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Uloga:</span>
                  <span className="admin-user-role">{selectedUser.role}</span>
                </div>
              )}
              
              {selectedUser.dateOfBirth && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Datum rođenja:</span>
                  <span className="admin-detail-value">{new Date(selectedUser.dateOfBirth).toLocaleDateString('hr-HR')}</span>
                </div>
              )}
              
              {selectedUser.gender && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Spol:</span>
                  <span className="admin-detail-value">{selectedUser.gender}</span>
                </div>
              )}
            </div>
            
            <div className="admin-modal-footer">
              <button className="myButton admin-button-cancel" onClick={handleCloseModal}>
                Zatvori
              </button>
              <button className="myButton admin-button-delete" onClick={handleDeleteUser}>
                Izbriši korisnika
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDash;
