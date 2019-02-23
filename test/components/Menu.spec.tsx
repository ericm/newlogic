import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import Menu from '../../app/components/Menu';
import '../utils/enzymeConfig';

const el = (<Menu width={100} height={100} />);

describe("<Menu />", () => {
    it("calls render", () => {
        sinon.spy(Menu.prototype, 'render');
        mount(el);

        expect(Menu.prototype.render).toHaveProperty('callCount', 1);
    });

});