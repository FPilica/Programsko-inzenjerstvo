import Header from './components/Header'
import './App.css'

function AdminDash() {
  return (
    <>
      <div className="background">
        <div className="adminContainer">
          <Header userRole={"admin"}/>
          <h1>Admin Dashboard</h1>
        </div>
      </div>
    </>
  )
}

export default AdminDash;
