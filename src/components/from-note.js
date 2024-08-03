import { createNote } from "../data/api.js";
import Swal from "sweetalert2";

class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderForm();
    this.setupFormSubmission();
  }

  renderForm() {
    const form = document.createElement("form");
    form.innerHTML = `
      <label for="title">Judul:</label><br>
      <input type="text" id="title" name="title" required minlength="0" maxlength="10">
      <label for="title">Judul harus terdiri dari 0 hingga 10 karakter</label><br>
      <label for="body">Isi:</label><br>
      <textarea id="description" name="body" rows="4" cols="50" required minlength="0" maxlength="500"></textarea>
      <label for="description">Isi harus terdiri dari 0 hingga 500 karakter</label><br>
      <button type="submit" id="save-btn">Save</button>
      <button type="button" id="back-btn">Back</button>
      <div id="error-message" style="color: red;"></div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      /* Form styling */
      #error-message {
        margin-top: 10px;
        font-size: 14px;
      }
      form {
        max-width: 500px;
        margin: 20px auto;
        padding: 20px;
        background-color: #121212;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-size: 16px;
        color: #fff;
      }

      input[type="text"],
      textarea {
        width: calc(100% - 20px);
        padding: 10px;
        margin-bottom: 15px;
        border: none;
        border-radius: 4px;
        background-color: #fff;
        color: #333;
        font-size: 16px;
      }

      textarea {
        resize: vertical;
        min-height: 100px;
      }

      button[type="submit"] {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        background-color: #03b1fc;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button[type="submit"]:hover {
        background-color: #03b1fc;
      }
      button[type="button"] {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        background-color: #fc3103;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button[type="button"]:hover {
        background-color: #bf2300;
      }

      @media screen and (max-width: 768px) {
        form {
          max-width: 90%;
        }

        input[type="text"],
        textarea {
          width: calc(100% - 20px);
        }

        button[type="submit"] {
          font-size: 14px;
          padding: 8px 16px;
        }
        button[type="button"] {
          font-size: 14px;
          padding: 8px 16px;
        }
      }

      @media screen and (max-width: 480px) {
        input[type="text"],
        textarea {
          font-size: 14px;
        }

        button [type="submit"] {
          font-size: 12px;
          padding: 6px 12px;
        }
        button [type="button"] {
          font-size: 12px;
          padding: 6px 12px;
        }
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(form);
  }

  setupFormSubmission() {
    const form = this.shadowRoot.querySelector("form");
    const errorMessage = this.shadowRoot.getElementById("error-message");
    const titleInput = form.querySelector("#title");
    const bodyInput = form.querySelector("#description");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.checkValidity()) {
        const title = titleInput.value;
        const body = bodyInput.value;
        try {
          const response = await createNote(title, body);
          console.log("Response from API:", response);
          form.reset();
          errorMessage.textContent = "";

          Swal.fire({
            icon: "success",
            title: "Successfully",
            showConfirmButton: false,
            timer: 1500,
          });

          // Dispatch event to notify the notes component
          const eventToAddNote = new CustomEvent("newNoteAdded", {
            detail: { title, body },
          });
          document.dispatchEvent(eventToAddNote);
        } catch (error) {
          errorMessage.textContent = "Gagal membuat catatan. Silakan coba lagi";
        }
      } else {
        errorMessage.textContent = "Harap isi kedua bidang dengan benar.";
      }
    });

    titleInput.addEventListener("input", () => {
      if (!titleInput.validity.valid) {
        titleInput.setCustomValidity(
          "Judul harus terdiri dari 0 hingga 10 karakter"
        );
      } else {
        titleInput.setCustomValidity("");
      }
    });

    bodyInput.addEventListener("input", () => {
      if (!bodyInput.validity.valid) {
        bodyInput.setCustomValidity(
          "Isi harus terdiri dari 0 hingga 500 karakter"
        );
      } else {
        bodyInput.setCustomValidity("");
      }
    });
  }
}

customElements.define("note-form", AddNoteForm);
