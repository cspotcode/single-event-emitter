import {EventEmitter as EE, EmitSpecExtract, EmitMethod} from '../index';

function doStuff() {}

const a = new EE();
a.emit(1, 2, 3);
const b = new EE<[0]>();
b.emit();
b.on(() => {
    doStuff();
});
const c = new EE<[1, (martini: 'shaken' | 'stirred') => void]>();
c.emit('shaken');
c.on(() => {
    doStuff();
});
const d = new EE<[-1, (martini: 'shaken' | 'stirred') => void]>();
d.emit();
d.on((a) => {
    doStuff();
});

const e = new EE<[2, (c: 123, d: 456) => void, {foo: any}]>();
e.emit(123, 456);
e.on((a) => {
    doStuff();
});
e.on(function(this: {bar: any}, a, c) {
    this.bar;
}, {foo: 'hello'});
