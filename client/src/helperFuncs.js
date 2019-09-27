  const helper = {
    openForm: function (e) {
      document.getElementById(e.target.id).style.display = "flex";
    },
    closeForm: function (e) {
      document.getElementById(e.target.id).style.display = "none";
    }
  }

  export default helper;