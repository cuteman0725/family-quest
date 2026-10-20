// 用瀏覽器內建的語音朗讀題目（iPad Safari、Android Chrome 都支援）

import { speakFractions } from './fraction'

let voice: SpeechSynthesisVoice | null | undefined

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? []
  const norm = (l: string) => l.replace('_', '-').toLowerCase()
  return (
    voices.find((v) => norm(v.lang) === 'zh-tw') ??
    voices.find((v) => norm(v.lang).startsWith('zh-hant')) ??
    voices.find((v) => norm(v.lang).startsWith('zh')) ??
    null
  )
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voice = pickVoice()
  }
}

/** 把題目裡的符號換成唸得出來的字 */
function speakable(text: string) {
  return speakFractions(text)
    .replace(/（\s*）|\(\s*\)|（　）|□/g, '空格')
    .replace(/\?/g, '問號')
    .replace(/>/g, '大於')
    .replace(/</g, '小於')
    .replace(/[－−]/g, '減')
    .replace(/＋|\+/g, '加')
}

export function speak(text: string) {
  const synth = window.speechSynthesis
  if (!synth) return
  if (voice === undefined) voice = pickVoice()
  synth.cancel()
  const u = new SpeechSynthesisUtterance(speakable(text))
  u.lang = 'zh-TW'
  if (voice) u.voice = voice
  u.rate = 0.9
  synth.speak(u)
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window
