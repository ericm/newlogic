import '../utils/enzymeConfig';

import { mount } from 'enzyme';
import * as React from 'react';
import Home from '../../app/components/Home';
import sinon = require('sinon');
import Menu from '../../app/components/Menu';

describe("<Home />", () => {
    it("calls componentDidMount", () => {
        sinon.spy(Home.prototype, 'componentDidMount');
        mount(<Home />);
        
        expect(Home.prototype.componentDidMount).toHaveProperty('callCount', 1);
    });

    it("renders Menu", () => {
        const wrapper = mount(<Home />);
        
        expect(wrapper.find(Menu)).toHaveLength(1);
    });
    
});