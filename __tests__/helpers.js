import * as helpers from '../lib/helpers';

test('upperFirst function', () => {
	expect(helpers.upperFirst('first second third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first-second-third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first_second_third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first_second third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first_second-third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first second-third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('firstsecondthird')).toBe('Firstsecondthird');
});

test('trimEnd function', () => {
	expect(helpers.trimEnd('http://test.com/', '/')).toBe('http://test.com');
	expect(helpers.trimEnd('http://test.com/', ' ')).toBe('http://test.com/');
	expect(helpers.trimEnd('http://test.com/     ', ' ')).toBe('http://test.com/');
	expect(helpers.trimEnd('  http://test.com/     ', ' ')).toBe('  http://test.com/');
});

test('qs function', () => {
	expect(helpers.qs({a: 1, b: 2})).toBe('a=1&b=2');
	expect(helpers.qs({b: 2, a: 1})).toBe('a=1&b=2');
	expect(helpers.qs({a: 1, b: 2, a: 3})).toBe('a=3&b=2');
	expect(helpers.qs({a: [1, 2, 3], b: 2})).toBe('a[0]=1&a[1]=2&a[2]=3&b=2');
	expect(helpers.qs({a: {c: 1, d: 2}, b: {c: 3, d: 4}})).toBe('a[c]=1&a[d]=2&b[c]=3&b[d]=4');
	expect(helpers.qs({a: {c: [1, 2, 3], d: 4}, b: {c: 5, d: 6}})).toBe('a[c][0]=1&a[c][1]=2&a[c][2]=3&a[d]=4&b[c]=5&b[d]=6');
	expect(helpers.qs({})).toBe('');
});