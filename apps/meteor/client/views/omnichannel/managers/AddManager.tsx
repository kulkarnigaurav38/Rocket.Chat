import { Button, Box, Field } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { useState, ReactElement } from 'react';

import UserAutoComplete from '../../../components/UserAutoComplete';
import { useEndpointAction } from '../../../hooks/useEndpointAction';

const AddManager = ({ reload }: { reload: () => void }): ReactElement => {
	const t = useTranslation();
	const [username, setUsername] = useState('');

	const saveAction = useEndpointAction('POST', 'livechat/users/manager', { username });

	const handleSave = useMutableCallback(async () => {
		if (!username) {
			return;
		}
		const result = await saveAction();
		if (!result?.success) {
			return;
		}
		reload();
		setUsername('');
	});
	return (
		<Box display='flex' alignItems='center' pi='x24'>
			<Field>
				<Field.Label>{t('Username')}</Field.Label>
				<Field.Row>
					<UserAutoComplete value={username} onChange={setUsername} />
					<Button disabled={!username} onClick={handleSave} mis='x8' primary>
						{t('Add')}
					</Button>
				</Field.Row>
			</Field>
		</Box>
	);
};

export default AddManager;
