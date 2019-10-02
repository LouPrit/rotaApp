const helper = {
  openForm: function (e) {
    if (e.target.getAttribute('teamname')) {
      document.getElementById(e.target.id).style.display = "flex";
    } else {
      alert("Please select a team and then click 'Get Rota' first");
    }
  },
  closeForm: function (e) {
    document.getElementById(e.target.id).style.display = "none";
  }
}

export default helper;