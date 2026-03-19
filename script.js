/* ============================================
   Gayathri M — Portfolio Scripts
   script.js
   ============================================ */

/* ── CURSOR ── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;


document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();


/* ── PHOTO UPLOAD ── */
document.getElementById('photoInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('photoImg');
    img.src = e.target.result;
    img.style.display = 'block';
    document.querySelector('#photoBox svg').style.display    = 'none';
    document.querySelector('#photoBox .ph-label').style.display = 'none';
  };
  reader.readAsDataURL(file);
});


/* ── PHOTO RESIZE (drag handle) ── */
const photoWrap    = document.getElementById('photoWrap');
const resizeHandle = document.getElementById('resizeHandle');
let isResizing = false, startX, startY, startW, startH;
const MIN_SIZE = 100, MAX_SIZE = 300;

resizeHandle.addEventListener('mousedown', e => {
  isResizing = true;
  startX = e.clientX; startY = e.clientY;
  startW = photoWrap.offsetWidth;
  startH = photoWrap.offsetHeight;
  e.preventDefault();
  e.stopPropagation();
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', e => {
  if (!isResizing) return;
  const delta = ((e.clientX - startX) + (e.clientY - startY)) / 2;
  const ratio = startH / startW;
  const newW  = Math.min(MAX_SIZE, Math.max(MIN_SIZE, startW + delta));
  photoWrap.style.width  = newW + 'px';
  photoWrap.style.height = (newW * ratio) + 'px';
});

document.addEventListener('mouseup', () => {
  isResizing = false;
  document.body.style.userSelect = '';
});


/* ── EDIT MODE ── */
let editing = false;

function editMode() {
  editing = true;
  document.body.classList.add('edit-mode');
  document.querySelectorAll('[contenteditable]').forEach(el => el.setAttribute('contenteditable', 'true'));
  document.getElementById('btn-edit').style.display      = 'none';
  document.getElementById('btn-save').style.display      = 'inline-flex';
  document.getElementById('btn-add-skill').style.display = 'inline-flex';
  document.getElementById('btn-add-proj').style.display  = 'inline-flex';
  document.getElementById('edit-hint').innerHTML =
    '✎ <strong style="color:#fff">Editing on</strong> — click any text to change it. Use × to remove items.';
}

function saveMode() {
  editing = false;
  document.body.classList.remove('edit-mode');
  document.querySelectorAll('[contenteditable]').forEach(el => el.setAttribute('contenteditable', 'false'));
  document.getElementById('btn-edit').style.display      = 'inline-flex';
  document.getElementById('btn-save').style.display      = 'none';
  document.getElementById('btn-add-skill').style.display = 'none';
  document.getElementById('btn-add-proj').style.display  = 'none';
  document.getElementById('edit-hint').innerHTML =
    'Click <strong style="color:#fff">Edit Content</strong> to modify text, add or remove items';
  renumberCerts();
  renumberProjects();
}


/* ── DELETE ITEM ── */
function delItem(btn) {
  if (!editing) return;
  btn.closest('.deletable').remove();
  renumberCerts();
  renumberProjects();
}


/* ── RENUMBER HELPERS ── */
function renumberCerts() {
  document.querySelectorAll('#certs-list .cert-item .cert-num').forEach((el, i) => {
    el.textContent = String(i + 1).padStart(2, '0');
  });
}

function renumberProjects() {
  document.querySelectorAll('#projects-list .project-item .proj-idx').forEach((el, i) => {
    el.textContent = String(i + 1).padStart(3, '0');
  });
}


/* ── ADD SKILL ── */
function addSkill() {
  const col  = prompt('Which column?\n1 = Data & Analysis\n2 = Tools & Technologies\n3 = Other Skills\n\nEnter 1, 2 or 3:');
  const text = prompt('Skill name:');
  if (!text) return;
  const ids       = ['skill-data', 'skill-tools', 'skill-other'];
  const container = document.getElementById(ids[(parseInt(col) - 1)] || 'skill-other');
  const span      = document.createElement('span');
  span.className  = 'skill-item deletable';
  span.setAttribute('contenteditable', 'true');
  span.innerHTML  = text + '<button class="del-btn" onclick="delItem(this)">×</button>';
  container.appendChild(span);
}


/* ── ADD PROJECT ── */
function addProject() {
  const name = prompt('Project name:');
  if (!name) return;
  const list  = document.getElementById('projects-list');
  const count = list.querySelectorAll('.project-item').length + 1;
  const div   = document.createElement('div');
  div.className = 'project-item reveal visible deletable';
  div.innerHTML = `
    <div class="proj-meta">
      <span class="proj-idx">${String(count).padStart(3, '0')}</span>
      <div class="proj-stack"><span class="stack-tag">New</span></div>
    </div>
    <div class="proj-body">
      <div class="proj-name" contenteditable="true">${name}</div>
      <ul class="proj-bullets">
        <li class="deletable" contenteditable="true">
          Add a bullet point here
          <button class="del-btn" onclick="delItem(this)">×</button>
        </li>
      </ul>
      <span class="proj-learning" contenteditable="true">Key learning here</span>
    </div>
    <span class="proj-arrow">↗</span>
    <button class="del-btn" style="right:-8px;top:2.5rem;" onclick="delItem(this)">×</button>
  `;
  list.appendChild(div);
}


/* ── SCROLL REVEAL ── */
const revEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 55);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

revEls.forEach(el => revObs.observe(el));
