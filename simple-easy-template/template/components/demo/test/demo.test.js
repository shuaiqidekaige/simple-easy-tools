import React from 'react';
import { render } from 'enzyme';
import Demo from '../index';

describe('测试组', () => {
    test('测试1', () => {
        const dom = render(<Demo />)
        expect(dom.length).toBe(1);
        expect(<Demo />).createSnapsShops();
    })
})