import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './app.global.scss';
import Home from './components/Home';

render(
	<AppContainer>
		<Home />
	</AppContainer>,
	document.getElementById('root')
);


