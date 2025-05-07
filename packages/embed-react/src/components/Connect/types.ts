import { CommonComponentProps } from '../../types/CommonComponentProps';
import { Project, ActivationCreate, ConnectionTemplate } from '../../../../sdk/src/platform';

export type ConnectProps = CommonComponentProps & {
    userId: string;
    orgId: string;
    project: Project;
    connectionTemplates: ConnectionTemplate[];
    onConnect: (payload: ActivationCreate) => Promise<void>;
    onCancel: () => void;
};
