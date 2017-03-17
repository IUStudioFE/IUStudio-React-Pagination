import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';

import BreakView from '../src/BreakView';
import PageView from '../src/PageView';
import IUStudioPagination from '../src/IUStudioPagination';

describe('IUStudioPagination Shallow', function() {
    it('test should render a component', function() {
        expect(shallow(<IUStudioPagination />).is('.pagination')).to.equal(true);
        expect(shallow(<IUStudioPagination />).find('li').first().find('a').text()).to.equal('前一页');
        expect(shallow(<IUStudioPagination />).find('li').last().find('a').text()).to.equal('后一页');
        expect(mount(<IUStudioPagination />).find('li').length).to.equal(9);
    })

    it('test previous and next buttons', function() {
        const pagination = mount(<IUStudioPagination />)
        const paginationA = pagination.find('a');
        const pervious = paginationA.first();
        const next = paginationA.last();
        next.simulate('click');
        expect(pagination.find('.selected').find('a').text()).to.equal('2');
        pervious.simulate('click');
        expect(pagination.find('.selected').find('a').text()).to.equal('1');
    })

    it('test click on page item', function() {
        const pagination = mount(<IUStudioPagination />);
        const paginationA = pagination.find('a');
        const pageItem = paginationA.at(3);
        pageItem.simulate('click');
        expect(pagination.find('.selected').find('a').text()).to.equal('3');
    })

    it('should render href attribute in items if hrefBuilder is specified', function() {
        const pagination = mount(<IUStudioPagination hrefBuilder={(page) => `${page}-custom`} />);
        const paginationA = pagination.find('a');
        const next = paginationA.at(2);
        expect(next.prop('href')).to.equal(`2-custom`);
    })

    it('should not render href attribute in items if hrefBuilder is undefined', function() {
        const pagination = mount(<IUStudioPagination />);
        const paginationA = pagination.find('a');
        const next = paginationA.at(2);
        expect(next.prop('href')).to.equal(undefined);
    })

})