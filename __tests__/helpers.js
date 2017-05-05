import * as helpers from '../lib/helpers';

test('upperFirst function', () => {
	expect(helpers.upperFirst('first second third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first-second-third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first_second_third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first_second third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first_second-third')).toBe('FirstSecondThird');
	expect(helpers.upperFirst('first second-third')).toBe('FirstSecondThird');
});