'use strict';

import React, { Component } from 'react';

export default class PageView extends Component {
    render() {
        let cssClassName = this.props.pageClassName;
        const onClick = this.props.onClick;
        const linkClassName = this.props.pageLinkClassName;
        const href = this.props.href;

        if(this.props.selected) {
            if(typeof(cssClassName) !== 'undefined') {
                cssClassName = cssClassName + ' ' + this.props.activeClassName;
            } else {
                cssClassName = this.props.activeClassName;
            }
        }

        return (
            <li className={cssClassName}>
                <a onClick={onClick}
                   className={linkClassName}
                   href={href}
                   tabIndex="0">
                   {this.props.page}
                </a>
            </li>
        )
    }
};