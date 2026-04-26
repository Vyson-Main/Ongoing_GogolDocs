// ── State ──────────────────────────────────────────────────────────────────
let notes = [];
let activeId = null;
let dirty = false;

const STORAGE_KEY = 'notes-app-data';

// ── Persistence ────────────────────────────────────────────────────────────

/**
 * Load notes from localStorage (simulates reading from the notes/ folder).
 * In a server-backed version, replace this with a fetch() to /notes/*.json.
 */
function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    notes = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load notes:', e);
    notes = [];
  }
}

/**
 * Persist all notes to localStorage.
 * Each note maps to what would be a file in the notes/ folder:
 *   notes/<id>.json  →  { id, title, content, created, updated }
 */
function persistNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes:', e);
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fmt(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// ── Toast ──────────────────────────────────────────────────────────────────

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = type === 'danger' ? 'var(--danger-light)' : 'var(--accent-light)';
  t.style.color      = type === 'danger' ? 'var(--danger)'       : 'var(--accent)';
  t.style.borderColor= type === 'danger' ? 'var(--danger)'       : 'var(--accent-mid)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Sidebar ────────────────────────────────────────────────────────────────

function renderList() {
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  if (!notes.length) {
    list.innerHTML = '<div style="font-family:\'DM Mono\',monospace;font-size:11px;color:var(--muted);text-align:center;padding:24px 8px;">No notes yet</div>';
    return;
  }

  notes
    .slice()
    .sort((a, b) => b.updated - a.updated)
    .forEach(n => {
      const item = document.createElement('div');
      item.className = 'note-item' + (n.id === activeId ? ' active' : '');
      item.innerHTML = `
        <button class="note-item-del" title="Delete" onclick="deleteNote(event,'${n.id}')">×</button>
        <div class="note-item-title">${escapeHtml(n.title || 'Untitled')}</div>
        <div class="note-item-preview">${escapeHtml(n.content || 'No content')}</div>
        <div class="note-item-date">${fmt(n.updated)}</div>
      `;
      item.onclick = (e) => {
        if (!e.target.classList.contains('note-item-del')) openNote(n.id);
      };
      list.appendChild(item);
    });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Editor ─────────────────────────────────────────────────────────────────

function openNote(id) {
  if (dirty && activeId) {
    if (!confirm('You have unsaved changes. Discard them?')) return;
  }
  activeId = id;
  dirty = false;

  const n = notes.find(x => x.id === id);
  document.getElementById('emptyState').style.display = 'none';
  const ed = document.getElementById('noteEditor');
  ed.style.display = 'flex';

  const ti = document.getElementById('titleInput');
  ti.value = n.title || '';
  autoResize(ti);

  document.getElementById('contentInput').value = n.content || '';
  updateMeta();
  renderList();
}

function newNote() {
  if (dirty && activeId) {
    if (!confirm('You have unsaved changes. Discard them?')) return;
  }

  const n = {
    id: uid(),
    title: '',
    content: '',
    created: Date.now(),
    updated: Date.now()
  };

  notes.unshift(n);
  activeId = n.id;
  dirty = true;
  renderList();

  document.getElementById('emptyState').style.display = 'none';
  const ed = document.getElementById('noteEditor');
  ed.style.display = 'flex';

  const ti = document.getElementById('titleInput');
  ti.value = '';
  autoResize(ti);

  document.getElementById('contentInput').value = '';
  updateMeta();
  ti.focus();
}

function saveNote() {
  const title   = document.getElementById('titleInput').value.trim();
  const content = document.getElementById('contentInput').value.trim();

  if (!title && !content) {
    showToast('Add a title or some content first', 'danger');
    return;
  }

  const n = notes.find(x => x.id === activeId);
  if (!n) return;

  n.title   = title || 'Untitled';
  n.content = content;
  n.updated = Date.now();

  persistNotes(); // write to notes/ folder equivalent
  dirty = false;
  renderList();
  updateMeta();
  showToast('Note saved!');
}

function deleteNote(e, id) {
  e.stopPropagation();
  if (!confirm('Delete this note? This cannot be undone.')) return;

  notes = notes.filter(x => x.id !== id);
  persistNotes();

  if (activeId === id) {
    activeId = null;
    dirty = false;
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('noteEditor').style.display = 'none';
  }

  renderList();
  showToast('Note deleted', 'danger');
}

// ── Meta bar ───────────────────────────────────────────────────────────────

function markDirty() {
  dirty = true;
  updateMeta();
}

function updateMeta() {
  const content = document.getElementById('contentInput').value;
  const words   = content.trim() ? content.trim().split(/\s+/).length : 0;

  document.getElementById('metaWords').textContent =
    words + ' word' + (words !== 1 ? 's' : '');
  document.getElementById('charCount').textContent =
    content.length + ' character' + (content.length !== 1 ? 's' : '');

  if (activeId) {
    const n = notes.find(x => x.id === activeId);
    if (n) {
      document.getElementById('metaDate').textContent = 'Last saved ' + fmt(n.updated);
    }
  }
}

// ── Init ───────────────────────────────────────────────────────────────────

loadNotes();
renderList();
