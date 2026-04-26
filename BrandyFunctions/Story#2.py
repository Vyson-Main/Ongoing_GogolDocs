class SecureNote:
    def __init__(self, title, content):
        self.title = title
        self.content = content
        self.password = None
        self.is_locked = False

    # Set password / lock note
    def lock(self, password):
        self.password = password
        self.is_locked = True
        print("Note locked.")

    # Unlock note
    def unlock(self, password):
        if self.password == password:
            self.is_locked = False
            print("Note unlocked.")
        else:
            print("Incorrect password.")

    # View note
    def view(self):
        if self.is_locked:
            print("This note is locked. Cannot view content.")
        else:
            print(f"Title: {self.title}\nContent: {self.content}")


# Example usage
note = SecureNote("Private Note", "This is secret!")

note.lock("1234")      # Lock the note
note.view()            # Cannot view

note.unlock("1234")    # Unlock
note.view()            # Now can view