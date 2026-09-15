"use client";

import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField } from "@/components/ui/form";
import { questionLabels, type ExamQuestion } from "./types";

export type QuestionDefaults = {
  type: ExamQuestion["type"];
  points: string;
  equalPoints: boolean;
};

export function QuestionSettings({ value, onChange }: {
  value: QuestionDefaults;
  onChange: (value: QuestionDefaults) => void;
}) {
  return <div className="exam-fields">
    <div className="teacher-form-grid">
      <SelectField label="Jenis soal bawaan" value={value.type} onChange={e => onChange({ ...value, type: e.target.value as ExamQuestion["type"] })}>
        {Object.entries(questionLabels).map(([type, label]) => <option key={type} value={type}>{label}</option>)}
      </SelectField>
      <SelectField label="Pengaturan poin" value={value.equalPoints ? "equal" : "individual"} onChange={e => onChange({ ...value, equalPoints: e.target.value === "equal" })}>
        <option value="equal">Semua soal bernilai sama</option>
        <option value="individual">Atur poin per soal</option>
      </SelectField>
    </div>
    <Field label={value.equalPoints ? "Poin maksimal setiap soal" : "Poin bawaan soal baru"} type="number" min="0.01" max="9999.99" step="0.01" required value={value.points} onChange={e => onChange({ ...value, points: e.target.value })}
      hint={value.equalPoints ? "Berlaku untuk seluruh soal, termasuk soal yang sudah dibuat." : "Soal baru memakai angka ini. Poin setiap soal bisa diubah di editor."} />
    <p className="muted">Jenis bawaan hanya berlaku untuk soal baru. Poin maksimal adalah nilai tertinggi dari satu soal; nilai akhir dijumlahkan dari semua soal, bukan otomatis menjadi 100.</p>
  </div>;
}

function complete(question: ExamQuestion) {
  if (!question.text.trim() || !(question.points > 0) || question.points > 9999.99 || Math.abs(question.points * 100 - Math.round(question.points * 100)) > 0.000001) return false;
  if (question.type === "essay") return true;
  const correct = question.options.filter(option => option.correct).length;
  return question.options.length >= 2 && question.options.every(option => option.text.trim()) && (question.type === "single_choice" ? correct === 1 : correct > 0);
}

