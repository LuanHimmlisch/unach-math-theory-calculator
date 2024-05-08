import * as ohm from 'ohm-js';

const dict = {
       suma: "+",
       resta: "-",
       mult: "*",
       div: "/",
       pow: "^",
       lparen: "(",
       rparen: ")",
};

const grammar = ohm.grammar(`
Grammar {
    Exp = AddExp

    AddExp = AddExp "${dict.suma}" MulExp  -- suma
           | AddExp "${dict.resta}" MulExp  -- resta
           | MulExp

    MulExp = MulExp "${dict.mult}" PowExp  -- mult
           | MulExp "${dict.div}" PowExp  -- div
           | PowExp

    PowExp = PriExp "${dict.pow}" PowExp -- pow
           | PriExp

    PriExp = "${dict.lparen}" Exp "${dict.rparen}" -- paren
           | "${dict.suma}" PriExp -- pos
           | "${dict.resta}" PriExp -- neg
           | number

    number = digit* "." digit+ -- float
           | digit+ -- integer
}
`);
const semantics = grammar.createSemantics();

const lexer = (input = '') => {
       const signs = Object.keys(dict);
       input = input.replace(/\t\r\s/, '');
       let matches = [];
       let col = 0;

       do {
              const char = input.charAt(0);
              let skip = 1;
              let found = false;

              for (let index = 0; index < signs.length; index++) {
                     const key = signs[index];
                     const sign = dict[key];

                     if (sign == char) {
                            matches.push({
                                   token: sign,
                                   type: key,
                                   col
                            });
                            found = true;
                     }
              }

              if (!found) {
                     const numeric = input.match(/^(\d+)(\.\d+)?/)
                     if (numeric) {
                            matches.push({
                                   token: numeric[0],
                                   type: 'numeric',
                                   col
                            });
                            skip = numeric[0].length;
                            found = true;
                     }
              }

              if (!found) {
                     throw Error(`Invalid token ${char}`);
              }

              col += skip;
              input = input.slice(skip);
       } while (input.length);

       return matches;
}


export { grammar, lexer, dict };