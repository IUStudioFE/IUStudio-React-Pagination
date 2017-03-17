'use strict';

import React, { Component } from 'react';

export default class BreakView extends Component {
    render() {
        let label = this.props.breakLabel;
        let className = this.props.breakClassName || 'break';

        return (
            <li className={className}>
                {label}
            </li>
        );
    }
};

