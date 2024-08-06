import { Box } from '@mui/material';
import { WorkerList } from './WorkerList';
import { WorkTimeList } from './WorkTimeList';

export const UserInputList = () => {
	return (
		<Box display='flex' flexDirection='column' gap={5}>
			<WorkTimeList />
			<WorkerList />
		</Box>
	);
};
