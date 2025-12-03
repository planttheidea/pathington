import * as src from '../src';

const now = window.performance.now();

for (let index = 0; index < 1000000; index++) {
  src.parse('dot[0].with[brackets].and[`"nested" \'quoted\' keys`]');
}

console.log(window.performance.now() - now);

console.group('parse');
console.log('simple', src.parse('simple'));
console.log('simple quoted key', src.parse('simple quoted key'));
console.log('dotted', src.parse('dot.separated'));
console.log('dotted with brackets', src.parse('dot["0"].with[brackets]'));
console.log('dotted with brackets and quoted keys', src.parse('dot[0].with[brackets]["and quoted keys"]'));
console.log('nested quoted keys', src.parse('dot[0].with[`"nested" \'quoted\' keys`]'));
console.log('valid JS keys', src.parse('standard["$dollar"].underscore_separated'));
console.log('empty string as key', src.parse(''));
console.log('coalesced object', src.parse(null));
console.log('JSON as key', src.parse(JSON.stringify({ foo: 'bar' })));
console.groupEnd();

console.group('create');
console.log('simple', src.create(['simple']));
console.log('simple with quotes', src.create(['9fs']));
console.log('dotted', src.create(['dot', 'separated']));
console.log('dotted with brackets', src.create(['dot', 0, 'with', 2, 'brackets']));
console.log('dotted with brackets and quoted keys', src.create(['dot', 0, 'with', 2, 'brackets', 'and quoted keys']));
console.log(
  'dotted with brackets and weird characters',
  src.create(['dot', 0, 'with', 2, 'brackets', 'and', '[wierd', '%characters#]']),
);
console.log(
  'dotted with brackets and quoted keys with custom quote',
  src.create(['dot', 0, 'with', 2, 'brackets', 'and quoted keys'], '`'),
);
console.groupEnd();

console.group('parse the created');
console.log('simple', src.parse(src.create(['simple'])));
console.log('dotted', src.parse(src.create(['dot', 'separated'])));
console.log('dotted with brackets', src.parse(src.create(['dot', 0, 'with', 2, 'brackets'])));
console.log(
  'dotted with brackets and quoted keys',
  src.parse(src.create(['dot', 0, 'with', 2, 'brackets', 'and quoted keys'])),
);
console.log(
  'dotted with brackets and weird characters',
  src.parse(src.create(['dot', 0, 'with', 2, 'brackets', 'and', '[wierd', '%characters#]'])),
);
console.log(
  'dotted with brackets and quoted keys with custom quote',
  src.parse(src.create(['dot', 0, 'with', 2, 'brackets', 'and quoted keys'], '`')),
);
console.groupEnd();

export function App() {
  return <div>Check the console for details.</div>;
}
