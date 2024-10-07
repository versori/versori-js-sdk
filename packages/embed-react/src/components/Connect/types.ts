import { ActivationCreate, EmbeddedIntegration } from '@versori/sdk/embedded';
import { CommonComponentProps } from '../../types/CommonComponentProps';

export type ConnectProps = CommonComponentProps & {
    userId: string;
    integration: EmbeddedIntegration;
    onConnect: (payload: ActivationCreate) => Promise<void>;
    onCancel: () => void;
};
