# PDF Grader Chrome Extension

A Chrome extension that extracts the text from an open PDF in your browser, sends it along with a user-defined prompt to a Large Language Model (LLM) hosted on Hugging Face, basically to interact with PDFs files, designed specifically to grade PDF assignment submissions. Works great with Gradescope as well.

**Key Features:**
- **Prompt Customization:** Users can save their own grading requirements directly from the extension’s popup UI.
- **Real-Time PDF Extraction:** Automatically extracts the visible PDF’s text in the current tab.
- **Hugging Face LLM Integration:** Uses Hugging Face Inference API to evaluate the PDF content against the prompt.
- **Word Count Display:** Before grading, shows the number of words extracted from the PDF, in case length of assignment is of interest.

## How It Works

1. **User Sets Prompt:**  
   Open the extension’s popup and enter the grading requirements prompt. For example:  
   *"The submission must have an introduction, at least three supporting arguments, and a conclusion. If it meets the above mentioned requirement, return "Satisfactory: yes" else "Satisfactory: no" verdict*
   
2. **Open a PDF in Chrome:**  
   Navigate to a URL hosting a PDF file or open a local PDF in a new Chrome tab.

3. **Grade the PDF:**  
   Click the "Grade Open PDF" button in the extension’s popup. The extension:
   - Extracts the PDF’s text (using PDF.mjs).
   - Shows the word count of the extracted content.
   - Sends the PDF text and your prompt to the Hugging Face model.
   
4. **View Results:**  
   The extension displays the model’s response in the popup. If the PDF meets the criteria, you’ll see:
   *"Satisfactory: yes"*. Otherwise, you’ll see *"Satisfactory: no"* and an explanation. Based on the prompt.

## Getting Started

### Prerequisites

- **Google Chrome or a Chromium-based browser**
- **Node.js & npm** (optional, for installing `pdfjs-dist` before copying files)

### Setup Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/dakshg3/assignment-grader-extension.git
   cd assignment-grader-extension/
