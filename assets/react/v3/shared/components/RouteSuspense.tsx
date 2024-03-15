import LoadingSpinner from '@Atoms/LoadingSpinner';
import { type ReactNode, Suspense } from 'react';

type RouteSuspenseProps = {
	component: ReactNode;
};

const RouteSuspense = ({ component }: RouteSuspenseProps) => {
	return <Suspense fallback={<LoadingSpinner />}>{component}</Suspense>;
};

export default RouteSuspense;
