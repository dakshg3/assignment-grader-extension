document.addEventListener('DOMContentLoaded', async () => {
    const promptEl = document.getElementById('prompt');
    const saveBtn = document.getElementById('savePrompt');
    const gradeBtn = document.getElementById('gradePDF');
    const resultEl = document.getElementById('result');
  
    // Load saved prompt
    chrome.storage.sync.get(['gradingPrompt'], (data) => {
      if (data.gradingPrompt) {
        promptEl.value = data.gradingPrompt;
      }
    });
  
    // Save the prompt
    saveBtn.addEventListener('click', () => {
      const prompt = promptEl.value.trim();
      chrome.storage.sync.set({ gradingPrompt: prompt }, () => {
        resultEl.textContent = "Prompt saved!";
      });
    });
  
    // Trigger grading
    gradeBtn.addEventListener('click', async () => {
      resultEl.textContent = "Extracting PDF text... please wait.";
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      // Send message to content script to extract PDF text
      chrome.tabs.sendMessage(tab.id, {action: "extractPDFText"}, (response) => {
        if (chrome.runtime.lastError) {
          resultEl.textContent = "Error: Unable to communicate with content script.";
          return;
        }
  
        if (response && response.pdfText) {
          // Calculate word count
          const wordCount = response.pdfText.trim().split(/\s+/).length;
          resultEl.textContent = `Extracted ${wordCount} words.\nGrading the PDF... please wait.`;
          
          // We have extracted PDF text, now send to background to call API
          chrome.storage.sync.get(['gradingPrompt'], async (data) => {
            // const gradingPrompt = 
            //   "Given the PDF text, evaluate if it satisfies requirements based upon the given requirements. " +
            //   "If yes, respond with 'Satisfactory: yes'. Otherwise, 'Satisfactory: no'. " +
            //   "Requirements are as follows:\n\n" + 
            //   data.gradingPrompt + 
            //   "\n\nEvaluate if it satisfies requirements. If yes, just respond with 'Satisfactory: yes'. Otherwise, just 'Satisfactory: no'. Don't provide any additional feedback. EVALUATE IT PLEASE";
  
            const gradingPrompt = data.gradingPrompt;
            
            console.log("Prompt:", gradingPrompt);
            chrome.runtime.sendMessage({
              action: "gradePDF",
              pdfText: response.pdfText,
              prompt: gradingPrompt
            }, (res) => {
              if (chrome.runtime.lastError) {
                resultEl.textContent = "Error: Failed to get response from the model.";
                return;
              }
  
              if (res && res.modelResponse) {
                resultEl.textContent = `Grading Result:\n${res.modelResponse}`;
              } else {
                resultEl.textContent = "No response received from model.";
              }
            });
          });
        } else {
          resultEl.textContent = "No PDF text was extracted.";
        }
      });
    });
  });
  