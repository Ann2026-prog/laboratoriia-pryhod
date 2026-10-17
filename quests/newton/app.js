(function (root) {
  'use strict';
  function createQuestApp(doc, storage, Q) {
    const { missions, STORAGE_KEY } = Q;
    let state = Q.freshState(), storageWorks = true, selected = null;
    try { state = Q.normalizeState(JSON.parse(storage.getItem(STORAGE_KEY))); } catch (_) { storageWorks = false; }
    const main = doc.getElementById('main');
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const save = () => { try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { storageWorks = false; } updateStorageNote(); };
    function updateStorageNote() { doc.getElementById('storage-note').textContent = storageWorks ? 'Прогрес зберігається у цьому браузері.' : 'Прогрес доступний у цій вкладці; збереження у браузері вимкнено.'; }
    function announce(message) { doc.getElementById('announcement').textContent = message; }
    function focusMain() { main.focus({ preventScroll: true }); if (typeof main.scrollIntoView === 'function') main.scrollIntoView({ behavior: 'instant', block: 'start' }); }
    const astronaut = `<svg class="astronaut-art" viewBox="0 0 250 310" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M37 124C16 165 27 212 72 224" stroke="#88dcec" stroke-width="9" stroke-linecap="round"/><rect x="71" y="132" width="116" height="114" rx="24" fill="#7395b0"/><path d="m65 153-30 32c-12 13 1 33 17 23l36-27M180 146l31-26c15-12 28 4 17 18l-30 43" fill="#eff4fa" stroke="#b1c8dc" stroke-width="5"/><path d="m92 227-12 49c-3 15 20 23 25 8l21-49m25-8 12 47c4 15 26 10 24-6l-6-49" fill="#e6eef8" stroke="#b1c8dc" stroke-width="5"/><rect x="82" y="130" width="105" height="116" rx="30" fill="#e6eef8"/><path d="M83 193h102" stroke="#7395b0" stroke-width="10"/><rect x="107" y="164" width="53" height="40" rx="9" fill="#29455e"/><rect x="116" y="174" width="21" height="10" rx="4" fill="#8ce2f2"/><circle cx="149" cy="180" r="4" fill="#ffd078"/><path d="M117 191h28" stroke="#7598b4" stroke-width="4" stroke-linecap="round"/><ellipse cx="133" cy="96" rx="62" ry="60" fill="#eff4fa" stroke="#b1c8dc" stroke-width="5"/><rect x="85" y="60" width="96" height="72" rx="31" fill="#203953"/><path d="M99 80c9-11 19-14 34-14" stroke="#7db1d0" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="98" r="5" fill="#ffd078"/><circle cx="153" cy="98" r="5" fill="#ffd078"/><path d="M123 112c8 7 17 7 25 0" stroke="#ffd078" stroke-width="4" stroke-linecap="round"/><path d="m109 142 24 10 24-10" stroke="#b1c8dc" stroke-width="5"/><path d="M85 277h19m64-2h18" stroke="#7395b0" stroke-width="10" stroke-linecap="round"/><circle cx="46" cy="191" r="8" fill="#ffd078"/><circle cx="215" cy="126" r="8" fill="#ffd078"/></svg>`;
    function missionArt(icon) {
      const shapes = {
        shuttle: '<path d="m20 53 13-33 31-9-9 31-33 13z" fill="#dae8f4"/><path d="m32 25-12 1-8 16 15-1m25 1-1 14-16 9 1-16" fill="#ffd078"/><circle cx="47" cy="28" r="8" fill="#203953" stroke="#8ce2f2" stroke-width="3"/><path d="m24 53-12 9m14-3-5 11" stroke="#ffd078" stroke-width="4"/>',
        backpack: '<path d="M27 24v-4c0-14 25-14 25 0v4" stroke="#8ce2f2" stroke-width="5"/><rect x="18" y="23" width="44" height="43" rx="11" fill="#e4edf5"/><rect x="25" y="44" width="30" height="15" rx="4" fill="#ffd078"/><path d="M35 30h10" stroke="#29455e" stroke-width="4"/><path d="M63 37h10m-5-5 5 5-5 5" stroke="#8ce2f2" stroke-width="3"/>',
        cargo: '<rect x="15" y="45" width="49" height="9" rx="4" fill="#8ce2f2"/><circle cx="23" cy="60" r="6" fill="#dceaf4"/><circle cx="56" cy="60" r="6" fill="#dceaf4"/><rect x="23" y="20" width="31" height="25" rx="4" fill="#ffd078"/><path d="M38 20v25" stroke="#ac7834" stroke-width="3"/><path d="M57 28h15m-5-5 5 5-5 5" stroke="#8ce2f2" stroke-width="3"/>',
        cart: '<path d="M12 29h9l6 25h34l7-19H24" stroke="#dceaf4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="64" r="5" fill="#8ce2f2"/><circle cx="57" cy="64" r="5" fill="#8ce2f2"/><rect x="35" y="20" width="22" height="17" rx="3" fill="#ffd078"/><path d="M62 19h11m-5-5 5 5-5 5" stroke="#8ce2f2" stroke-width="3"/>',
        rover: '<circle cx="21" cy="59" r="9" fill="#21394f" stroke="#8ce2f2" stroke-width="4"/><circle cx="59" cy="59" r="9" fill="#21394f" stroke="#8ce2f2" stroke-width="4"/><rect x="17" y="35" width="46" height="21" rx="5" fill="#dceaf4"/><path d="M32 35V21h19v14" fill="#ffd078"/><path d="M44 21V11l12 4" stroke="#8ce2f2" stroke-width="3"/><circle cx="56" cy="15" r="4" fill="#ffd078"/><path d="M24 43h14" stroke="#29455e" stroke-width="3"/>',
        robot: '<rect x="21" y="15" width="38" height="26" rx="8" fill="#dceaf4"/><path d="M40 15V7" stroke="#8ce2f2" stroke-width="3"/><circle cx="40" cy="7" r="3" fill="#ffd078"/><circle cx="31" cy="27" r="4" fill="#29455e"/><circle cx="49" cy="27" r="4" fill="#29455e"/><rect x="25" y="44" width="30" height="19" rx="5" fill="#ffd078"/><path d="M18 48v10m44-10v10M31 63v9m18-9v9" stroke="#8ce2f2" stroke-width="5" stroke-linecap="round"/>',
        sled: '<path d="M14 61h48c7 0 11-5 11-12M20 39h41l-5 12H26z" stroke="#dceaf4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="27" y="22" width="26" height="19" rx="3" fill="#ffd078"/><path d="M59 29h16m-5-5 5 5-5 5M20 23H6m5-5-5 5 5 5" stroke="#8ce2f2" stroke-width="3"/>',
        astronaut: '<path d="M63 10v60" stroke="#8ce2f2" stroke-width="5"/><circle cx="32" cy="24" r="13" fill="#dceaf4"/><rect x="22" y="18" width="20" height="12" rx="6" fill="#29455e"/><rect x="23" y="39" width="20" height="21" rx="6" fill="#dceaf4"/><path d="m41 41 20-11M25 59l-9 12m21-12 9 12" stroke="#ffd078" stroke-width="7" stroke-linecap="round"/>',
        skaters: '<circle cx="23" cy="19" r="7" fill="#dceaf4"/><circle cx="57" cy="19" r="7" fill="#dceaf4"/><path d="M23 30v23m34-23v23M23 36l17 8 17-8M23 53 13 67m10-14 7 14m27-14-7 14m7-14 10 14" stroke="#8ce2f2" stroke-width="5" stroke-linecap="round"/><path d="M7 71h28m11 0h27" stroke="#ffd078" stroke-width="3"/>',
        rescue: '<rect x="16" y="27" width="42" height="28" rx="5" fill="#dceaf4"/><circle cx="24" cy="62" r="6" fill="#8ce2f2"/><circle cx="50" cy="62" r="6" fill="#8ce2f2"/><path d="M37 34v14m-7-7h14" stroke="#d47c5a" stroke-width="5"/><path d="M58 36h17m-5-5 5 5-5 5" stroke="#ffd078" stroke-width="3"/><path d="M15 22 8 18m27 4v-9m20 9 7-4" stroke="#ffd078" stroke-width="3"/>'
      };
      return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shapes[icon] || shapes.shuttle}</svg>`;
    }
    function renderWelcome() {
      main.innerHTML = `<section class="welcome"><div><span class="eyebrow">НАВЧАЛЬНИЙ RPG-КВЕСТ</span><h1>Закони Ньютона.<br><em>Твоя місія —<br>зрушити світ.</em></h1><p class="intro muted">Приєднайся до космічної експедиції. Допоможи команді запустити марсохід, доставити вантаж і дістатися станції «Надія».</p><div class="intro-stats"><div><b>10</b><span>практичних місій</span></div><div><b>1 000 XP</b><span>балів досвіду</span></div><div><b>3 закони</b><span>у реальних ситуаціях</span></div></div><button class="primary-button" data-action="start">Розпочати експедицію <span aria-hidden="true">→</span></button><p class="small muted" style="margin:15px 0 0">Без таймера. У власному темпі. З правом на помилку.</p></div><div class="welcome-visual"><span class="spark one" aria-hidden="true">✦</span><span class="spark two" aria-hidden="true">✧</span><span class="planet" aria-hidden="true"></span>${astronaut}<div class="orbit-label"><span>ЕКІПАЖ «ОРБІТА»</span><b>● ГОТОВІ ДО СТАРТУ</b></div></div><div class="welcome-bottom"><div class="feature"><span aria-hidden="true">◎</span><div><h3>Думай як дослідник</h3><p>Практичні ситуації замість сухих визначень.</p></div></div><div class="feature"><span aria-hidden="true">✦</span><div><h3>Заробляй досвід</h3><p>За кожну завершену місію — 100 XP.</p></div></div><div class="feature"><span aria-hidden="true">?</span><div><h3>Підказка завжди поруч</h3><p>Помилки й підказки не зменшують бали.</p></div></div></div></section>`;
    }
    function sidebar() {
      return `<aside class="sidebar" aria-label="Карта експедиції"><div class="profile"><div class="avatar" aria-hidden="true">✧</div><div><b>${Q.rank(state)}</b><span>Екіпаж «Орбіта»</span></div></div><div class="progress-label"><span>Експедицію пройдено</span><b>${state.completed.length} / 10</b></div><div class="progress-track" role="progressbar" aria-label="Завершені місії" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${state.completed.length}"><i style="width:${state.completed.length * 10}%"></i></div><span class="eyebrow map-label">КАРТА ЕКСПЕДИЦІЇ</span><nav class="mission-nav" aria-label="Місії">${missions.map((m,i) => `<button class="map-item ${state.completed.includes(i) ? 'done' : ''} ${state.active === i ? 'active' : ''}" data-action="mission" data-index="${i}" ${i > state.completed.length ? 'disabled' : ''} ${state.active === i ? 'aria-current="step"' : ''} aria-label="Місія ${i+1}: ${escape(m.title)}${state.completed.includes(i) ? ', завершена' : i > state.completed.length ? ', ще не відкрита' : ''}"><span class="map-number">${state.completed.includes(i) ? '✓' : i+1}</span><span class="map-name">${escape(m.title)}</span></button>`).join('')}</nav><p class="sidebar-note">Відкривай наступну місію після правильної відповіді. До завершених можна повернутися будь-коли.</p></aside>`;
    }
    function feedbackSuccess(m) { return `<div class="feedback" id="feedback"><b>✓ Місію виконано!</b><p>${escape(m.explanation)}</p></div><div class="next-row"><span class="earned">✦ 100 XP за цю місію</span><button id="next-button" class="primary-button" data-action="next">${state.active === 9 ? 'Завершити експедицію' : 'Наступна місія'} <span aria-hidden="true">→</span></button></div>`; }
    function renderQuest() {
      const i = state.active, m = missions[i], done = state.completed.includes(i), saved = state.answers[i];
      selected = m.type === 'choice' && Number.isInteger(saved) ? saved : null;
      const answerHTML = m.type === 'choice'
        ? `<fieldset class="choices"><legend class="sr-only">Оберіть одну відповідь</legend>${m.choices.map((c,j) => `<label class="choice"><input type="radio" name="answer" value="${j}" ${selected === j ? 'checked' : ''} ${done ? 'disabled' : ''}><span class="choice-letter">${['А','Б','В','Г'][j]}</span><span>${escape(c)}</span></label>`).join('')}</fieldset>`
        : `<div class="answer-fields">${m.fields.map((f,j) => `<div class="answer-field"><label for="answer-${j}">${escape(f.label)}</label><div class="input-wrap ${done ? 'correct' : ''}" id="wrap-${j}"><input id="answer-${j}" data-answer="${j}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" maxlength="24" placeholder="Твоя відповідь" aria-describedby="answer-note" value="${escape(Array.isArray(saved) ? saved[j] : '')}" ${done ? 'readonly' : ''}><span>${escape(f.unit)}</span></div></div>`).join('')}</div><p class="input-note" id="answer-note">Вводь лише число. Кома та крапка підходять для десяткових дробів.</p>`;
      main.innerHTML = `<section class="quest-shell"><div class="page-heading"><div><span class="eyebrow">ЕКСПЕДИЦІЯ «ОРБІТА»</span><h1>Закони Ньютона</h1></div><div class="xp-badge">✦ ${Q.xp(state)} XP<small>ІЗ 1 000 МОЖЛИВИХ</small></div></div><div class="quest-layout">${sidebar()}<article class="mission-card"><div class="mission-top"><div class="mission-art">${missionArt(m.icon)}</div><div><span class="eyebrow">МІСІЯ ${String(i+1).padStart(2,'0')} / 10</span><h2>${escape(m.title)}</h2><p class="mission-location">${escape(m.place)}</p></div></div><div class="mission-body"><div class="mission-tags"><span class="tag">${m.law ? ['','I закон','II закон','III закон'][m.law] : 'II + III закони'}</span><span class="tag">${escape(m.tag)}</span><span class="tag gold">✦ 100 XP</span></div><p class="story">${escape(m.story)}</p><p class="question" id="question">${escape(m.question)}</p><form id="answer-form" aria-labelledby="question" novalidate>${answerHTML}<div class="button-row">${!done ? '<button type="submit" class="primary-button" id="check-button">Перевірити відповідь <span aria-hidden="true">→</span></button>' : ''}<button type="button" class="hint-toggle" data-action="hint" aria-expanded="${state.hinted.includes(i)}" aria-controls="hint-panel">✧ ${state.hinted.includes(i) ? 'Сховати підказку' : 'Підказка'}</button></div></form><div id="hint-panel" ${state.hinted.includes(i) ? '' : 'hidden'} class="hint-panel"><b>Навігатор підказує</b>${escape(m.hint)}</div><div id="feedback-area">${done ? feedbackSuccess(m) : ''}</div><p class="mission-foot"><span aria-hidden="true">✦</span> Без штрафів за помилки. За правильну відповідь бали нараховуються один раз.</p>${state.completed.length === 10 ? '<button class="quiet-button" style="margin-top:18px" data-action="results">До підсумку експедиції</button>' : ''}</div></article></div></section>`;
    }
    function renderResults() {
      main.innerHTML = `<section class="results"><div class="result-hero"><div class="medal" aria-hidden="true">✦</div><span class="eyebrow">ЕКСПЕДИЦІЮ ЗАВЕРШЕНО</span><h1>Ти — майстер механіки!</h1><p class="muted">Станцію «Надія» врятовано. Ти застосував закони Ньютона до руху, розгону та взаємодії тіл.</p><div class="result-stats"><div><b>10 / 10</b><span>місій виконано</span></div><div><b>1 000 XP</b><span>балів досвіду</span></div><div><b>${state.hinted.length}</b><span>місій із підказкою</span></div></div><div class="button-row" style="justify-content:center"><button class="primary-button" data-action="reset">Нова експедиція ↺</button><button class="quiet-button" data-action="theory">Повторити закони</button></div></div><h2 class="review-title">Твій маршрут · повернися до будь-якої місії</h2><div class="review-list">${missions.map((m,i) => `<button class="review-item" data-action="mission" data-index="${i}"><span aria-hidden="true">✓</span><div><b>${String(i+1).padStart(2,'0')}. ${escape(m.title)}</b><small>${escape(m.place)} · 100 XP</small></div></button>`).join('')}</div></section>`;
    }
    function render() { if (!state.started) renderWelcome(); else if (state.finished) renderResults(); else renderQuest(); updateStorageNote(); }
    function showDialog(id) { const dialog = doc.getElementById(id); if (!dialog.open) dialog.showModal(); }
    function closeDialog(id) { doc.getElementById(id).close(); }
    function currentValues() {
      if (missions[state.active].type === 'choice') return selected;
      return Array.from(doc.querySelectorAll('input[data-answer]')).map(input => input.value);
    }
    doc.addEventListener('change', event => {
      if (event.target.name === 'answer' && !state.completed.includes(state.active)) { selected = Number(event.target.value); state.answers[state.active] = selected; save(); }
    });
    doc.addEventListener('input', event => {
      if (event.target.dataset && 'answer' in event.target.dataset && !state.completed.includes(state.active)) {
        state.answers[state.active] = currentValues(); save();
        const wrap = doc.getElementById(`wrap-${event.target.dataset.answer}`); if (wrap) wrap.classList.remove('incorrect');
        event.target.removeAttribute('aria-invalid');
      }
    });
    doc.addEventListener('submit', event => {
      if (event.target.id !== 'answer-form') return;
      event.preventDefault();
      const i = state.active, m = missions[i];
      if (state.completed.includes(i)) return;
      const values = currentValues(), result = Q.checkAnswer(m, values);
      if (result.correct) {
        Q.award(state, i, values); save(); render(); announce(`Місію ${i+1} виконано. Додано 100 балів досвіду. Загалом ${Q.xp(state)} XP.`);
        doc.getElementById('next-button').focus();
      } else {
        if (result.valid) state.mistakes[i] = (Number(state.mistakes[i]) || 0) + 1;
        save();
        const detail = !result.valid ? result.message : m.fields && m.fields.length > 1 ? 'Перевір обидві величини. Для прискорення потрібна рівнодійна, а для сили на трос — сила взаємодії.' : 'Перевір міркування або обчислення. Підказка та пам’ятка допоможуть обрати наступний крок.';
        doc.getElementById('feedback-area').innerHTML = `<div class="feedback error" id="feedback" role="alert"><b>${result.valid ? 'Ще один крок до відповіді' : 'Спочатку заповни відповідь'}</b><p>${escape(detail)} Бали не зменшено.</p></div>`;
        if (m.type === 'number') Array.from(doc.querySelectorAll('input[data-answer]')).forEach((input,j) => {
          const ok = result.fieldResults?.[j] === true;
          doc.getElementById(`wrap-${j}`).classList.toggle('incorrect', !ok);
          input.setAttribute('aria-invalid', String(!ok));
        });
      }
    });
    doc.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button || button.disabled) return;
      const action = button.dataset.action;
      if (action === 'start') { state.started = true; save(); render(); focusMain(); }
      if (action === 'theory') showDialog('theory-dialog');
      if (action === 'close-theory') closeDialog('theory-dialog');
      if (action === 'reset') showDialog('reset-dialog');
      if (action === 'cancel-reset') closeDialog('reset-dialog');
      if (action === 'confirm-reset') { closeDialog('reset-dialog'); state = Q.freshState(); save(); render(); focusMain(); announce('Розпочни нову експедицію.'); }
      if (action === 'mission') {
        const index = Number(button.dataset.index);
        if (Number.isInteger(index) && index >= 0 && index < missions.length && index <= state.completed.length) { state.active = index; state.finished = false; save(); render(); focusMain(); }
      }
      if (action === 'hint' && state.started && !state.finished) {
        const panel = doc.getElementById('hint-panel'); panel.hidden = !panel.hidden;
        button.setAttribute('aria-expanded', String(!panel.hidden)); button.textContent = panel.hidden ? '✧ Підказка' : '✧ Сховати підказку';
        if (!panel.hidden && !state.hinted.includes(state.active)) { state.hinted.push(state.active); save(); }
      }
      if (action === 'next' && state.completed.includes(state.active)) {
        if (state.active === 9) state.finished = true; else state.active++;
        save(); render(); focusMain();
      }
      if (action === 'results' && state.completed.length === 10) { state.finished = true; save(); render(); focusMain(); }
    });
    render();
    return { getState: () => JSON.parse(JSON.stringify(state)) };
  }
  if (typeof module === 'object' && module.exports) module.exports = createQuestApp;
  else {
    let storage;
    try { storage = root.localStorage; } catch (_) { storage = { getItem: () => { throw new Error('Storage unavailable'); }, setItem: () => { throw new Error('Storage unavailable'); } }; }
    createQuestApp(root.document, storage, root.NewtonQuest);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
