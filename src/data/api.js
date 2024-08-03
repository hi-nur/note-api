const API_URL = "https://notes-api.dicoding.dev/v2";

export async function fetchNotes() {
  const response = await fetch(`${API_URL}/notes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  return await response.json();
}

export async function createNote(title, body) {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });
  if (!response.ok) {
    throw new Error("Failed to create note");
  }
  return await response.json();
}

export async function deleteNote(noteId) {
  const response = await fetch(`${API_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete note");
  }
  return await response.json();
}

export async function archiveNote(noteId) {
  const response = await fetch(`${API_URL}/notes/${noteId}/archive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to archive note");
  }
  return await response.json();
}

export async function unarchiveNote(noteId) {
  const response = await fetch(`${API_URL}/notes/${noteId}/unarchive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to unarchive note");
  }
  return await response.json();
}
