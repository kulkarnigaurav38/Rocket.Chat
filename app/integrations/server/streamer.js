import { hasAtLeastOnePermission } from '../../authorization/server';
import { IntegrationHistory } from '../../models/server';
import notifications from '../../notifications/server/lib/Notifications';

notifications.streamIntegrationHistory.allowRead(function() {
	return this.userId && hasAtLeastOnePermission(this.userId, [
		'manage-outgoing-integrations',
		'manage-own-outgoing-integrations',
	]);
});

IntegrationHistory.on('change', ({ clientAction, id, data, diff }) => {
	switch (clientAction) {
		case 'updated': {
			const history = IntegrationHistory.findOneById(id, { fields: { 'integration._id': 1 } });
			if (!history && !history.integration) {
				return;
			}
			notifications.streamIntegrationHistory.emit(history.integration._id, { id, diff, type: clientAction });
			break;
		}
		case 'inserted': {
			notifications.streamIntegrationHistory.emit(data.integration._id, { data, type: clientAction });
			break;
		}
	}
});
