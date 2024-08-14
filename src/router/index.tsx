import { createBrowserRouter } from 'react-router-dom';
import { SchedulerPage } from '@/pages/SchedulerPage';

export const router = createBrowserRouter([
	{
		path: '/*',
		element: <SchedulerPage />,
	},
]);
