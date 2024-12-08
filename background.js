chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "gradePDF") {
      const { pdfText, prompt } = request;
  
      // Construct the input for the LLM
      const fullPrompt = `${prompt}\n\nPDF Content:\n${pdfText}`;
  
      // Call Hugging Face Inference API
      // Replace YOUR_HUGGING_FACE_API_TOKEN and YOUR_MODEL_ENDPOINT
      const HF_API_TOKEN = " < ADD YOUR API TOKEN  >"; 
      const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/< YOUR MODEL >";
  
      fetch(MODEL_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: fullPrompt
        })
      }).then(res => res.json())
        .then(data => {
          // data may vary depending on model, adjust as needed
          const responseText = (typeof data === "object" && data[0] && data[0].generated_text) ? data[0].generated_text : JSON.stringify(data);
          sendResponse({modelResponse: responseText});
        })
        .catch(err => {
          console.error(err);
          sendResponse({modelResponse: "Error calling model."});
        });
  
      // Return true to keep sendResponse callback open
      return true; 
    }
  });
  