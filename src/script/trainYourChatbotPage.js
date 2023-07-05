
  function showInputFile() {
    var fileDiv = document.getElementById("file");
    fileDiv.style.display = "block";
  }

  function submitFile() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];

    // Use the 'fetch' function or any other method to send the file to the backend
    // Example using fetch:
    var formData = new FormData();
    formData.append("file", file);

    fetch("your-backend-url", {
      method: "POST",
      body: formData
    })
      .then(response => {
        // Handle the response from the backend

        // Hide the 'file' div
        var fileDiv = document.getElementById("file");
        fileDiv.style.display = "none";
      })
      .catch(error => {
        // Handle any errors
      });
  }

