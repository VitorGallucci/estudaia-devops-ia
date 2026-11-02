import { askQuestion } from './api.js';

export function mountApp(root, {
  ask = askQuestion,
  clipboard = globalThis.navigator.clipboard,
} = {}) {
  const get = (id) => root.querySelector(`#${id}`);
  const form = get('estudo');
  const text = get('texto');
  const question = get('pergunta');
  const send = get('enviar');
  const summary = get('resumir');
  const clear = get('limpar');
  const copy = get('copiar');
  const answer = get('resposta');
  const errorBox = get('erro');
  const status = get('status');
  const empty = get('empty-state');
  const loading = get('loading-state');
  const wrapper = get('answer-wrapper');
  const outputPanel = root.querySelector('.output-panel');
  const examples = [...root.querySelectorAll('[data-question]')];
  const controls = [text, question, send, summary, clear, ...examples];
  let busy = false;

  function updateCounts() {
    get('texto-contador').textContent = `${text.value.length.toLocaleString('pt-BR')} / 12.000`;
    get('pergunta-contador').textContent = `${question.value.length.toLocaleString('pt-BR')} / 1.000`;
  }

  for (const field of [text, question]) {
    field.addEventListener('input', () => {
      field.setCustomValidity('');
      updateCounts();
    });
  }

  summary.addEventListener('click', () => {
    if (busy) return;
    if (!text.value.trim()) {
      text.setCustomValidity('Cole um texto antes de pedir um resumo.');
      text.reportValidity();
      text.focus();
      return;
    }
    text.setCustomValidity('');
    question.setCustomValidity('');
    question.value = 'Resuma este texto em tópicos, destacando as ideias principais.';
    updateCounts();
    question.focus();
  });

  for (const example of examples) {
    example.addEventListener('click', () => {
      if (busy) return;
      question.value = example.dataset.question;
      question.setCustomValidity('');
      updateCounts();
      question.focus();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    question.setCustomValidity(!question.value.trim() ? 'Digite uma pergunta.'
      : question.value.length > 1000 ? 'A pergunta deve ter até 1.000 caracteres.' : '');
    text.setCustomValidity(text.value.length > 12000 ? 'O texto deve ter até 12.000 caracteres.' : '');
    if (!form.reportValidity()) return;

    const input = { pergunta: question.value.trim(), texto: text.value.trim() };
    busy = true;
    controls.forEach((control) => { control.disabled = true; });
    copy.disabled = true;
    outputPanel.setAttribute('aria-busy', 'true');
    send.textContent = 'Enviando…';
    empty.hidden = true;
    wrapper.hidden = true;
    errorBox.hidden = true;
    errorBox.textContent = '';
    answer.textContent = '';
    loading.hidden = false;
    status.textContent = 'Pergunta enviada. Preparando sua resposta.';

    try {
      const result = await ask(input);
      // Conteúdo da IA nunca é interpretado como HTML.
      answer.textContent = result;
      wrapper.hidden = false;
      status.textContent = 'Resposta recebida. Revise com seu material de estudo.';
      answer.focus();
    } catch (error) {
      errorBox.textContent = error instanceof Error ? error.message : 'Não foi possível obter uma resposta. Tente novamente.';
      errorBox.hidden = false;
      status.textContent = '';
    } finally {
      busy = false;
      controls.forEach((control) => { control.disabled = false; });
      copy.disabled = !answer.textContent;
      loading.hidden = true;
      outputPanel.setAttribute('aria-busy', 'false');
      send.textContent = 'Enviar pergunta ↗';
    }
  });

  clear.addEventListener('click', () => {
    if (busy) return;
    form.reset();
    text.setCustomValidity('');
    question.setCustomValidity('');
    answer.textContent = '';
    errorBox.textContent = '';
    errorBox.hidden = true;
    wrapper.hidden = true;
    empty.hidden = false;
    copy.disabled = true;
    status.textContent = 'Campos limpos. Pronto para uma nova pergunta.';
    updateCounts();
    text.focus();
  });

  copy.addEventListener('click', async () => {
    if (!answer.textContent || busy) return;
    try {
      await clipboard.writeText(answer.textContent);
      status.textContent = 'Resposta copiada!';
    } catch {
      status.textContent = 'Não foi possível copiar automaticamente. Selecione a resposta e copie pelo teclado.';
    }
  });

  updateCounts();
}
