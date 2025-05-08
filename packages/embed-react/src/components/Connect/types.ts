import { CommonComponentProps } from '../../types/CommonComponentProps';
import { Project, ActivationCreate, ConnectionTemplate } from '@versori/sdk/platform';

export type ConnectProps = CommonComponentProps & {
    userId: string;
    orgId: string;
    project: Project;
    connectionTemplates: ConnectionTemplate[];
    onConnect: (payload: ActivationCreate) => Promise<void>;
    onCancel: () => void;
};
