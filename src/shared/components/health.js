import React from 'react'

import packageJson from '../../../package.json'

export default (props) => (
	<div>
		<div>
            <h1>Versao: {packageJson.version}</h1>
		</div>
	</div>
)