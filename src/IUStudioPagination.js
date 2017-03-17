'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import createFragment from 'react-addons-create-fragment';
import PageView from './PageView';
import BreakView from './BreakView';

export default class IUStudioPagination extends Component {
    static propTypes = {
        pageCount: PropTypes.number.isRequired,
        pageRangeDisplayed: PropTypes.number.isRequired, // 表示中间省略的跨度页数
        marginPagesDisplayed: PropTypes.number.isRequired, // 表示前后几项给显示
        previousLabel: PropTypes.node,
        nextLabel: PropTypes.node,
        breakLabel: PropTypes.node,
        initialPage: PropTypes.number,
        onPageChange: PropTypes.func,
        hrefBuilder: PropTypes.func,
        disabeldInitialCallback: PropTypes.bool,
        containerClassName: PropTypes.string,
        pageClassName: PropTypes.string,
        pageLinkClassName: PropTypes.string,
        activeClassName: PropTypes.string,
        previousClassName: PropTypes.string,
        previousLinkClassName: PropTypes.string,
        nextClassName: PropTypes.string,
        nextLinkClassName: PropTypes.string,
        disabeldClassName: PropTypes.string,
        breakClassName: PropTypes.string
    }

    static defaultProps = {
        pageCount: 10,
        pageRangeDisplayed: 2,
        marginPagesDisplayed: 3,
        activeClassName: "selected",
        previousLabel: "前一页",
        previousClassName: "previous",
        nextLabel: "后一页",
        nextClassName: "next",
        containerClassName: "pagination",
        breakLabel: "...",
        disabeldClassName: "disabled",
        disabeldInitialCallback: false
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: props.initialPage ? props.initialPage : 0
        };
    }

    componentDidMount() {
        if(typeof(this.props.initialPage) !== 'undefined' && !this.props.disabeldInitialCallback) {
            this.callCallback(this.props.initialPage);
        }
    }
    
    componetWillReceiveProps(nextProps) {
        // ...
    }

    handlePreviousPage = evt => {
        evt.preventDefault();
        if(this.state.selected > 0) {
            this.handlePageSelected(this.state.selected - 1, evt);
        }
    }

    handleNextPage = evt => {
        evt.preventDefault();
        if(this.state.selected < this.props.pageCount - 1) {
            this.handlePageSelected(this.state.selected + 1, evt);
        }
    }
  
    handlePageSelected = (selected, evt) => {
        evt.preventDefault();

        if(this.state.selected === selected) {
            return false;
        }

        this.setState({selected: selected});

        this.callCallback(selected);
    }

    hrefBuilder = (index) => {
        if(this.props.hrefBuilder && 
           index >= 0 &&
           index < this.props.pageCount &&
           index !== this.state.selected
           ) {
               return this.props.hrefBuilder(index + 1);
           }
    }

    callCallback = (selected) => {
        if(typeof(this.props.onPageChange) !== 'undefined' &&
           typeof(this.props.onPageChange) === 'function') {
            this.props.onPageChange({selected});
        }
    }

    getPageElement(index) {
        return <PageView
            onClick={this.handlePageSelected.bind(null, index)}
            pageClassName={this.props.pageClassName}
            selected={this.state.selected === index}
            pageLinkClassName={this.props.pageLinkClassName}
            href={this.hrefBuilder(index)}
            page={index + 1}
            activeClassName={this.props.activeClassName}/>
    }

    pagination = () => {
        let items = {};
        
        if(this.props.pageCount <= this.props.pageRangeDisplayed) {
            for(let index = 0; i < this.props.pageCount; index++) {
                items['key' + index] = this.getPageElement(index)
            }
        } else {
            let leftSide = this.props.pageRangeDisplayed / 2;
            let rightSide = this.props.pageRangeDisplayed - leftSide;
            
            if(this.state.selected > (this.props.pageCount - this.pageRangeDisplayed / 2)) {
                rightSide = this.state.selected;
                leftSide = this.props.pageRangeDisplayed - rightSide;
            } else if(this.state.selected < this.props.pageRangeDisplayed / 2) {
                leftSide = this.state.selected;
                rightSide = this.props.pageRangeDisplayed - leftSide;
            }

            let index;
            let page;
            let breakView;

            for(index = 0; index < this.props.pageCount; index++) {
                page = index + 1;
                let pageView = this.getPageElement(index);
                if(page <= this.props.marginPagesDisplayed) {
                    items['key' + index] = pageView;
                    continue;
                }
                if(page > this.props.pageCount - this.props.marginPagesDisplayed) {
                    items['key' + index] = pageView;
                    continue;
                }

                if((index > this.state.selected - leftSide) && (index < this.state.selected + rightSide)) {
                    items['key' + index] = pageView;
                    continue;
                }

                let keys = Object.keys(items);
                let breakLabelKey = keys[keys.length - 1];
                let breakLabelValue = items[breakLabelKey];

                if(this.props.breakLabel && breakLabelValue !== breakView) {
                    breakView = (
                        <BreakView 
                            breakLabel={this.props.breakLabel}
                            breakClassName={this.props.breakClassName}
                        />
                    );
                   items['key' + index] = breakView;
                }
            }
        }
        return items;
    }

    render() {
        let disabled = this.props.disabeldClassName;
        const previousClasses = classNames(this.props.previousClassName,
                                            {[disabled]: this.state.selected === 0});
        const nextClasses = classNames(this.props.nextClassName,
                                            {[disabled]: this.state.selected === this.props.pageCount - 1});
        return (
            <ul className={this.props.containerClassName}>
                <li className={previousClasses}>
                    <a className={this.props.pageLinkClassName}
                       onClick={this.handlePreviousPage}
                       href={this.hrefBuilder(this.state.selected - 1)}
                       tabIndex="0">
                       {this.props.previousLabel}
                    </a>
                </li>

                {createFragment(this.pagination())}

                <li className={nextClasses}>
                    <a className={this.props.pageLinkClassName}
                       onClick={this.handleNextPage}
                       href={this.hrefBuilder(this.state.selected + 1)}
                       tabIndex="0">
                       {this.props.nextLabel}
                    </a>
                </li>

            </ul>
        )
    }
}