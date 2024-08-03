import { fetchNotes, createNote, deleteNote } from "../data/api.js";
import Swal from "sweetalert2";

class NotesComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
    this.createNotesContainer();
  }

  async connectedCallback() {
    await this.loadNotes();
    this.setupFormListener();
  }

  createNotesContainer() {
    const notesContainer = document.createElement("div");
    notesContainer.id = "notes-container";
    this.shadowRoot.appendChild(notesContainer);
  }

  async loadNotes() {
    try {
      const response = await fetchNotes();
      this.notes = response.data;
      this.filteredNotes = this.notes;
      this.tampilkanCatatan();
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }

  async addNote(title, body) {
    try {
      const response = await createNote(title, body);
      const newNote = response.data;
      this.notes.push(newNote);
      this.filteredNotes = this.notes;
      this.tampilkanCatatan();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  async deleteNoteById(noteId) {
    try {
      await deleteNote(noteId);
      this.notes = this.notes.filter((note) => note.id !== noteId);
      this.filteredNotes = this.notes;
      this.tampilkanCatatan();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  renderNoteElement(note) {
    const notesContainer = this.shadowRoot.getElementById("notes-container");
    const noteElement = document.createElement("div");

    noteElement.innerHTML = `
      <div class="note-content">
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <p>Created at: ${note.createdAt}</p>
        <button class="delete-btn" data-id="${note.id}">Delete</button>
      </div>
    `;

    noteElement
      .querySelector(".delete-btn")
      .addEventListener("click", (event) => {
        const noteId = event.target.getAttribute("data-id");
        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        this.deleteNoteById(noteId);
      });

    notesContainer.appendChild(noteElement);
  }

  tampilkanCatatan() {
    const notesContainer = this.shadowRoot.getElementById("notes-container");
    notesContainer.innerHTML = "";
    this.filteredNotes.forEach((note) => this.renderNoteElement(note));
    const style = document.createElement("style");
    style.textContent = `
      #notes-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 20px;
        padding: 20px;
      }
      
      .note-content {
        display: grid;
        grid-template-rows: auto 1fr auto auto auto;
        gap: 10px;
        background-color: #121212;
        color: rgb(206, 199, 247);
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        box-sizing: border-box;
        position: relative;
      }

      .note-content h2 {
        grid-row: 1;
      }

      .note-content p {
        grid-row: span 1;
      }

      .delete-btn {
        grid-row: 5;
        width:100%;
        background-color: #f44336;
        color: white;
        border: none;
        padding: 10px 10px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        margin-top: 10px;
      }

      @media screen and (max-width: 768px) {
        #notes-container {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }

      @media screen and (max-width: 480px) {
        #notes-container {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  setupFormListener() {
    document.addEventListener("newNoteAdded", (event) => {
      const { title, body } = event.detail;
      this.addNote(title, body);
    });
  }
}

customElements.define("notes-component", NotesComponent);
