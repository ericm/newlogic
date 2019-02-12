import { shallow } from 'enzyme';
import * as React from 'react';
import Home from '../../app/components/Home';
import WindowBar from '../../app/components/WindowBar';

describe("<Home />", () => {
    it("renders Menu", () => {
        const wrapper = shallow(<Home />);
        expect(wrapper.find(WindowBar)).toHaveLength(1);
    });
});