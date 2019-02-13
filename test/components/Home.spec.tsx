import '../utils/enzymeConfig';

import { mount } from 'enzyme';
import * as React from 'react';
import Home from '../../app/components/Home';
import * as sinon from 'sinon';
import Menu from '../../app/components/Menu';
import Workspace from '../../app/components/Workspace';
import WindowBar from '../../app/components/WindowBar';

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
    
    it("renders Workspaces", () => {
        const wrapper = mount(<Home />);
        
        expect(wrapper.find(Workspace).length).toBeGreaterThanOrEqual(1);
    });
    
    it("renders WindowBars", () => {
        const wrapper = mount(<Home />);
        
        expect(wrapper.find(WindowBar).length).toBeGreaterThanOrEqual(1);
    });

});