document.addEventListener("DOMContentLoaded", () => {
  console.log("Debug script loaded")

  // Add debug button to the page
  const debugButton = document.createElement("button")
  debugButton.textContent = "Debug Data"
  debugButton.style.position = "fixed"
  debugButton.style.bottom = "20px"
  debugButton.style.right = "20px"
  debugButton.style.zIndex = "9999"
  debugButton.style.padding = "10px 15px"
  debugButton.style.backgroundColor = "#e94e77"
  debugButton.style.color = "white"
  debugButton.style.border = "none"
  debugButton.style.borderRadius = "5px"
  debugButton.style.cursor = "pointer"

  document.body.appendChild(debugButton)

  // Add event listener to debug button
  debugButton.addEventListener("click", () => {
    console.log("Running data creation script...")

    // Create a status message
    const statusMessage = document.createElement("div")
    statusMessage.style.position = "fixed"
    statusMessage.style.top = "50%"
    statusMessage.style.left = "50%"
    statusMessage.style.transform = "translate(-50%, -50%)"
    statusMessage.style.padding = "20px"
    statusMessage.style.backgroundColor = "white"
    statusMessage.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)"
    statusMessage.style.borderRadius = "5px"
    statusMessage.style.zIndex = "10000"
    statusMessage.innerHTML = "<p>Creating data files...</p>"

    document.body.appendChild(statusMessage)

    // Call the create_data.php script
    fetch("php/api/create_data.php")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data creation result:", data)

        if (data.success) {
          statusMessage.innerHTML = `
                        <h3 style="color: #4caf50; margin-top: 0;">Success!</h3>
                        <p>Data files created successfully.</p>
                        <p>Businesses file: ${data.businesses_file.bytes} bytes written</p>
                        <p>Reviews file: ${data.reviews_file.bytes} bytes written</p>
                        <button id="reload-page" style="padding: 8px 15px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">Reload Page</button>
                    `

          document.getElementById("reload-page").addEventListener("click", () => {
            window.location.reload()
          })
        } else {
          statusMessage.innerHTML = `
                        <h3 style="color: #f44336; margin-top: 0;">Error!</h3>
                        <p>Failed to create data files.</p>
                        <pre style="background-color: #f5f5f5; padding: 10px; overflow: auto; max-height: 200px;">${JSON.stringify(data, null, 2)}</pre>
                        <button id="close-message" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                    `

          document.getElementById("close-message").addEventListener("click", () => {
            document.body.removeChild(statusMessage)
          })
        }
      })
      .catch((error) => {
        console.error("Error creating data:", error)
        statusMessage.innerHTML = `
                    <h3 style="color: #f44336; margin-top: 0;">Error!</h3>
                    <p>Failed to create data files.</p>
                    <p>Error: ${error.message}</p>
                    <button id="close-message" style="padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                `

        document.getElementById("close-message").addEventListener("click", () => {
          document.body.removeChild(statusMessage)
        })
      })
  })
})
