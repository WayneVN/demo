'use strict';

import React, { Component } from 'react';
import If from './If';
import Loading from './loading';

export default class Loader extends Component {
    static displayName = 'Loader';

    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.loaded) {
            return this.props.children;
        } else {
            return ( < Loading / > );
        }
    }
}
