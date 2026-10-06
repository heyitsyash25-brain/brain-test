/**
 * Quinfosys™ Quantum Brain — Client-side Quantum State Simulator
 * Handles statevector evolution, gate matrix tensor products,
 * probability distribution, and expectation value calculation.
 */

// Complex number arithmetic helper
class Complex {
  constructor(re = 0, im = 0) {
    this.re = re;
    this.im = im;
  }

  add(c) {
    return new Complex(this.re + c.re, this.im + c.im);
  }

  sub(c) {
    return new Complex(this.re - c.re, this.im - c.im);
  }

  mul(c) {
    return new Complex(
      this.re * c.re - this.im * c.im,
      this.re * c.im + this.im * c.re
    );
  }

  scale(factor) {
    return new Complex(this.re * factor, this.im * factor);
  }

  normSq() {
    return this.re * this.re + this.im * this.im;
  }

  abs() {
    return Math.sqrt(this.normSq());
  }

  toString() {
    if (Math.abs(this.im) < 1e-6) return this.re.toFixed(3);
    if (Math.abs(this.re) < 1e-6) return `${this.im.toFixed(3)}i`;
    const sign = this.im >= 0 ? "+" : "-";
    return `${this.re.toFixed(3)} ${sign} ${Math.abs(this.im).toFixed(3)}i`;
  }
}

class QuantumEngine {
  constructor(numQubits = 2) {
    this.numQubits = numQubits;
    this.dim = 1 << numQubits;
    this.state = this.createZeroState();
  }

  setQubitCount(numQubits) {
    this.numQubits = numQubits;
    this.dim = 1 << numQubits;
    this.state = this.createZeroState();
  }

  createZeroState() {
    const state = new Array(this.dim).fill(null).map(() => new Complex(0, 0));
    state[0] = new Complex(1, 0); // |00...0>
    return state;
  }

  reset() {
    this.state = this.createZeroState();
  }

  // Single qubit gate matrices [ [u00, u01], [u10, u11] ]
  getGateMatrix(type, param = 0) {
    const invSqrt2 = 1 / Math.SQRT2;
    switch (type.toUpperCase()) {
      case "H":
        return [
          [new Complex(invSqrt2, 0), new Complex(invSqrt2, 0)],
          [new Complex(invSqrt2, 0), new Complex(-invSqrt2, 0)]
        ];
      case "X":
        return [
          [new Complex(0, 0), new Complex(1, 0)],
          [new Complex(1, 0), new Complex(0, 0)]
        ];
      case "Y":
        return [
          [new Complex(0, 0), new Complex(0, -1)],
          [new Complex(0, 1), new Complex(0, 0)]
        ];
      case "Z":
        return [
          [new Complex(1, 0), new Complex(0, 0)],
          [new Complex(0, 0), new Complex(-1, 0)]
        ];
      case "RY": {
        const theta = parseFloat(param) || 0;
        const c = Math.cos(theta / 2);
        const s = Math.sin(theta / 2);
        return [
          [new Complex(c, 0), new Complex(-s, 0)],
          [new Complex(s, 0), new Complex(c, 0)]
        ];
      }
      case "RZ": {
        const phi = parseFloat(param) || 0;
        const c = Math.cos(phi / 2);
        const s = Math.sin(phi / 2);
        return [
          [new Complex(c, -s), new Complex(0, 0)],
          [new Complex(0, 0), new Complex(c, s)]
        ];
      }
      case "S":
        return [
          [new Complex(1, 0), new Complex(0, 0)],
          [new Complex(0, 0), new Complex(0, 1)]
        ];
      case "T": {
        const angle = Math.PI / 4;
        return [
          [new Complex(1, 0), new Complex(0, 0)],
          [new Complex(0, 0), new Complex(Math.cos(angle), Math.sin(angle))]
        ];
      }
      default:
        return [
          [new Complex(1, 0), new Complex(0, 0)],
          [new Complex(0, 0), new Complex(1, 0)]
        ];
    }
  }

  applySingleGate(targetQubit, type, param = 0) {
    const u = this.getGateMatrix(type, param);
    const newState = new Array(this.dim).fill(null).map(() => new Complex(0, 0));
    const bitMask = 1 << (this.numQubits - 1 - targetQubit);

    for (let i = 0; i < this.dim; i++) {
      if ((i & bitMask) === 0) {
        const i0 = i;
        const i1 = i | bitMask;
        const psi0 = this.state[i0];
        const psi1 = this.state[i1];

        newState[i0] = u[0][0].mul(psi0).add(u[0][1].mul(psi1));
        newState[i1] = u[1][0].mul(psi0).add(u[1][1].mul(psi1));
      }
    }
    this.state = newState;
  }

  applyCNOT(controlQubit, targetQubit) {
    const newState = new Array(this.dim).fill(null).map(() => new Complex(0, 0));
    const ctrlMask = 1 << (this.numQubits - 1 - controlQubit);
    const targMask = 1 << (this.numQubits - 1 - targetQubit);

    for (let i = 0; i < this.dim; i++) {
      if ((i & ctrlMask) !== 0) {
        const flipped = i ^ targMask;
        newState[flipped] = this.state[i];
      } else {
        newState[i] = this.state[i];
      }
    }
    this.state = newState;
  }

  simulateCircuit(circuit) {
    this.setQubitCount(circuit.qubits);
    const maxSteps = Math.max(0, ...circuit.gates.map(g => g.step)) + 1;

    for (let step = 0; step < maxSteps; step++) {
      const stepGates = circuit.gates.filter(g => g.step === step);
      
      const cnotCtrl = stepGates.find(g => g.type === "CNOT_CTRL");
      if (cnotCtrl) {
        const cnotTarg = stepGates.find(g => g.type === "CNOT_TARG" && g.control === cnotCtrl.qubit);
        if (cnotTarg) {
          this.applyCNOT(cnotCtrl.qubit, cnotTarg.qubit);
        }
      }

      for (const gate of stepGates) {
        if (gate.type !== "CNOT_CTRL" && gate.type !== "CNOT_TARG") {
          this.applySingleGate(gate.qubit, gate.type, gate.param);
        }
      }
    }

    return this.getResults();
  }

  getResults() {
    const probabilities = [];
    let entropy = 0;

    for (let i = 0; i < this.dim; i++) {
      const p = this.state[i].normSq();
      const binary = i.toString(2).padStart(this.numQubits, "0");
      probabilities.push({
        basisState: `|${binary}⟩`,
        index: i,
        amplitude: this.state[i],
        probability: Math.min(1, Math.max(0, p))
      });

      if (p > 1e-9) {
        entropy -= p * Math.log2(p);
      }
    }

    const zExpectations = [];
    for (let q = 0; q < this.numQubits; q++) {
      const mask = 1 << (this.numQubits - 1 - q);
      let expZ = 0;
      for (let i = 0; i < this.dim; i++) {
        const p = this.state[i].normSq();
        const sign = (i & mask) === 0 ? 1 : -1;
        expZ += sign * p;
      }
      zExpectations.push({ qubit: q, value: expZ });
    }

    return {
      qubitCount: this.numQubits,
      probabilities,
      vonNeumannEntropy: entropy.toFixed(3),
      zExpectations,
      isEntangled: entropy > 0.05
    };
  }
}

window.Complex = Complex;
window.QuantumEngine = QuantumEngine;

export { Complex, QuantumEngine };
