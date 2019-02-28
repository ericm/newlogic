import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import Workspace from '../../app/components/Workspace';
import { WorkspaceState } from '../../app/interfaces/components';
import '../utils/enzymeConfig';


const el = (<Workspace testing={true} width={100} height={100} />);

describe("<Workspace />", () => {
    it("calls componentDidMount", () => {
        sinon.spy(Workspace.prototype, 'componentDidMount');
        mount(el);

        expect(Workspace.prototype.componentDidMount).toHaveProperty('callCount', 1);
    });

    it("renders canvas", () => {
        const wrapper = mount(el);

        expect(wrapper.find("canvas")).toHaveLength(1);
    });

    it("changes mode", () => {
        const wrapper: ReactWrapper<{}, WorkspaceState> = mount(el);

        wrapper.setState({ mode: "click" });
        expect(wrapper.state().mode).toBe("click");
    });

});