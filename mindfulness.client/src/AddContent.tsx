import Header from "./components/Header";

function AddContent() {
  return (
    <>
      <div className="background">
        <div className="addContentContainer">
            <Header userRole={localStorage.getItem("userRole") || ""}/>
          <h1>Dodaj sadržaj</h1>
        </div>
      </div>
    </>
  );
}

export default AddContent;