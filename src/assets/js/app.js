import Alpine from "alpinejs";
import { dict, grammar, lexer } from "./parser";
import { toAST } from 'ohm-js/extras';

Alpine.data('calculator', () => ({
    input: '',
    steps: [],
    errors: [],
    rows: 0,
    tree: '',
    result: null,
    lexer: [],
    add(text) {
        this.input = `${this.input}${text}`;
        this.$refs.input.select();
    },
    remove() {
        this.input = (this.input ?? '').slice(0, (this.input?.length ?? 0) - 1);
        this.$refs.input.select();
    },
    calculate() {
        this.errors = [];
        this.tree = null;
        this.lexer = [];
        this.input = (this.input ?? '').trim();
        this.rows = 0;

        if (this.input === '') {
            return;
        }

        try {
            const result = lexer(this.input);

            this.lexer = result;
        } catch (error) {
            this.errors = [error.toString()];
            return;
        }

        const match = grammar.match(this.input);


        if (match.failed()) {
            this.errors = [match.message];
            return;
        }

        const tree = toAST(match);

        const wrap = (data) => `<div class="node">${data}</div>`;

        const getDivs = (nodes) => {
            if (typeof nodes === typeof '') {
                return wrap(nodes);
            }

            if (typeof nodes === typeof {}) {
                this.rows++;
                return '<div style="display:flex;gap:0.5rem;position:relative;margin:32px 32px 0;" >' + wrap(dict[nodes.type.match(/(?<=_)(.*)$/)[0]]) + '<div class="flex gap-2" style="position: absolute;top: 0;transform: translateY(-100%) translateX(-50%);left: 50%; align-items: end;">' + getDivs(nodes['0']) + getDivs(nodes['2']) + '</div> </div>'
            }

        }

        this.tree = getDivs(tree);

        this.result = eval(this.input);

        // const result = parsePure(!this.input ? (this.input * 1) : this.input);

        // this.result = result.value;
    }
}));

Alpine.start();


window.Alpine = Alpine;