export function QuestionComposer({ questions, onChange, defaults, active, onActive, settings }: {
  questions: ExamQuestion[];
  onChange: (questions: ExamQuestion[]) => void;
  defaults: QuestionDefaults;
  active: number;
  onActive: (index: number) => void;
  settings: ReactNode;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const index = Math.min(active, Math.max(0, questions.length - 1));
  const question = questions[index];
  const ready = questions.filter(complete).length;
  const total = questions.reduce((sum, q) => sum + q.points, 0);
  const defaultPoints = Number(defaults.points);
  const validDefault = defaults.points.trim() !== "" && defaultPoints > 0 && defaultPoints <= 9999.99 && Math.abs(defaultPoints * 100 - Math.round(defaultPoints * 100)) < 0.000001;

  function navigate(next: number) {
    onActive(next);
    requestAnimationFrame(() => {
      const target = heading.current;
      if (!target) return;
      target.focus({ preventScroll: true });
      if (target.getBoundingClientRect().top < 70 || target.getBoundingClientRect().top > window.innerHeight - 150) {
        target.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      }
    });
  }
  function add() {
    if (questions.length >= 50 || !validDefault) return;
    onChange([...questions, {
      type: defaults.type, text: "", points: defaultPoints,
      options: defaults.type === "essay" ? [] : Array.from({ length: 4 }, () => ({ text: "", correct: false })),
    }]);
    navigate(questions.length);
  }
  function edit(patch: Partial<ExamQuestion>) {
    onChange(questions.map((q, i) => i === index ? { ...q, ...patch } : q));
  }
  function move(direction: number) {
    const next = index + direction;
    const items = [...questions];
    [items[index], items[next]] = [items[next], items[index]];
    onChange(items);
    navigate(next);
  }
  function remove() {
    onChange(questions.filter((_, i) => i !== index));
    navigate(Math.max(0, Math.min(index, questions.length - 2)));
  }

  return <div className="exam-fields">
    <div className="section-heading"><div><h2>Susun soal</h2><p>{questions.length}/50 soal · {Number(total.toFixed(2))} poin maksimal</p></div></div>
    <details className="exam-composer-settings"><summary>Pengaturan soal · {questionLabels[defaults.type]} · {defaults.equalPoints ? "Poin sama" : "Poin per soal"}</summary>{settings}</details>
    {!validDefault && <p className="form-message error" role="alert">Isi poin bawaan antara 0,01–9999,99, maksimal dua desimal, sebelum menambah soal.</p>}
    {!question ? <div className="exam-empty"><h3>Mulai dari soal pertama</h3><p>Soal baru mengikuti pengaturan jenis dan poin yang sudah Anda pilih.</p><Button variant="primary" onClick={add} disabled={!validDefault}>Tambah soal pertama</Button></div> : <div className="exam-composer-grid">
      <aside className="exam-composer-nav" aria-label="Daftar soal asesmen">
        <h3>Daftar soal</h3><p>{ready} lengkap · {questions.length - ready} belum lengkap</p>
        <div className="exam-numbers">{questions.map((q, i) => <button type="button" key={i} aria-label={`Buka soal ${i + 1}, ${complete(q) ? "lengkap" : "belum lengkap"}`} aria-current={i === index ? "step" : undefined} className={complete(q) ? "answered" : ""} onClick={() => navigate(i)}>{i + 1}</button>)}</div>
        <p className="muted">Biru: lengkap. Garis biru: soal yang dibuka.</p>
        <Button onClick={add} disabled={questions.length >= 50 || !validDefault}>+ Tambah soal</Button>
      </aside>
      <div className="exam-composer-main">
        <article className="exam-question exam-fields" key={index}>
          <div className="section-heading"><h3 ref={heading} tabIndex={-1} className="exam-editor-heading">Soal {index + 1} dari {questions.length}</h3><span className={`badge ${complete(question) ? "" : "neutral"}`}>{complete(question) ? "Lengkap" : "Belum lengkap"}</span></div>
          <div className="teacher-form-grid">
            <SelectField label={`Jenis soal ${index + 1}`} value={question.type} onChange={e => {
              const type = e.target.value as ExamQuestion["type"];
              const options = type === "essay" ? [] : question.type === "essay" ? Array.from({ length: 4 }, () => ({ text: "", correct: false })) : question.options.map((o, i, all) => ({ ...o, correct: type === "single_choice" ? !!o.correct && all.findIndex(v => v.correct) === i : o.correct }));
              edit({ type, options });
            }}>{Object.entries(questionLabels).map(([type, label]) => <option key={type} value={type}>{label}</option>)}</SelectField>
            {defaults.equalPoints ? <div className="exam-points-summary"><span>Poin maksimal soal ini</span><strong>{question.points} poin</strong><small>Mengikuti pengaturan semua soal.</small></div> : <Field label={`Poin maksimal soal ${index + 1}`} type="number" min="0.01" max="9999.99" step="0.01" value={question.points} onChange={e => edit({ points: Number(e.target.value) })} />}
          </div>
          <TextField label={`Pertanyaan ${index + 1}`} rows={4} maxLength={10000} value={question.text} onChange={e => edit({ text: e.target.value })} />
          {question.type !== "essay" && <>
            <p className="muted">{question.type === "single_choice" ? "Tandai satu jawaban yang benar." : "Tandai semua jawaban yang benar. Poin penuh diberikan jika pilihan siswa sama persis dengan kunci."}</p>
            {question.options.map((option, j) => <div className="exam-option-edit" key={j}>
              <input aria-label={`Kunci soal ${index + 1} pilihan ${j + 1}`} type={question.type === "single_choice" ? "radio" : "checkbox"} name={`key-${index}`} checked={!!option.correct} onChange={e => edit({ options: question.options.map((v, k) => ({ ...v, correct: k === j ? e.target.checked : question.type === "single_choice" ? false : v.correct })) })} />
              <Field label={`Pilihan ${String.fromCharCode(65 + j)} soal ${index + 1}`} maxLength={2000} value={option.text} onChange={e => edit({ options: question.options.map((v, k) => j === k ? { ...v, text: e.target.value } : v) })} />
              <Button aria-label={`Hapus pilihan ${j + 1} soal ${index + 1}`} disabled={question.options.length <= 2} onClick={() => edit({ options: question.options.filter((_, k) => k !== j) })}>×</Button>
            </div>)}
            <Button disabled={question.options.length >= 6} onClick={() => edit({ options: [...question.options, { text: "", correct: false }] })}>Tambah pilihan</Button>
          </>}
          <div className="exam-actions"><Button aria-label={`Naikkan soal ${index + 1}`} disabled={index === 0} onClick={() => move(-1)}>↑ Geser ke awal</Button><Button aria-label={`Turunkan soal ${index + 1}`} disabled={index === questions.length - 1} onClick={() => move(1)}>↓ Geser ke akhir</Button><Button onClick={remove}>Hapus soal {index + 1}</Button></div>
        </article>
        <div className="exam-question-controls" aria-label="Navigasi editor soal">
          <Button disabled={index === 0} onClick={() => navigate(index - 1)}>← Soal sebelumnya</Button>
          <Button disabled={index === questions.length - 1} onClick={() => navigate(index + 1)}>Soal berikutnya →</Button>
          <Button variant="primary" onClick={add} disabled={questions.length >= 50 || !validDefault}>+ Tambah soal baru</Button>
        </div>
      </div>
    </div>}
  </div>;
}
