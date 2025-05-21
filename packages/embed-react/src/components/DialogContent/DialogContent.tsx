import { Dialog, Flex, VisuallyHidden } from '@radix-ui/themes';
import { ReactNode } from 'react';
import { DialogClose } from './DialogClose';

export type DialogContentProps = {
    children?: ReactNode;
    title: string;
    description: string;
};

export function DialogContent({ children, title, description }: DialogContentProps) {
    return (
        <Dialog.Content>
            <VisuallyHidden>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
            </VisuallyHidden>
            <DialogClose />
            <Flex direction="column">{children}</Flex>
        </Dialog.Content>
    );
}
