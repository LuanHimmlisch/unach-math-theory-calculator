import Alpine from "alpinejs";
import { parsePure } from "./parser";

Alpine.data('calculator', () => ({
    input: '',
    steps: [],
    errors: [],
    result: null,
    add(text) {
        this.input = `${this.input}${text}`;
        this.$refs.input.select();
    },
    remove() {
        this.input = (this.input ?? '').slice(0, (this.input?.length ?? 0) - 1);
        this.$refs.input.select();
    },
    calculate() {
        this.input = (this.input ?? '').trim();
        if (this.input === '') {
            this.errors = [];
            return;
        }

        const result = parsePure(!this.input ? (this.input * 1) : this.input);

        this.errors = result.parseErrors;
        this.result = result.value;
    }
}));

Alpine.start();


window.Alpine = Alpine;