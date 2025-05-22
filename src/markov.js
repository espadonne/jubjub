// src/markov.js
export class Markov {
  constructor(order = 2) {
    this.order = order;
    this.chain = {};
    this.corpusSize = 0;
  }

  train(lines) {
    this.chain = {};
    lines.forEach(line => {
      const text = line.trim();
      if (!text) return;
      for (let i = 0; i <= text.length - this.order; i++) {
        const state = text.substring(i, i + this.order);
        const next = text[i + this.order];
        this.chain[state] = this.chain[state] || [];
        this.chain[state].push(next);
      }
    });
    this.corpusSize = lines.length;
  }

  generate(maxLen = 8, seed, temp = 1.0) {
    if (!this.corpusSize) return '';
    let state;
    if (seed) {
      const rep = seed.length < this.order
        ? seed.repeat(Math.ceil(this.order / seed.length)).slice(0, this.order)
        : seed.slice(0, this.order);
      state = this.chain[rep] ? rep : this.randomKey();
    } else {
      state = this.randomKey();
    }
    let output = state;
    for (let i = 0; i < maxLen - this.order; i++) {
      const choices = this.chain[state];
      if (!choices || !choices.length) break;
      const next = this.weightedChoice(choices, temp);
      output += next;
      state = output.slice(-this.order);
    }
    return output;
  }

  randomKey() {
    const keys = Object.keys(this.chain);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  weightedChoice(chars, temp) {
    const freq = {};
    chars.forEach(c => freq[c] = (freq[c] || 0) + 1);
    const entries = Object.entries(freq);
    const weights = entries.map(([_, f]) => Math.pow(f, 1 / temp));
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < entries.length; i++) {
      r -= weights[i];
      if (r <= 0) return entries[i][0];
    }
    return entries[entries.length - 1][0];
  }
}