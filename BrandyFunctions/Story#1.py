class NotesApp:
    def __init__(self):
        self.notes = []

    def add_note(self, title, content):
        self.notes.append({"title": title, "content": content})

    # Search notes
    def search_notes(self, keyword):
        results = []
        for note in self.notes:
            if keyword.lower() in note["title"].lower() or keyword.lower() in note["content"].lower():
                results.append(note)

        if results:
            print("Matching Notes:")
            for note in results:
                print(f"- {note['title']}: {note['content']}")
        else:
            print("No matching notes found.")


# Example usage
app = NotesApp()
app.add_note("Shopping List", "Buy milk and eggs")
app.add_note("Homework", "Finish math assignment")

app.search_notes("milk")